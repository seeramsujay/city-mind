"""CityMind - Amazon S3 Event Memory Snapshot Archiver.

Archives SHA-256 City Commit payloads and telemetry streams into S3 object storage.
"""

import json
from typing import Dict, Any, Optional
from city_mind.core.config import settings
from city_mind.models.commit import CityCommit


class AmazonS3ArchiveService:
    def __init__(self):
        self.enabled = False
        self._s3_client = None
        self.archived_count = 0
        self._init_client()

    def _init_client(self):
        try:
            import boto3
            self._s3_client = boto3.client(
                service_name="s3",
                region_name=settings.AWS_REGION
            )
            self.enabled = True
        except Exception:
            self.enabled = False

    def archive_commit(self, commit: CityCommit) -> bool:
        """Uploads commit state diff payload snapshot to S3."""
        self.archived_count += 1
        if not self.enabled or not self._s3_client:
            return False

        try:
            s3_key = f"commits/{commit.zone_id}/{commit.domain.value}/{commit.commit_hash}.json"
            payload = json.dumps(commit.model_dump(mode="json"), indent=2)
            
            self._s3_client.put_object(
                Bucket=settings.AWS_S3_BUCKET_NAME,
                Key=s3_key,
                Body=payload,
                ContentType="application/json",
                Metadata={
                    "zone_id": commit.zone_id,
                    "domain": commit.domain.value,
                    "trigger": commit.trigger.value
                }
            )
            return True
        except Exception:
            return False

    def get_archive_status(self) -> Dict[str, Any]:
        """Returns S3 archival statistics."""
        return {
            "s3_archive_enabled": self.enabled,
            "bucket_name": settings.AWS_S3_BUCKET_NAME,
            "aws_region": settings.AWS_REGION,
            "total_archived_commits": self.archived_count
        }


s3_archive_service = AmazonS3ArchiveService()
