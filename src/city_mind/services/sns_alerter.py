"""CityMind - Amazon SNS Emergency Alert & Dispatch Service.

Leverages AWS Forever Free Tier (1,000,000 Push Notifications / 100,000 HTTP/SMS notifications per month Free Forever).
Dispatches critical city anomaly alerts, flood warnings, and cross-sector mitigation directives.
"""

import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from city_mind.core.config import settings


class AmazonSNSAlertService:
    def __init__(self):
        self.enabled = False
        self._sns_client = None
        self.dispatched_alerts: List[Dict[str, Any]] = []
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

            self._sns_client = boto3.client("sns", **session_kwargs)
            self.enabled = bool(settings.AWS_SNS_CRITICAL_ALERTS_TOPIC_ARN)
        except Exception:
            self.enabled = False


    def publish_critical_alert(
        self,
        zone_id: str,
        domain: str,
        severity: str,
        summary: str,
        metrics: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Publishes an urgent city event to Amazon SNS Topic."""
        alert_payload = {
            "source": "CityMind Urban Intelligence Engine",
            "zone_id": zone_id,
            "domain": domain,
            "severity": severity.upper(),
            "summary": summary,
            "metrics": metrics or {},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        self.dispatched_alerts.append(alert_payload)

        if not self.enabled or not self._sns_client or not settings.AWS_SNS_CRITICAL_ALERTS_TOPIC_ARN:
            return {
                "status": "dispatched_locally",
                "mode": "in_memory_simulation",
                "alert": alert_payload
            }

        try:
            resp = self._sns_client.publish(
                TopicArn=settings.AWS_SNS_CRITICAL_ALERTS_TOPIC_ARN,
                Subject=f"[CityMind Alert - {severity.upper()}] {zone_id} ({domain})",
                Message=json.dumps(alert_payload, indent=2),
                MessageAttributes={
                    "Severity": {"DataType": "String", "StringValue": severity.upper()},
                    "Zone": {"DataType": "String", "StringValue": zone_id},
                    "Domain": {"DataType": "String", "StringValue": domain}
                }
            )
            return {
                "status": "published_aws_sns",
                "message_id": resp.get("MessageId"),
                "alert": alert_payload
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "alert": alert_payload
            }

    def get_status(self) -> Dict[str, Any]:
        """Returns SNS service status and Free Tier metrics."""
        return {
            "sns_service_enabled": self.enabled,
            "topic_arn": settings.AWS_SNS_CRITICAL_ALERTS_TOPIC_ARN,
            "aws_region": settings.AWS_REGION,
            "tier": "AWS Forever Free (1,000,000 Push Notifications / Month)",
            "total_alerts_dispatched": len(self.dispatched_alerts)
        }


sns_alert_service = AmazonSNSAlertService()
