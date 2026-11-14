"""CityMind - Autonomous Emergency Agent."""

import uuid

from city_mind.memory.commit_engine import commit_engine
from city_mind.models.agent import ActionSeverity, AgentRecommendation
from city_mind.models.telemetry import DomainType, ZoneMetrics


class EmergencyAgent:
    def __init__(self):
        self.agent_name = "EmergencyAgent-v1"
        self.domain = DomainType.EMERGENCY

    def evaluate_zone(self, metrics: ZoneMetrics) -> AgentRecommendation | None:
        zone_id = metrics.zone_id
        if metrics.water_level_m >= 2.8 or metrics.traffic_speed_kmh <= 8.0:
            recent_commits = commit_engine.list_commits(zone_id=zone_id, limit=5)
            hashes = [c.commit_hash for c in recent_commits]
            return AgentRecommendation(
                recommendation_id=f"rec-emg-{uuid.uuid4().hex[:8]}",
                agent_name=self.agent_name,
                domain=self.domain,
                zone_id=zone_id,
                action="DISPATCH_EMERGENCY_CORRIDOR_CLEARANCE",
                reasoning=f"Critical operational degradation detected in {metrics.zone_name}. Initiating multi-agency emergency perimeter isolation and medical/fire corridor priority.",
                supporting_commit_hashes=hashes,
                confidence=0.99,
                severity=ActionSeverity.CRITICAL,
                parameters={
                    "agency": "Fire & Rescue",
                    "priority_lane": "Corridor-North-West",
                },
            )
        return None


emergency_agent = EmergencyAgent()
