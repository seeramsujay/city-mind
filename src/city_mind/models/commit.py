"""CityMind - Git-Inspired City Commit Models."""

import hashlib
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from city_mind.models.telemetry import DomainType


class TriggerType(str, Enum):
    THRESHOLD_CROSSING = "threshold_crossing"
    ANOMALY_DETECTED = "anomaly_detected"
    CITIZEN_REPORT = "citizen_report"
    AGENT_OBSERVATION = "agent_observation"
    HEARTBEAT = "heartbeat"
    MANUAL_OVERRIDE = "manual_override"


class StateDiff(BaseModel):
    metric: str
    previous_value: Any
    current_value: Any
    delta: Optional[float] = None
    unit: Optional[str] = None


class CityCommit(BaseModel):
    commit_hash: str
    parent_hash: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    zone_id: str
    domain: DomainType
    trigger: TriggerType
    previous_state: Dict[str, Any]
    current_state: Dict[str, Any]
    diffs: List[StateDiff]
    sensor_evidence: Dict[str, Any]
    ai_summary: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.95)
    tags: List[str] = Field(default_factory=list)

    @staticmethod
    def generate_hash(parent_hash: Optional[str], timestamp_str: str, zone_id: str, domain: str, diffs_summary: str) -> str:
        raw_str = f"{parent_hash or 'GENESIS'}:{timestamp_str}:{zone_id}:{domain}:{diffs_summary}"
        return hashlib.sha256(raw_str.encode("utf-8")).hexdigest()[:16]


class CommitTimeline(BaseModel):
    zone_id: str
    total_commits: int
    latest_commit_hash: Optional[str]
    commits: List[CityCommit]


class CommitDiffResponse(BaseModel):
    commit_a: str
    commit_b: str
    zone_id: str
    domain_a: str
    domain_b: str
    timestamp_a: datetime
    timestamp_b: datetime
    state_diffs: List[StateDiff]
    ai_comparative_summary: str
