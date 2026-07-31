"""CityMind - Autonomous Traffic Agent."""

import uuid
from typing import List, Optional
from city_mind.models.agent import AgentRecommendation, ActionSeverity
from city_mind.models.telemetry import DomainType, ZoneMetrics
from city_mind.memory.commit_engine import commit_engine


class TrafficAgent:
    def __init__(self):
        self.agent_name = "TrafficAgent-v1"
        self.domain = DomainType.TRAFFIC

    def evaluate_zone(self, metrics: ZoneMetrics) -> Optional[AgentRecommendation]:
        speed = metrics.traffic_speed_kmh
        zone_id = metrics.zone_id

        if speed < 15.0:
            recent_commits = commit_engine.list_commits(zone_id=zone_id, domain=self.domain, limit=3)
            hashes = [c.commit_hash for c in recent_commits]
            
            return AgentRecommendation(
                recommendation_id=f"rec-trf-{uuid.uuid4().hex[:8]}",
                agent_name=self.agent_name,
                domain=self.domain,
                zone_id=zone_id,
                action="ACTIVATE_GREEN_WAVE_ROUTING",
                reasoning=f"Traffic speed dropped to {speed} km/h in {metrics.zone_name}. Recommending signal duration adjustment and green-wave emergency corridor clearance.",
                supporting_commit_hashes=hashes,
                confidence=0.96,
                severity=ActionSeverity.HIGH if speed < 10.0 else ActionSeverity.MEDIUM,
                parameters={"signal_cycle_extension_sec": 30, "reroute_arterials": ["MainSt", "5thAve"]}
            )
        return None


traffic_agent = TrafficAgent()
