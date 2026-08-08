"""Unit tests for Vector Memory Store, Causal Knowledge Graph, and RAG Engine."""

import pytest
from city_mind.ai.vector_store import VectorMemoryStore
from city_mind.ai.knowledge_graph import CausalKnowledgeGraph
from city_mind.ai.rag_engine import RAGEngine
from city_mind.memory.commit_engine import commit_engine
from city_mind.models.commit import TriggerType
from city_mind.models.telemetry import DomainType


def test_vector_memory_store_indexing_and_search():
    store = VectorMemoryStore()
    commit = commit_engine.create_commit(
        zone_id="zone-west",
        domain=DomainType.ENVIRONMENT,
        trigger=TriggerType.THRESHOLD_CROSSING,
        previous_state={"water_level_m": 1.0},
        current_state={"water_level_m": 2.8},
        sensor_evidence={"sensor_id": "env-101"},
        ai_summary="Severe flooding risk in Zone West river basin",
        tags=["flood", "environment"]
    )

    store.index_commit(commit)
    assert len(store.documents) == 1

    results = store.search("flooding river basin", top_k=3)
    assert len(results) >= 1
    found_commit, score = results[0]
    assert found_commit.commit_hash == commit.commit_hash
    assert score > 0.3


def test_causal_knowledge_graph():
    kg = CausalKnowledgeGraph()
    # Test seeded graph nodes
    assert "HeavyRain" in kg.nodes
    assert "FlashFlood" in kg.nodes

    # Test causal chain pathfinding
    paths = kg.find_causal_chain("HeavyRain", max_depth=3)
    assert len(paths) > 0
    first_path = paths[0]
    assert first_path[0]["from"] == "HeavyRain"

    # Test adding custom node & edge
    kg.add_node("DamOverflow", "Dam Overflow Event", "Event")
    kg.add_edge("FlashFlood", "RISKS", "DamOverflow")
    
    full_graph = kg.get_full_graph()
    assert len(full_graph["nodes"]) >= 11
    assert any(e["target"] == "DamOverflow" for e in full_graph["edges"])


def test_rag_engine_reasoning():
    rag = RAGEngine()
    response = rag.query("What happens during heavy rain and flood risk in West Basin?")
    assert "response" in response
    assert "evidence_commits" in response
    assert "retrieved_commits" in response
    assert "causal_chains" in response
    assert response["confidence_score"] >= 0.8
