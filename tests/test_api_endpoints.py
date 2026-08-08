"""Integration tests for CityMind FastAPI Endpoints and WebSockets using TestClient."""

import pytest
from fastapi.testclient import TestClient
from city_mind.main import app

client = TestClient(app)


def test_root_and_health_endpoints():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["system"] == "CityMind OS"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"


def test_telemetry_endpoints():
    # 1. Get all zones
    r_zones = client.get("/api/v1/telemetry/zones")
    assert r_zones.status_code == 200
    zones = r_zones.json()
    assert len(zones) >= 5

    # 2. Get specific zone
    zone_id = zones[0]["zone_id"]
    r_zone = client.get(f"/api/v1/telemetry/zones/{zone_id}")
    assert r_zone.status_code == 200
    assert r_zone.json()["zone_id"] == zone_id

    # 3. Get non-existent zone (should 404)
    r_404 = client.get("/api/v1/telemetry/zones/non-existent-zone-xyz")
    assert r_404.status_code == 404

    # 4. Get hot memory readings
    r_hot = client.get(f"/api/v1/telemetry/hot-memory/{zone_id}")
    assert r_hot.status_code == 200

    # 5. Get incidents
    r_incidents = client.get("/api/v1/telemetry/incidents")
    assert r_incidents.status_code == 200


def test_commit_endpoints():
    # 1. List commits
    r_commits = client.get("/api/v1/commits")
    assert r_commits.status_code == 200
    commits = r_commits.json()
    assert len(commits) > 0

    c_hash = commits[0]["commit_hash"]

    # 2. Get commit by hash
    r_commit = client.get(f"/api/v1/commits/hash/{c_hash}")
    assert r_commit.status_code == 200
    assert r_commit.json()["commit_hash"] == c_hash

    # 3. Get non-existent commit (should 404)
    r_bad_hash = client.get("/api/v1/commits/hash/invalidhash12345")
    assert r_bad_hash.status_code == 404

    # 4. Zone timeline
    r_timeline = client.get("/api/v1/commits/timeline/zone-downtown")
    assert r_timeline.status_code == 200

    # 5. Diff commits (if at least 2 commits exist)
    if len(commits) >= 2:
        h1 = commits[0]["commit_hash"]
        h2 = commits[1]["commit_hash"]
        r_diff = client.get(f"/api/v1/commits/diff/{h1}/{h2}")
        assert r_diff.status_code in [200, 404]


def test_ai_router_endpoints():
    # 1. Chat endpoint
    r_chat = client.post("/api/v1/ai/chat", json={"prompt": "Is there flood risk in West Basin?", "zone_id": "zone-west"})
    assert r_chat.status_code == 200
    chat_data = r_chat.json()
    assert "response" in chat_data

    # 2. Vector search
    r_search = client.get("/api/v1/ai/memory/search?q=flood")
    assert r_search.status_code == 200

    # 3. Knowledge graph
    r_graph = client.get("/api/v1/ai/memory/graph")
    assert r_graph.status_code == 200
    assert "nodes" in r_graph.json()


def test_agents_router_endpoints():
    r_status = client.get("/api/v1/agents/status")
    assert r_status.status_code == 200
    assert r_status.json()["total_agents"] == 5

    r_eval = client.get("/api/v1/agents/evaluate")
    assert r_eval.status_code == 200

    r_dec = client.get("/api/v1/agents/decisions")
    assert r_dec.status_code == 200


def test_prediction_router_endpoints():
    r_alerts = client.get("/api/v1/predictions/alerts")
    assert r_alerts.status_code == 200

    r_forecast = client.get("/api/v1/predictions/forecast?domain=environment&zone_id=zone-west&horizon=4h")
    assert r_forecast.status_code == 200
    assert r_forecast.json()["domain"] == "environment"


def test_digital_twin_router_endpoints():
    r_state = client.get("/api/v1/digital-twin/state")
    assert r_state.status_code == 200

    r_sim = client.post("/api/v1/digital-twin/simulate", json={
        "scenario_type": "flash_flood",
        "target_zone_id": "zone-west",
        "intensity": 1.2
    })
    assert r_sim.status_code == 200
    assert r_sim.json()["scenario_type"] == "flash_flood"


def test_websocket_telemetry():
    with client.websocket_connect("/api/v1/telemetry/ws") as websocket:
        websocket.send_text("ping")
        # Ensure connection accepted cleanly
