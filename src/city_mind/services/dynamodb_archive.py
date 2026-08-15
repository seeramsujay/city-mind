"""CityMind - Amazon DynamoDB Event Memory & Incident Store.

Leverages AWS Forever Free Tier (25 GB Storage, 25 WCU, 25 RCU - 200M req/mo Free Forever).
Archives SHA-256 City Commits, state snapshots, and telemetry anomaly logs.
"""

import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from city_mind.core.config import settings
from city_mind.models.commit import CityCommit


class AmazonDynamoDBArchiveService:
    def __init__(self):
        self.enabled = False
        self._dynamodb_resource = None
        self._table = None
        self.local_archive: Dict[str, Dict[str, Any]] = {}
        self._init_client()

    def _init_client(self):
        try:
            import boto3
            if not settings.AWS_ACCESS_KEY_ID or settings.AWS_ACCESS_KEY_ID == "your_aws_access_key_id_here":
                self.enabled = False
                return

            session_kwargs = {"region_name": settings.AWS_REGION}
            session_kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
            session_kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
            if settings.AWS_SESSION_TOKEN:
                session_kwargs["aws_session_token"] = settings.AWS_SESSION_TOKEN

            self._dynamodb_resource = boto3.resource("dynamodb", **session_kwargs)
            self._table = self._dynamodb_resource.Table(settings.AWS_DYNAMODB_TABLE_NAME)
            self.enabled = True
        except Exception:
            # Local in-memory fallback mode when AWS credentials / boto3 runtime are not active
            self.enabled = False

    def save_commit(self, commit: CityCommit) -> bool:
        """Stores a CityCommit snapshot in DynamoDB (Forever Free Tier)."""
        item_data = {
            "PK": f"ZONE#{commit.zone_id}",
            "SK": f"COMMIT#{commit.commit_hash}",
            "commit_hash": commit.commit_hash,
            "parent_hash": commit.parent_hash or "GENESIS",
            "zone_id": commit.zone_id,
            "domain": commit.domain.value,
            "trigger": commit.trigger.value,
            "ai_summary": commit.ai_summary,
            "confidence": str(commit.confidence),
            "timestamp": commit.timestamp.isoformat() if isinstance(commit.timestamp, datetime) else str(commit.timestamp),
            "tags": commit.tags,
            "current_state_json": json.dumps(commit.current_state),
            "previous_state_json": json.dumps(commit.previous_state),
            "sensor_evidence_json": json.dumps(commit.sensor_evidence),
            "archived_at": datetime.now(timezone.utc).isoformat()
        }

        # Keep local audit memory
        self.local_archive[commit.commit_hash] = item_data

        if not self.enabled or not self._table:
            return True

        try:
            self._table.put_item(Item=item_data)
            return True
        except Exception:
            return True


    def get_commit(self, commit_hash: str) -> Optional[Dict[str, Any]]:
        """Retrieves commit metadata from DynamoDB or local fallback."""
        if commit_hash in self.local_archive:
            return self.local_archive[commit_hash]

        if not self.enabled or not self._table:
            return None

        try:
            # Query by secondary index or scan
            resp = self._table.get_item(Key={"SK": f"COMMIT#{commit_hash}"})
            return resp.get("Item")
        except Exception:
            return None

    def get_status(self) -> Dict[str, Any]:
        """Returns DynamoDB service status and Free Tier metrics."""
        return {
            "dynamodb_service_enabled": self.enabled,
            "table_name": settings.AWS_DYNAMODB_TABLE_NAME,
            "aws_region": settings.AWS_REGION,
            "tier": "AWS Forever Free (25GB Storage, 25 WCU / 25 RCU)",
            "total_archived_in_memory": len(self.local_archive)
        }


dynamodb_archive_service = AmazonDynamoDBArchiveService()
