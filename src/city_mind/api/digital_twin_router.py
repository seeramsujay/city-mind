"""CityMind - Digital Twin & Simulator API Router."""

from typing import Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from city_mind.digital_twin.simulator import digital_twin_simulator


router = APIRouter(prefix="/api/v1/digital-twin", tags=["Digital Twin"])


class SimulationRequest(BaseModel):
    scenario_type: str  # flash_flood, bridge_closure, power_surge
    target_zone_id: str
    intensity: float = 1.0


@router.get("/state")
async def get_digital_twin_state():
    """Retrieve high-fidelity Digital Twin real-time city model state."""
    return digital_twin_simulator.get_digital_twin_state()


@router.post("/simulate")
async def run_simulation(request: SimulationRequest):
    """Run What-If scenario simulation on Digital Twin and evaluate multi-agent responses."""
    return digital_twin_simulator.simulate_scenario(
        scenario_type=request.scenario_type,
        target_zone_id=request.target_zone_id,
        intensity=request.intensity
    )
