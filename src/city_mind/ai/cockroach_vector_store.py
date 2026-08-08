"""CityMind - CockroachDB Distributed Vector Indexing Engine.

Stores and queries embeddings using CockroachDB's distributed vector support with VECTOR INDEX.
"""

import json
from typing import List, Dict, Any, Tuple, Optional
from city_mind.core.config import settings
from city_mind.models.commit import CityCommit


class CockroachVectorStoreEngine:
    def __init__(self):
        self.enabled = False
        self._connection = None
        self._init_db()

    def _init_db(self):
        try:
            import psycopg2
            conn = psycopg2.connect(settings.COCKROACH_DATABASE_URL, connect_timeout=3)
            cursor = conn.cursor()
            
            # Initialize CockroachDB Distributed Vector Table & Vector Index
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS city_commit_vectors (
                    commit_hash VARCHAR(64) PRIMARY KEY,
                    zone_id VARCHAR(64) NOT NULL,
                    domain VARCHAR(32) NOT NULL,
                    trigger_type VARCHAR(64) NOT NULL,
                    ai_summary TEXT NOT NULL,
                    vector_embedding VECTOR(384),
                    created_at TIMESTAMPTZ DEFAULT clock_timestamp(),
                    metadata JSONB
                );
            """)
            
            # Attempt to create CockroachDB VECTOR INDEX if supported
            try:
                cursor.execute("""
                    CREATE VECTOR INDEX IF NOT EXISTS idx_city_commit_vector 
                    ON city_commit_vectors (vector_embedding L2DISTANCE);
                """)
            except Exception:
                conn.rollback()

            conn.commit()
            cursor.close()
            conn.close()
            self.enabled = True
        except Exception as e:
            # Graceful fallback when CockroachDB instance is not active
            self.enabled = False

    def index_commit(self, commit: CityCommit, embedding: List[float]) -> bool:
        if not self.enabled:
            return False

        try:
            import psycopg2
            conn = psycopg2.connect(settings.COCKROACH_DATABASE_URL, connect_timeout=3)
            cursor = conn.cursor()

            vector_str = f"[{','.join(map(str, embedding))}]"
            metadata_json = json.dumps({
                "confidence": commit.confidence,
                "tags": commit.tags,
                "diffs_count": len(commit.diffs)
            })

            cursor.execute("""
                INSERT INTO city_commit_vectors (commit_hash, zone_id, domain, trigger_type, ai_summary, vector_embedding, metadata)
                VALUES (%s, %s, %s, %s, %s, %s::vector, %s)
                ON CONFLICT (commit_hash) DO UPDATE 
                SET ai_summary = EXCLUDED.ai_summary, vector_embedding = EXCLUDED.vector_embedding;
            """, (
                commit.commit_hash,
                commit.zone_id,
                commit.domain.value,
                commit.trigger.value,
                commit.ai_summary,
                vector_str,
                metadata_json
            ))

            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Exception:
            return False

    def search_similar(self, query_embedding: List[float], top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
        if not self.enabled:
            return []

        try:
            import psycopg2
            conn = psycopg2.connect(settings.COCKROACH_DATABASE_URL, connect_timeout=3)
            cursor = conn.cursor()

            vector_str = f"[{','.join(map(str, query_embedding))}]"
            
            # CockroachDB Distributed Vector Indexing Cosine / L2 distance query
            cursor.execute("""
                SELECT commit_hash, zone_id, domain, ai_summary, metadata,
                       (1.0 - (vector_embedding <=> %s::vector)) AS similarity
                FROM city_commit_vectors
                ORDER BY vector_embedding <=> %s::vector ASC
                LIMIT %s;
            """, (vector_str, vector_str, top_k))

            rows = cursor.fetchall()
            cursor.close()
            conn.close()

            results = []
            for r in rows:
                results.append(({
                    "commit_hash": r[0],
                    "zone_id": r[1],
                    "domain": r[2],
                    "ai_summary": r[3],
                    "metadata": r[4]
                }, float(r[5])))

            return results
        except Exception:
            return []


cockroach_vector_store = CockroachVectorStoreEngine()
