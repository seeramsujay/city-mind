"""CityMind - Core FastAPI Application Entrypoint."""

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from city_mind.core.config import settings
from city_mind.api.telemetry_router import router as telemetry_router
from city_mind.api.commit_router import router as commit_router
from city_mind.api.ai_router import router as ai_router
from city_mind.api.agent_router import router as agent_router
from city_mind.api.prediction_router import router as prediction_router
from city_mind.api.digital_twin_router import router as digital_twin_router

from city_mind.services.mqtt_simulator import mqtt_simulator
from city_mind.services.websocket_manager import ws_manager
from city_mind.memory.threshold_engine import threshold_engine
from city_mind.memory.commit_engine import commit_engine
from city_mind.ai.vector_store import vector_memory_store


# Telemetry listener callback to auto-evaluate thresholds & mine City Commits
async def telemetry_event_handler(reading, zone_metrics):
    # 1. Broadcast telemetry reading via WebSockets
    await ws_manager.broadcast({
        "type": "telemetry",
        "data": reading.dict()
    })

    # 2. Check threshold crossings & anomalies
    triggered, trigger_type, message = threshold_engine.evaluate(reading, previous_value=None)
    if triggered and trigger_type:
        previous_state = {reading.metric_name: "normal"}
        current_state = {reading.metric_name: reading.value}
        
        # Mine new SHA-256 parent-linked City Commit
        commit = commit_engine.create_commit(
            zone_id=reading.zone_id,
            domain=reading.domain,
            trigger=trigger_type,
            previous_state=previous_state,
            current_state=current_state,
            sensor_evidence={"reading_id": reading.sensor_id, "value": reading.value, "unit": reading.unit},
            ai_summary=message,
            confidence=0.96,
            tags=[reading.domain.value, trigger_type.value]
        )

        # Index commit into Vector Memory Store for semantic RAG
        vector_memory_store.index_commit(commit)

        # Broadcast commit event to WebSocket subscribers
        await ws_manager.broadcast({
            "type": "city_commit",
            "data": commit.dict()
        })


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start MQTT IoT Telemetry Simulator
    mqtt_simulator.register_listener(telemetry_event_handler)
    await mqtt_simulator.start()
    yield
    # Shutdown: Stop MQTT Simulator
    await mqtt_simulator.stop()


app = FastAPI(
    title="CityMind API",
    description="A Git-inspired AI Memory Operating System for Smart Cities",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(telemetry_router)
app.include_router(commit_router)
app.include_router(ai_router)
app.include_router(agent_router)
app.include_router(prediction_router)
app.include_router(digital_twin_router)


@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "CityMind OS",
        "version": "0.1.0",
        "message": "Git-inspired Smart City Memory Engine Initialized",
        "features": [
            "Hot Telemetry Buffer & WebSockets Stream",
            "SHA-256 Linked City Commits & State Diffing",
            "Semantic RAG & Causal Knowledge Graph Memory",
            "Multi-Agent Mesh Autonomous Consensus",
            "Predictive Time-Series Intelligence",
            "Digital Twin What-If Scenario Simulator"
        ]
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "mqtt_simulator": mqtt_simulator.is_running}
