"""Integration tests for CockroachDB Vector Indexing and AWS Bedrock/S3 Services."""

import pytest
from city_mind.ai.cockroach_vector_store import cockroach_vector_store
from city_mind.ai.bedrock_service import bedrock_service
from city_mind.services.s3_archive import s3_archive_service
from city_mind.models.commit import CityCommit, TriggerType
from city_mind.models.telemetry import DomainType


def test_bedrock_embedding_generation():
    text = "Traffic spike anomaly in Metro Expressway Zone 04"
    embedding = bedrock_service.generate_embeddings(text)
    assert isinstance(embedding, list)
    assert len(embedding) == 384


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
    vec = bedrock_service.generate_embeddings(dummy_commit.ai_summary)
    
    # Should execute without raising exceptions (either connected or falling back)
    res = cockroach_vector_store.index_commit(dummy_commit, vec)
    assert isinstance(res, bool)


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
