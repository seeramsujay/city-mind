"""Unit tests for Telemetry Service, Hot Memory, and Threshold Engine."""

from datetime import datetime, timezone
import pytest
from city_mind.models.telemetry import SensorReading, DomainType, ZoneStatus
from city_mind.services.telemetry_service import TelemetryService
from city_mind.memory.threshold_engine import ThresholdEngine
from city_mind.models.commit import TriggerType


def test_telemetry_service_ingest_and_zone_status():
    service = TelemetryService()
    
    # 1. Ingest normal traffic speed
    r1 = SensorReading(
        sensor_id="s-trf-1",
        zone_id="zone-downtown",
        domain=DomainType.TRAFFIC,
        metric_name="traffic_speed_kmh",
        value=48.0,
        unit="km/h"
    )
    m1 = service.ingest_reading(r1)
    assert m1.traffic_speed_kmh == 48.0
    assert m1.status == ZoneStatus.OPTIMAL

    # 2. Ingest warning level water reading
    r2 = SensorReading(
        sensor_id="s-env-1",
        zone_id="zone-downtown",
        domain=DomainType.ENVIRONMENT,
        metric_name="water_level_m",
        value=2.1,
        unit="m"
    )
    m2 = service.ingest_reading(r2)
    assert m2.water_level_m == 2.1
    assert m2.status == ZoneStatus.WARNING

    # 3. Ingest critical traffic speed
    r3 = SensorReading(
        sensor_id="s-trf-2",
        zone_id="zone-downtown",
        domain=DomainType.TRAFFIC,
        metric_name="traffic_speed_kmh",
        value=8.0,
        unit="km/h"
    )
    m3 = service.ingest_reading(r3)
    assert m3.status == ZoneStatus.CRITICAL


def test_hot_memory_buffer_capacity():
    service = TelemetryService()
    zone_id = "zone-test"

    for i in range(250):
        reading = SensorReading(
            sensor_id=f"sensor-{i}",
            zone_id=zone_id,
            domain=DomainType.ENVIRONMENT,
            metric_name="aqi",
            value=50.0 + i,
            unit="AQI"
        )
        service.ingest_reading(reading)

    readings = service.get_hot_memory_readings(zone_id, limit=300)
    assert len(readings) == 200  # maxlen is 200
    assert readings[-1].value == 299.0


def test_threshold_engine_evaluations():
    engine = ThresholdEngine()

    reading = SensorReading(
        sensor_id="s-1",
        zone_id="zone-west",
        domain=DomainType.ENVIRONMENT,
        metric_name="water_level_m",
        value=2.9,
        unit="m"
    )
    triggered, trigger_type, msg = engine.evaluate(reading, previous_value=1.5)
    assert triggered is True
    assert trigger_type == TriggerType.THRESHOLD_CROSSING
    assert "CRITICAL" in msg

    # Anomaly detection test
    anomaly_reading = SensorReading(
        sensor_id="s-2",
        zone_id="zone-west",
        domain=DomainType.ENVIRONMENT,
        metric_name="aqi",
        value=120.0,
        unit="AQI"
    )
    triggered_anom, trigger_type_anom, msg_anom = engine.evaluate(anomaly_reading, previous_value=50.0)
    assert triggered_anom is True
    assert trigger_type_anom == TriggerType.ANOMALY_DETECTED
    assert "ANOMALY" in msg_anom
