"""Unit tests for Predictive Intelligence and Digital Twin Simulator."""

import pytest
from city_mind.predictions.forecast_engine import ForecastEngine
from city_mind.models.prediction import ForecastHorizon
from city_mind.digital_twin.simulator import DigitalTwinSimulator
from city_mind.services.telemetry_service import telemetry_service
from city_mind.models.telemetry import SensorReading, DomainType


def test_forecast_engine_alerts_and_forecasting():
    engine = ForecastEngine()

    # Ingest a high water level reading into telemetry_service to trigger alert
    telemetry_service.ingest_reading(
        SensorReading(
            sensor_id="sensor-fld",
            zone_id="zone-west",
            domain=DomainType.ENVIRONMENT,
            metric_name="water_level_m",
            value=2.4,
            unit="m"
        )
    )

    alerts = engine.generate_alerts()
    assert isinstance(alerts, list)
    assert len(alerts) > 0

    forecast = engine.get_domain_forecast(domain="environment", zone_id="zone-west", horizon=ForecastHorizon.FOUR_HOURS)
    assert forecast.domain == "environment"
    assert len(forecast.forecast_points) == 12
    assert forecast.confidence > 0.8


def test_digital_twin_simulator_scenarios():
    sim = DigitalTwinSimulator()
    state = sim.get_digital_twin_state()
    assert state["city_name"] == "Metro City Twin"
    assert state["total_zones"] > 0

    # Simulate flash flood
    sim_flood = sim.simulate_scenario("flash_flood", "zone-west", intensity=1.5)
    assert sim_flood["scenario_type"] == "flash_flood"
    assert sim_flood["target_zone"] == "zone-west"
    assert len(sim_flood["simulated_impacts"]) > 0
    assert len(sim_flood["policy_recommendations"]) > 0
    assert sim_flood["resilience_score"] <= 1.0

    # Simulate bridge closure
    sim_bridge = sim.simulate_scenario("bridge_closure", "zone-downtown", intensity=1.0)
    assert sim_bridge["scenario_type"] == "bridge_closure"
    assert len(sim_bridge["policy_recommendations"]) > 0
