"""Unit tests for Git-inspired City Commit Engine and Delta Logger."""

import pytest
from city_mind.models.commit import TriggerType
from city_mind.models.telemetry import DomainType
from city_mind.memory.commit_engine import CityCommitEngine
from city_mind.memory.delta_logger import DeltaLogger


def test_genesis_commits():
    engine = CityCommitEngine()
    commits = engine.list_commits()
    assert len(commits) >= 5
    downtown_timeline = engine.get_zone_timeline("zone-downtown")
    assert len(downtown_timeline) >= 1
    assert downtown_timeline[-1].parent_hash is None


def test_create_commit_chain_and_diffs():
    engine = CityCommitEngine()
    zone_id = "zone-west"

    initial_timeline = engine.get_zone_timeline(zone_id)
    parent_hash = initial_timeline[0].commit_hash if initial_timeline else None

    c1 = engine.create_commit(
        zone_id=zone_id,
        domain=DomainType.ENVIRONMENT,
        trigger=TriggerType.THRESHOLD_CROSSING,
        previous_state={"water_level_m": 1.2, "status": "optimal"},
        current_state={"water_level_m": 2.5, "status": "warning"},
        sensor_evidence={"sensor": "river-gauge-1", "value": 2.5},
        ai_summary="River level rose to warning threshold 2.5m",
        confidence=0.97
    )

    assert c1.parent_hash == parent_hash
    assert len(c1.commit_hash) == 16
    assert engine.get_commit(c1.commit_hash) is not None

    c2 = engine.create_commit(
        zone_id=zone_id,
        domain=DomainType.ENVIRONMENT,
        trigger=TriggerType.THRESHOLD_CROSSING,
        previous_state={"water_level_m": 2.5, "status": "warning"},
        current_state={"water_level_m": 3.1, "status": "critical"},
        sensor_evidence={"sensor": "river-gauge-1", "value": 3.1},
        ai_summary="River level reached critical threshold 3.1m",
        confidence=0.99
    )

    assert c2.parent_hash == c1.commit_hash

    diff = engine.diff_commits(c1.commit_hash, c2.commit_hash)
    assert diff is not None
    assert diff.commit_a == c1.commit_hash
    assert diff.commit_b == c2.commit_hash
    assert len(diff.state_diffs) > 0


def test_delta_logger_computation():
    dl = DeltaLogger()
    state1 = {"traffic_speed_kmh": 40.0, "aqi": 50.0}
    diffs1 = dl.compute_diffs("zone-east", state1)
    assert len(diffs1) == 2
    assert diffs1[0].previous_value is None

    state2 = {"traffic_speed_kmh": 15.0, "aqi": 50.0}
    diffs2 = dl.compute_diffs("zone-east", state2)
    assert len(diffs2) == 1
    assert diffs2[0].metric == "traffic_speed_kmh"
    assert diffs2[0].previous_value == 40.0
    assert diffs2[0].current_value == 15.0
    assert diffs2[0].delta == -25.0
