"""CityMind - IoT Telemetry & MQTT Simulator."""

import asyncio
import random
import uuid
from datetime import datetime
from typing import Callable, Optional
from city_mind.models.telemetry import SensorReading, DomainType
from city_mind.services.telemetry_service import telemetry_service, ZONES


class MQTTSimulator:
    def __init__(self):
        self.is_running = False
        self._task: Optional[asyncio.Task] = None
        self.listeners: list[Callable] = []

    def register_listener(self, callback: Callable):
        self.listeners.append(callback)

    async def start(self):
        if self.is_running:
            return
        self.is_running = True
        self._task = asyncio.create_task(self._simulation_loop())

    async def stop(self):
        self.is_running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

    async def _simulation_loop(self):
        zone_ids = list(ZONES.keys())
        
        # Initial base values with minor fluctuations
        zone_baselines = {
            z: {
                "traffic_speed_kmh": random.uniform(35.0, 55.0),
                "water_level_m": random.uniform(0.8, 1.4),
                "aqi": random.uniform(35.0, 85.0),
                "noise_db": random.uniform(45.0, 65.0),
                "power_grid_load_pct": random.uniform(50.0, 70.0),
                "water_pressure_bar": random.uniform(3.8, 4.5),
                "waste_fill_pct": random.uniform(20.0, 50.0),
            }
            for z in zone_ids
        }

        while self.is_running:
            for zone_id in zone_ids:
                base = zone_baselines[zone_id]
                
                # Introduce occasional realistic spikes / anomalies (5% chance)
                spike = random.random() < 0.05
                
                if spike and zone_id == "zone-west":
                    # Simulate heavy rain/rising river in Zone West
                    base["water_level_m"] = min(3.5, base["water_level_m"] + 0.4)
                elif spike and zone_id == "zone-downtown":
                    # Simulate traffic bottleneck downtown
                    base["traffic_speed_kmh"] = max(5.0, base["traffic_speed_kmh"] - 8.0)
                else:
                    # Normal drift towards baseline
                    base["traffic_speed_kmh"] = max(10.0, min(65.0, base["traffic_speed_kmh"] + random.uniform(-2.0, 2.0)))
                    base["water_level_m"] = max(0.5, min(3.2, base["water_level_m"] + random.uniform(-0.05, 0.05)))
                    base["aqi"] = max(20.0, min(300.0, base["aqi"] + random.uniform(-3.0, 3.0)))
                    base["noise_db"] = max(40.0, min(90.0, base["noise_db"] + random.uniform(-2.0, 2.0)))
                    base["power_grid_load_pct"] = max(30.0, min(95.0, base["power_grid_load_pct"] + random.uniform(-1.5, 1.5)))

                # Create SensorReadings for domain metrics
                readings = [
                    SensorReading(
                        sensor_id=f"sensor-trf-{zone_id}",
                        zone_id=zone_id,
                        domain=DomainType.TRAFFIC,
                        metric_name="traffic_speed_kmh",
                        value=round(base["traffic_speed_kmh"], 2),
                        unit="km/h"
                    ),
                    SensorReading(
                        sensor_id=f"sensor-env-{zone_id}",
                        zone_id=zone_id,
                        domain=DomainType.ENVIRONMENT,
                        metric_name="water_level_m",
                        value=round(base["water_level_m"], 2),
                        unit="m"
                    ),
                    SensorReading(
                        sensor_id=f"sensor-aqi-{zone_id}",
                        zone_id=zone_id,
                        domain=DomainType.ENVIRONMENT,
                        metric_name="aqi",
                        value=round(base["aqi"], 1),
                        unit="AQI"
                    ),
                    SensorReading(
                        sensor_id=f"sensor-pwr-{zone_id}",
                        zone_id=zone_id,
                        domain=DomainType.INFRASTRUCTURE,
                        metric_name="power_grid_load_pct",
                        value=round(base["power_grid_load_pct"], 1),
                        unit="%"
                    )
                ]

                for reading in readings:
                    updated_zone = telemetry_service.ingest_reading(reading)
                    for listener in self.listeners:
                        try:
                            if asyncio.iscoroutinefunction(listener):
                                await listener(reading, updated_zone)
                            else:
                                listener(reading, updated_zone)
                        except Exception:
                            pass

            await asyncio.sleep(2)  # Emit every 2 seconds


mqtt_simulator = MQTTSimulator()
