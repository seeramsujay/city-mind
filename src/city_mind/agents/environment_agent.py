"""CityMind - Autonomous Environment Agent."""

import uuid
from typing import List, Optional
from city_mind.models.agent import AgentRecommendation, ActionSeverity
from city_mind.models.telemetry import DomainType, ZoneMetrics
from city_mind.memory.commit_engine import commit_engine


class EnvironmentAgent:
    def __init__(self):
        self.agent_name = "EnvironmentAgent-v1"
        self.domain = DomainType.ENVIRONMENT

    def evaluate_zone(self, metrics: ZoneMetrics) -> Optional[AgentRecommendation]:
        water_level = metrics.water_level_m
        aqi = metrics.aqi
        zone_id = metrics.zone_id

        if water_level >= 2.0 or aqi >= 180.0:
            recent_commits = commit_engine.list_commits(zone_id=zone_id, domain=self.domain, limit=3)
            hashes = [c.commit_hash for c in recent_commits]

            if water_level >= 2.0:
                return AgentRecommendation(
                    recommendation_id=f"rec-env-{uuid.uuid4().hex[:8]}",
                    agent_name=self.agent_name,
                    domain=self.domain,
                    zone_id=zone_id,
                    action="DEPLOY_AUTOMATED_DRAINAGE_PUMPS",
                    reasoning=f"Water level reached {water_level}m (Flood Risk: {metrics.flood_risk_pct}%). Immediate deployment of auxiliary storm drainage pumps advised.",
                    supporting_commit_hashes=hashes,
                    confidence=0.98,
                    severity=ActionSeverity.CRITICAL if water_level >= 2.8 else ActionSeverity.HIGH,
                    parameters={"pump_capacity_gpm": 5000, "target_basin": "WestRiverDrain"}
                )
            else:
                return AgentRecommendation(
                    recommendation_id=f"rec-env-{uuid.uuid4().hex[:8]}",
                    agent_name=self.agent_name,
                    domain=self.domain,
                    zone_id=zone_id,
                    action="ISSUE_AIR_QUALITY_ADVISORY",
                    reasoning=f"Air Quality Index reached {aqi} AQI. Recommending public health alert and heavy vehicle restriction.",
                    supporting_commit_hashes=hashes,
                    confidence=0.92,
                    severity=ActionSeverity.MEDIUM,
                    parameters={"restricted_vehicle_class": "Class-8 Diesel", "alert_level": "Orange"}
                )
        return None


environment_agent = EnvironmentAgent()
