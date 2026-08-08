"""Unit tests for Multi-Agent Mesh and domain agents."""

import pytest
from city_mind.models.telemetry import ZoneMetrics, ZoneStatus
from city_mind.agents.traffic_agent import TrafficAgent
from city_mind.agents.environment_agent import EnvironmentAgent
from city_mind.agents.infrastructure_agent import InfrastructureAgent
from city_mind.agents.emergency_agent import EmergencyAgent
from city_mind.agents.citizen_agent import CitizenAgent
from city_mind.agents.agent_mesh import AgentMesh
from city_mind.models.agent import ActionSeverity


def test_individual_agent_evaluations():
    # Traffic agent
    traffic = TrafficAgent()
    m_traffic = ZoneMetrics(zone_id="zone-downtown", zone_name="Downtown Core", traffic_speed_kmh=12.0)
    rec_trf = traffic.evaluate_zone(m_traffic)
    assert rec_trf is not None
    assert rec_trf.action == "ACTIVATE_GREEN_WAVE_ROUTING"

    # Environment agent
    env = EnvironmentAgent()
    m_env = ZoneMetrics(zone_id="zone-west", zone_name="West Basin", water_level_m=2.5)
    rec_env = env.evaluate_zone(m_env)
    assert rec_env is not None
    assert rec_env.action == "DEPLOY_AUTOMATED_DRAINAGE_PUMPS"

    # Infrastructure agent
    inf = InfrastructureAgent()
    m_inf = ZoneMetrics(zone_id="zone-north", zone_name="North Hub", power_grid_load_pct=90.0)
    rec_inf = inf.evaluate_zone(m_inf)
    assert rec_inf is not None
    assert rec_inf.action == "BALANCE_SUBSTATION_GRID_LOAD"

    # Emergency agent
    emg = EmergencyAgent()
    m_emg = ZoneMetrics(zone_id="zone-west", zone_name="West Basin", water_level_m=2.9)
    rec_emg = emg.evaluate_zone(m_emg)
    assert rec_emg is not None
    assert rec_emg.severity == ActionSeverity.CRITICAL

    # Citizen agent
    ctz = CitizenAgent()
    m_ctz = ZoneMetrics(zone_id="zone-south", zone_name="South District", active_incidents=5, status=ZoneStatus.WARNING)
    rec_ctz = ctz.evaluate_zone(m_ctz)
    assert rec_ctz is not None


def test_agent_mesh_consensus():
    mesh = AgentMesh()
    status = mesh.get_mesh_status()
    assert status["total_agents"] == 5

    decisions = mesh.evaluate_all_zones()
    assert isinstance(decisions, list)
