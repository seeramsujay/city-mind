"""CityMind - Autonomous Multi-Agent Mesh & Consensus Engine."""

import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from city_mind.models.agent import (
    AgentRecommendation,
    MultiAgentDecision,
    ActionSeverity,
    AgentStatus
)
from city_mind.models.telemetry import ZoneMetrics, DomainType
from city_mind.agents.traffic_agent import traffic_agent
from city_mind.agents.environment_agent import environment_agent
from city_mind.agents.infrastructure_agent import infrastructure_agent
from city_mind.agents.emergency_agent import emergency_agent
from city_mind.agents.citizen_agent import citizen_agent
from city_mind.services.telemetry_service import telemetry_service
from city_mind.memory.commit_engine import commit_engine


class AgentMesh:
    def __init__(self):
        self.agents = [
            traffic_agent,
            environment_agent,
            infrastructure_agent,
            emergency_agent,
            citizen_agent
        ]

    def evaluate_all_zones(self) -> List[MultiAgentDecision]:
        zones = telemetry_service.get_all_zones()
        decisions = []

        for zone in zones:
            recs: List[AgentRecommendation] = []
            for agent in self.agents:
                rec = agent.evaluate_zone(zone)
                if rec:
                    recs.append(rec)

            if recs:
                decision = self._synthesize_consensus(zone, recs)
                decisions.append(decision)

        return decisions

    def _synthesize_consensus(self, zone: ZoneMetrics, recs: List[AgentRecommendation]) -> MultiAgentDecision:
        agents_involved = [r.agent_name for r in recs]
        all_commits = set()
        for r in recs:
            all_commits.update(r.supporting_commit_hashes)

        # Primary domain with highest severity recommendation
        severities = {ActionSeverity.CRITICAL: 4, ActionSeverity.HIGH: 3, ActionSeverity.MEDIUM: 2, ActionSeverity.LOW: 1}
        recs.sort(key=lambda r: severities.get(r.severity, 0), reverse=True)
        primary_rec = recs[0]

        coordinated_steps = [
            f"Step 1 [{r.domain.value.upper()}]: {r.action} — {r.reasoning}"
            for r in recs
        ]

        decision = MultiAgentDecision(
            decision_id=f"dec-{uuid.uuid4().hex[:8]}",
            timestamp=datetime.now(timezone.utc),
            participating_agents=agents_involved,
            primary_domain=primary_rec.domain,
            zone_id=zone.zone_id,
            consensus_action=f"JOINT_RESPONSE: {primary_rec.action}",
            coordinated_steps=coordinated_steps,
            evidence_commits=list(all_commits),
            risk_level=primary_rec.severity,
            confidence_score=round(sum(r.confidence for r in recs) / len(recs), 3)
        )
        return decision

    def get_mesh_status(self) -> Dict[str, Any]:
        return {
            "total_agents": len(self.agents),
            "agents": [
                {
                    "name": a.agent_name,
                    "domain": a.domain.value,
                    "status": AgentStatus.MONITORING.value
                }
                for a in self.agents
            ],
            "collaboration_protocol": "Shared City Commit Memory Mesh",
            "consensus_engine": "Multi-Criteria Severity & Causal Weighting"
        }


agent_mesh = AgentMesh()
