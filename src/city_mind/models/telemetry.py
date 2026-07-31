"""CityMind - Telemetry Data Models."""

from datetime import datetime
from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class DomainType(str, Enum):
    TRAFFIC = "traffic"
    ENVIRONMENT = "environment"
    INFRASTRUCTURE = "infrastructure"
    EMERGENCY = "emergency"
    CITIZEN = "citizen"


class ZoneStatus(str, Enum):
    OPTIMAL = "optimal"
    WARNING = "warning"
    CRITICAL = "critical"
    ALERT = "alert"


class SensorReading(BaseModel):
    sensor_id: str
    zone_id: str
    domain: DomainType
    metric_name: str
    value: float
    unit: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None


class ZoneMetrics(BaseModel):
    zone_id: str
    zone_name: str
    status: ZoneStatus = ZoneStatus.OPTIMAL
    traffic_speed_kmh: float = 45.0
    traffic_congestion_pct: float = 25.0
    water_level_m: float = 1.2
    flood_risk_pct: float = 10.0
    aqi: float = 45.0
    noise_db: float = 55.0
    power_grid_load_pct: float = 62.0
    water_pressure_bar: float = 4.2
    waste_fill_pct: float = 30.0
    active_incidents: int = 0
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class TelemetryStreamBatch(BaseModel):
    batch_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    readings_count: int
    readings: List[SensorReading]
