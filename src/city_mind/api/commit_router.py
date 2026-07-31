"""CityMind - Git-Inspired City Commit API Router."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from city_mind.models.commit import CityCommit, CommitDiffResponse, TriggerType
from city_mind.models.telemetry import DomainType
from city_mind.memory.commit_engine import commit_engine


router = APIRouter(prefix="/api/v1/commits", tags=["Event Memory Engine (Commits)"])


@router.get("", response_model=List[CityCommit])
async def list_commits(
    zone_id: Optional[str] = None,
    domain: Optional[DomainType] = None,
    limit: int = Query(default=50, le=200)
):
    """List event-sourced City Commits with optional domain/zone filtering."""
    return commit_engine.list_commits(zone_id=zone_id, domain=domain, limit=limit)


@router.get("/hash/{commit_hash}", response_model=CityCommit)
async def get_commit(commit_hash: str):
    """Retrieve a specific City Commit by SHA-256 hash."""
    commit = commit_engine.get_commit(commit_hash)
    if not commit:
        raise HTTPException(status_code=404, detail=f"Commit hash {commit_hash} not found")
    return commit


@router.get("/timeline/{zone_id}", response_model=List[CityCommit])
async def get_zone_timeline(zone_id: str, limit: int = Query(default=30, le=100)):
    """Get chronologically linked commit chain for a zone."""
    return commit_engine.get_zone_timeline(zone_id=zone_id, limit=limit)


@router.get("/diff/{hash_a}/{hash_b}", response_model=CommitDiffResponse)
async def diff_commits(hash_a: str, hash_b: str):
    """Compare two City Commits and return state diffs and comparative AI analysis."""
    diff_res = commit_engine.diff_commits(hash_a, hash_b)
    if not diff_res:
        raise HTTPException(status_code=404, detail="One or both commit hashes were not found")
    return diff_res
