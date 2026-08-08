"""CityMind - Autonomous Multi-Agent Models."""

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from city_mind.models.telemetry import DomainType


class AgentStatus(str, Enum):
    IDLE = "idle"
    MONITORING = "monitoring"
    EVALUATING = "evaluating"
    DISPATCHING = "dispatching"
    ALERTING = "alerting"


class ActionSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AgentRecommendation(BaseModel):
    recommendation_id: str
    agent_name: str
    domain: DomainType
    zone_id: str
    action: str
    reasoning: str
    supporting_commit_hashes: List[str]
    confidence: float
    severity: ActionSeverity
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    parameters: Dict[str, Any] = Field(default_factory=dict)


class MultiAgentDecision(BaseModel):
    decision_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    participating_agents: List[str]
    primary_domain: DomainType
    zone_id: str
    consensus_action: str
    coordinated_steps: List[str]
    evidence_commits: List[str]
    risk_level: ActionSeverity
    confidence_score: float

