"""CityMind - Git-Inspired City Commit Engine."""

from datetime import datetime
from typing import Dict, List, Optional, Any
from city_mind.models.commit import CityCommit, StateDiff, TriggerType, CommitDiffResponse
from city_mind.models.telemetry import DomainType
from city_mind.memory.delta_logger import delta_logger


class CityCommitEngine:
    def __init__(self):
        # Store commits indexed by commit_hash
        self.commits_by_hash: Dict[str, CityCommit] = {}
        # Zone timeline commit chains
        self.zone_commit_chains: Dict[str, List[str]] = {}
        # Seed initial genesis commits
        self._seed_genesis_commits()

    def _seed_genesis_commits(self):
        zones = ["zone-downtown", "zone-north", "zone-west", "zone-east", "zone-south"]
        for zone in zones:
            initial_state = {
                "traffic_speed_kmh": 45.0,
                "water_level_m": 1.0,
                "aqi": 42.0,
                "status": "optimal"
            }
            timestamp = datetime.utcnow().isoformat()
            c_hash = CityCommit.generate_hash(None, timestamp, zone, "system", "Genesis Commit")
            
            commit = CityCommit(
                commit_hash=c_hash,
                parent_hash=None,
                timestamp=datetime.utcnow(),
                zone_id=zone,
                domain=DomainType.INFRASTRUCTURE,
                trigger=TriggerType.HEARTBEAT,
                previous_state={},
                current_state=initial_state,
                diffs=[StateDiff(metric="system", previous_value=None, current_value="initialized")],
                sensor_evidence={"genesis": True},
                ai_summary=f"Genesis City Commit initialized baseline for {zone}",
                confidence=1.0,
                tags=["genesis", "baseline"]
            )
            self.commits_by_hash[c_hash] = commit
            self.zone_commit_chains[zone] = [c_hash]

    def create_commit(
        self,
        zone_id: str,
        domain: DomainType,
        trigger: TriggerType,
        previous_state: Dict[str, Any],
        current_state: Dict[str, Any],
        sensor_evidence: Dict[str, Any],
        ai_summary: str,
        confidence: float = 0.95,
        tags: Optional[List[str]] = None
    ) -> CityCommit:
        chain = self.zone_commit_chains.setdefault(zone_id, [])
        parent_hash = chain[-1] if chain else None
        
        diffs = delta_logger.compute_diffs(zone_id, current_state)
        diff_summary = ", ".join([f"{d.metric}: {d.previous_value}->{d.current_value}" for d in diffs[:3]])
        
        timestamp_str = datetime.utcnow().isoformat()
        commit_hash = CityCommit.generate_hash(parent_hash, timestamp_str, zone_id, domain.value, diff_summary)
        
        commit = CityCommit(
            commit_hash=commit_hash,
            parent_hash=parent_hash,
            timestamp=datetime.utcnow(),
            zone_id=zone_id,
            domain=domain,
            trigger=trigger,
            previous_state=previous_state,
            current_state=current_state,
            diffs=diffs,
            sensor_evidence=sensor_evidence,
            ai_summary=ai_summary,
            confidence=confidence,
            tags=tags or [domain.value, trigger.value]
        )
        
        self.commits_by_hash[commit_hash] = commit
        chain.append(commit_hash)
        return commit

    def get_commit(self, commit_hash: str) -> Optional[CityCommit]:
        return self.commits_by_hash.get(commit_hash)

    def get_zone_timeline(self, zone_id: str, limit: int = 50) -> List[CityCommit]:
        chain = self.zone_commit_chains.get(zone_id, [])
        hashes = chain[-limit:]
        return [self.commits_by_hash[h] for h in reversed(hashes) if h in self.commits_by_hash]

    def list_commits(
        self,
        zone_id: Optional[str] = None,
        domain: Optional[DomainType] = None,
        limit: int = 50
    ) -> List[CityCommit]:
        all_commits = sorted(self.commits_by_hash.values(), key=lambda c: c.timestamp, reverse=True)
        filtered = []
        for c in all_commits:
            if zone_id and c.zone_id != zone_id:
                continue
            if domain and c.domain != domain:
                continue
            filtered.append(c)
            if len(filtered) >= limit:
                break
        return filtered

    def diff_commits(self, hash_a: str, hash_b: str) -> Optional[CommitDiffResponse]:
        c_a = self.get_commit(hash_a)
        c_b = self.get_commit(hash_b)
        if not c_a or not c_b:
            return None

        # Calculate differential between commit A and commit B states
        keys = set(c_a.current_state.keys()) | set(c_b.current_state.keys())
        diffs = []
        for k in keys:
            v_a = c_a.current_state.get(k)
            v_b = c_b.current_state.get(k)
            if v_a != v_b:
                delta = None
                if isinstance(v_a, (int, float)) and isinstance(v_b, (int, float)):
                    delta = round(v_b - v_a, 2)
                diffs.append(
                    StateDiff(
                        metric=k,
                        previous_value=v_a,
                        current_value=v_b,
                        delta=delta
                    )
                )

        summary = (
            f"State diff between Commit {hash_a[:7]} ({c_a.timestamp.strftime('%H:%M:%S')}) "
            f"and Commit {hash_b[:7]} ({c_b.timestamp.strftime('%H:%M:%S')}). "
            f"{len(diffs)} metric delta changes detected."
        )

        return CommitDiffResponse(
            commit_a=hash_a,
            commit_b=hash_b,
            zone_id=c_a.zone_id,
            domain_a=c_a.domain.value,
            domain_b=c_b.domain.value,
            timestamp_a=c_a.timestamp,
            timestamp_b=c_b.timestamp,
            state_diffs=diffs,
            ai_comparative_summary=summary
        )


commit_engine = CityCommitEngine()
