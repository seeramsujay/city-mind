"""Comprehensive Test Suite for CityMind Backend Engine across all 6 Roadmap Phases."""

import asyncio
from datetime import datetime
from city_mind.models.telemetry import SensorReading, DomainType
from city_mind.models.commit import TriggerType
from city_mind.services.telemetry_service import telemetry_service
from city_mind.memory.threshold_engine import threshold_engine
from city_mind.memory.commit_engine import commit_engine
from city_mind.ai.vector_store import vector_memory_store
from city_mind.ai.knowledge_graph import knowledge_graph
from city_mind.ai.rag_engine import rag_engine
from city_mind.agents.agent_mesh import agent_mesh
from city_mind.predictions.forecast_engine import forecast_engine
from city_mind.digital_twin.simulator import digital_twin_simulator


def test_phase1_telemetry_and_hot_memory():
    reading = SensorReading(
        sensor_id="test-sensor-1",
        zone_id="zone-west",
        domain=DomainType.ENVIRONMENT,
        metric_name="water_level_m",
        value=2.6,
        unit="m"
    )
    zone_metrics = telemetry_service.ingest_reading(reading)
    assert zone_metrics.zone_id == "zone-west"
    assert zone_metrics.water_level_m == 2.6
    assert zone_metrics.status.value in ["warning", "critical"]
    print("[PASS] Phase 1 - Telemetry Ingestion & Hot Memory Buffer")


def test_phase2_commit_engine_and_diffs():
    previous_state = {"water_level_m": 1.2, "status": "optimal"}
    current_state = {"water_level_m": 2.8, "status": "critical"}
    
    commit = commit_engine.create_commit(
        zone_id="zone-west",
        domain=DomainType.ENVIRONMENT,
        trigger=TriggerType.THRESHOLD_CROSSING,
        previous_state=previous_state,
        current_state=current_state,
        sensor_evidence={"sensor_id": "test-sensor-1", "value": 2.8},
        ai_summary="CRITICAL: Water level reached 2.8m in West Basin",
        confidence=0.98,
        tags=["environment", "flood_alert"]
    )
    assert commit.commit_hash is not None
    assert len(commit.commit_hash) == 16
    assert commit.parent_hash is not None
    
    # Test diff
    diff_res = commit_engine.diff_commits(commit.parent_hash, commit.commit_hash)
    assert diff_res is not None
    print("[PASS] Phase 2 - Event Memory Engine (SHA-256 Commits & Diffing)")


def test_phase3_ai_memory_and_rag():
    recent_commits = commit_engine.list_commits(zone_id="zone-west")
    for c in recent_commits:
        vector_memory_store.index_commit(c)

    rag_result = rag_engine.query("Is there flood risk in West Basin?")
    assert "response" in rag_result
    assert len(rag_result["evidence_commits"]) > 0
    assert rag_result["confidence_score"] > 0.8
    print("[PASS] Phase 3 - AI Memory (Vector RAG & Causal Knowledge Graph)")


def test_phase4_autonomous_agent_mesh():
    decisions = agent_mesh.evaluate_all_zones()
    assert isinstance(decisions, list)
    status = agent_mesh.get_mesh_status()
    assert status["total_agents"] == 5
    print("[PASS] Phase 4 - Autonomous Multi-Agent Mesh Collaboration")


def test_phase5_predictive_intelligence():
    alerts = forecast_engine.generate_alerts()
    forecast = forecast_engine.get_domain_forecast("environment", "zone-west")
    assert isinstance(alerts, list)
    assert len(forecast.forecast_points) > 0
    print("[PASS] Phase 5 - Predictive Analytics & Forecasting Models")


def test_phase6_digital_twin_simulation():
    twin_state = digital_twin_simulator.get_digital_twin_state()
    assert twin_state["total_zones"] > 0
    
    sim_res = digital_twin_simulator.simulate_scenario("flash_flood", "zone-west", intensity=1.5)
    assert sim_res["resilience_score"] <= 1.0
    assert len(sim_res["policy_recommendations"]) > 0
    print("[PASS] Phase 6 - Digital Twin & What-If Scenario Simulator")


if __name__ == "__main__":
    print("Running CityMind Backend Engine Test Suite...")
    test_phase1_telemetry_and_hot_memory()
    test_phase2_commit_engine_and_diffs()
    test_phase3_ai_memory_and_rag()
    test_phase4_autonomous_agent_mesh()
    test_phase5_predictive_intelligence()
    test_phase6_digital_twin_simulation()
    print("\nALL CITYMIND BACKEND ROADMAP PHASES SUCCESSFULLY TESTED & VERIFIED!")
