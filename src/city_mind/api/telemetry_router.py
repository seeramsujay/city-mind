"""CityMind - Telemetry & WebSocket API Router."""

from typing import List, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from city_mind.models.telemetry import ZoneMetrics, SensorReading
from city_mind.services.telemetry_service import telemetry_service
from city_mind.services.websocket_manager import ws_manager


router = APIRouter(prefix="/api/v1/telemetry", tags=["Telemetry & Hot Memory"])


@router.get("/zones", response_model=List[ZoneMetrics])
async def get_all_zones():
    """Get real-time metrics for all smart city zones."""
    return telemetry_service.get_all_zones()


@router.get("/zones/{zone_id}", response_model=ZoneMetrics)
async def get_zone(zone_id: str):
    """Get metrics for a specific zone."""
    metrics = telemetry_service.get_zone_metrics(zone_id)
    if not metrics:
        return telemetry_service.get_all_zones()[0]
    return metrics


@router.get("/hot-memory/{zone_id}", response_model=List[SensorReading])
async def get_hot_memory(zone_id: str, limit: int = Query(default=50, le=200)):
    """Retrieve recent sliding-window sensor readings from Hot Memory buffer."""
    return telemetry_service.get_hot_memory_readings(zone_id, limit=limit)


@router.get("/incidents")
async def get_incidents(limit: int = Query(default=20, le=100)):
    """Get active and historical city incident log."""
    return telemetry_service.get_incidents(limit=limit)


@router.websocket("/ws")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """Real-time WebSocket stream for telemetry, commits, and alerts."""
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection open & receive any client messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
