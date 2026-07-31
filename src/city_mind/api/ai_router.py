"""CityMind - AI Memory & RAG Chat API Router."""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Query
from pydantic import BaseModel
from city_mind.ai.rag_engine import rag_engine
from city_mind.ai.vector_store import vector_memory_store
from city_mind.ai.knowledge_graph import knowledge_graph


router = APIRouter(prefix="/api/v1/ai", tags=["AI Memory & RAG"])


class AIChatRequest(BaseModel):
    prompt: str
    zone_id: Optional[str] = None


@router.post("/chat")
async def ai_chat(request: AIChatRequest):
    """RAG-enhanced AI reasoning endpoint over historical City Commits and Causal Knowledge Graph."""
    return rag_engine.query(user_prompt=request.prompt, zone_id=request.zone_id)


@router.get("/memory/search")
async def search_memory(q: str, top_k: int = Query(default=5, le=20)):
    """Perform semantic vector search over stored City Commits."""
    results = vector_memory_store.search(q, top_k=top_k)
    return [
        {
            "commit_hash": commit.commit_hash,
            "zone_id": commit.zone_id,
            "domain": commit.domain.value,
            "summary": commit.ai_summary,
            "relevance_score": score
        }
        for commit, score in results
    ]


@router.get("/memory/graph")
async def get_causal_graph():
    """Retrieve the Causal Knowledge Graph representation."""
    return knowledge_graph.get_full_graph()
