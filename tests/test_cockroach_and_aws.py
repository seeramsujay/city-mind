"""Integration tests for CockroachDB Vector Indexing and AWS Forever Free Services (DynamoDB, SNS, S3)."""

import pytest
from city_mind.ai.cockroach_vector_store import cockroach_vector_store
from city_mind.ai.gemini_service import gemini_service
from city_mind.services.dynamodb_archive import dynamodb_archive_service
from city_mind.services.sns_alerter import sns_alert_service
from city_mind.services.s3_archive import s3_archive_service
from city_mind.models.commit import CityCommit, TriggerType
from city_mind.models.telemetry import DomainType


def test_gemini_zero_cost_embedding_generation():
    text = "Traffic spike anomaly in Metro Expressway Zone 04"
    embedding = gemini_service.generate_embeddings(text, dim=384)
    assert isinstance(embedding, list)
    assert len(embedding) == 384
    assert any(x != 0.0 for x in embedding)


def test_cockroach_vector_store_indexing():
    dummy_commit = CityCommit(
        commit_hash="c0ckr0ach12345678",
        zone_id="zone-04",
        domain=DomainType.TRAFFIC,
        trigger=TriggerType.THRESHOLD_CROSSING,
        previous_state={"traffic": 42},
        current_state={"traffic": 81},
        diffs=[],
        sensor_evidence={},
        ai_summary="CockroachDB test commit"
    )
    vec = gemini_service.generate_embeddings(dummy_commit.ai_summary, dim=384)
    
    # Should execute without raising exceptions (either connected or falling back)
    res = cockroach_vector_store.index_commit(dummy_commit, vec)
    assert isinstance(res, bool)


def test_dynamodb_forever_free_archive_service():
    dummy_commit = CityCommit(
        commit_hash="dynam012345678",
        zone_id="zone-01",
        domain=DomainType.INFRASTRUCTURE,
        trigger=TriggerType.MANUAL_OVERRIDE,
        previous_state={"load_mw": 120},
        current_state={"load_mw": 85},
        diffs=[],
        sensor_evidence={},
        ai_summary="DynamoDB 25GB Free Forever commit snapshot"
    )

    success = dynamodb_archive_service.save_commit(dummy_commit)
    assert success is True
    
    retrieved = dynamodb_archive_service.get_commit("dynam012345678")
    assert retrieved is not None
    assert retrieved["zone_id"] == "zone-01"
    assert retrieved["domain"] == "infrastructure"

    status = dynamodb_archive_service.get_status()
    assert "25GB" in status["tier"]
    assert status["total_archived_in_memory"] >= 1


def test_sns_forever_free_alert_service():
    alert_resp = sns_alert_service.publish_critical_alert(
        zone_id="zone-west",
        domain="environment",
        severity="critical",
        summary="Flash flood warning: River sensor exceeded 2.5m threshold",
        metrics={"water_level_m": 2.8}
    )
    assert alert_resp["alert"]["severity"] == "CRITICAL"
    assert alert_resp["alert"]["zone_id"] == "zone-west"

    status = sns_alert_service.get_status()
    assert "1,000,000" in status["tier"]
    assert status["total_alerts_dispatched"] >= 1


def test_s3_archive_service():
    dummy_commit = CityCommit(
        commit_hash="s3arch1ve12345678",
        zone_id="zone-02",
        domain=DomainType.ENVIRONMENT,
        trigger=TriggerType.ANOMALY_DETECTED,
        previous_state={"rainfall": 0},
        current_state={"rainfall": 38},
        diffs=[],
        sensor_evidence={},
        ai_summary="S3 archive test commit"
    )
    
    status_before = s3_archive_service.archived_count
    s3_archive_service.archive_commit(dummy_commit)
    assert s3_archive_service.archived_count == status_before + 1

    status = s3_archive_service.get_archive_status()
    assert "bucket_name" in status
    assert status["total_archived_commits"] >= 1
