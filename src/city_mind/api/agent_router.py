"""CityMind - Autonomous Multi-Agent API Router."""

from typing import List, Dict, Any
from fastapi import APIRouter
from city_mind.agents.agent_mesh import agent_mesh
from city_mind.models.agent import MultiAgentDecision


router = APIRouter(prefix="/api/v1/agents", tags=["Autonomous Agents"])


@router.get("/status")
async def get_mesh_status():
    """Get real-time operational status of all autonomous domain agents."""
    return agent_mesh.get_mesh_status()


@router.get("/evaluate", response_model=List[MultiAgentDecision])
async def evaluate_agents():
    """Trigger multi-agent evaluation cycle across all smart city zones."""
    return agent_mesh.evaluate_all_zones()


@router.get("/decisions", response_model=List[MultiAgentDecision])
async def get_recent_decisions():
    """Get active multi-agent consensus decisions and coordinated steps."""
    return agent_mesh.evaluate_all_zones()
