"""CityMind - Telemetry Service & Hot Memory Buffer."""

from collections import deque
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from city_mind.models.telemetry import SensorReading, ZoneMetrics, ZoneStatus, DomainType


ZONES = {
    "zone-downtown": "Downtown Core (Zone A)",
    "zone-north": "North Industrial & Transit (Zone B)",
    "zone-west": "West Riverside & Basin (Zone C)",
    "zone-east": "East Commercial Hub (Zone D)",
    "zone-south": "South Residential District (Zone E)"
}


class TelemetryService:
    def __init__(self):
        # Hot Memory: Store recent sensor readings (max 200 per zone)
        self.hot_memory: Dict[str, deque] = {zone_id: deque(maxlen=200) for zone_id in ZONES.keys()}
        # Zone current state
        self.zone_states: Dict[str, ZoneMetrics] = {
            zone_id: ZoneMetrics(zone_id=zone_id, zone_name=name)
            for zone_id, name in ZONES.items()
        }
        self.incidents_log: List[Dict[str, Any]] = []

    def ingest_reading(self, reading: SensorReading) -> ZoneMetrics:
        zone_id = reading.zone_id
        if zone_id not in self.hot_memory:
            self.hot_memory[zone_id] = deque(maxlen=200)
            self.zone_states[zone_id] = ZoneMetrics(zone_id=zone_id, zone_name=zone_id.replace("-", " ").title())

        self.hot_memory[zone_id].append(reading)
        current = self.zone_states[zone_id]

        # Update current state based on metric
        metric = reading.metric_name
        val = reading.value

        if metric == "traffic_speed_kmh":
            current.traffic_speed_kmh = val
            current.traffic_congestion_pct = max(0.0, min(100.0, 100.0 - (val / 60.0 * 100.0)))
        elif metric == "water_level_m":
            current.water_level_m = val
            current.flood_risk_pct = max(0.0, min(100.0, (val / 3.0) * 100.0))
        elif metric == "aqi":
            current.aqi = val
        elif metric == "noise_db":
            current.noise_db = val
        elif metric == "power_grid_load_pct":
            current.power_grid_load_pct = val
        elif metric == "water_pressure_bar":
            current.water_pressure_bar = val
        elif metric == "waste_fill_pct":
            current.waste_fill_pct = val

        # Evaluate Zone Status
        if current.flood_risk_pct > 75 or current.aqi > 200 or current.traffic_speed_kmh < 10.0:
            current.status = ZoneStatus.CRITICAL
        elif current.flood_risk_pct > 50 or current.aqi > 150 or current.traffic_speed_kmh < 25.0:
            current.status = ZoneStatus.WARNING
        else:
            current.status = ZoneStatus.OPTIMAL

        current.last_updated = datetime.now(timezone.utc)
        return current

    def get_zone_metrics(self, zone_id: str) -> Optional[ZoneMetrics]:
        return self.zone_states.get(zone_id)

    def get_all_zones(self) -> List[ZoneMetrics]:
        return list(self.zone_states.values())

    def get_hot_memory_readings(self, zone_id: str, limit: int = 50) -> List[SensorReading]:
        if zone_id in self.hot_memory:
            return list(self.hot_memory[zone_id])[-limit:]
        return []

    def log_incident(self, incident: Dict[str, Any]):
        self.incidents_log.insert(0, incident)
        if len(self.incidents_log) > 100:
            self.incidents_log.pop()

    def get_incidents(self, limit: int = 20) -> List[Dict[str, Any]]:
        return self.incidents_log[:limit]


telemetry_service = TelemetryService()
