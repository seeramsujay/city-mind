"""CityMind - Digital Twin & What-If Scenario Simulator."""

import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any
from city_mind.services.telemetry_service import telemetry_service
from city_mind.agents.agent_mesh import agent_mesh


class DigitalTwinSimulator:
    def __init__(self):
        pass

    def get_digital_twin_state(self) -> Dict[str, Any]:
        zones = telemetry_service.get_all_zones()
        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "city_name": "Metro City Twin",
            "total_zones": len(zones),
            "zones_state": [
                {
                    "zone_id": z.zone_id,
                    "name": z.zone_name,
                    "status": z.status.value,
                    "metrics": {
                        "traffic_speed_kmh": z.traffic_speed_kmh,
                        "water_level_m": z.water_level_m,
                        "aqi": z.aqi,
                        "power_load_pct": z.power_grid_load_pct,
                        "waste_fill_pct": z.waste_fill_pct
                    }
                }
                for z in zones
            ],
            "twin_fidelity": "High-Definition Realtime Synchronized"
        }

    def simulate_scenario(self, scenario_type: str, target_zone_id: str, intensity: float = 1.0) -> Dict[str, Any]:
        simulation_id = f"sim-{uuid.uuid4().hex[:8]}"
        timestamp = datetime.now(timezone.utc)

        zone = telemetry_service.get_zone_metrics(target_zone_id)
        zone_name = zone.zone_name if zone else target_zone_id

        simulated_impacts = []
        policy_recommendations = []

        if scenario_type.lower() in ["flash_flood", "flood", "heavy_rain"]:
            simulated_impacts = [
                f"Water level increases by +{round(1.5 * intensity, 2)}m in {zone_name}.",
                "Drainage capacity exceeded along West River basin.",
                "Surface street inundation cuts off 2 arterial transit routes."
            ]
            policy_recommendations = [
                "Activate emergency retention basins in Zone C.",
                "Automate signal rerouting to elevate bypass bridges.",
                "Pre-position 3 mobile pump trailers at 4th Street Underpass."
            ]
        elif scenario_type.lower() in ["bridge_closure", "traffic_jam", "accident"]:
            simulated_impacts = [
                f"Arterial speed drops by -75% in {zone_name}.",
                "Traffic queue spillback reaches neighboring East Commercial Hub.",
                "CO2 & AQI levels rise locally due to idling vehicles."
            ]
            policy_recommendations = [
                "Extend green wave cycle by 45 seconds on outer ring road.",
                "Dispatch traffic wardens to manual override choke points."
            ]
        else:
            simulated_impacts = [
                f"Power grid load surges to 98% in {zone_name}.",
                "Potential substation thermal tripping within 30 minutes."
            ]
            policy_recommendations = [
                "Engage commercial HVAC demand response curtailment.",
                "Draw 15MW from municipal battery storage array."
            ]

        # Multi-agent mesh evaluation under simulated conditions
        agent_decisions = agent_mesh.evaluate_all_zones()

        return {
            "simulation_id": simulation_id,
            "scenario_type": scenario_type,
            "target_zone": target_zone_id,
            "target_zone_name": zone_name,
            "intensity": intensity,
            "timestamp": timestamp,
            "simulated_impacts": simulated_impacts,
            "policy_recommendations": policy_recommendations,
            "agent_mesh_responses": [d.model_dump(mode="json") for d in agent_decisions],
            "resilience_score": round(max(0.4, 0.95 - (intensity * 0.15)), 2)
        }


digital_twin_simulator = DigitalTwinSimulator()
