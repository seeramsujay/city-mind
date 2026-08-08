"""CityMind - Vector Memory Store & Embedding Pipeline.

Integrates CockroachDB Distributed Vector Indexing and Amazon Bedrock Titan embeddings.
"""

import math
import re
from collections import Counter
from typing import List, Dict, Any, Tuple, Optional
from city_mind.models.commit import CityCommit
from city_mind.ai.cockroach_vector_store import cockroach_vector_store
from city_mind.ai.bedrock_service import bedrock_service
from city_mind.services.s3_archive import s3_archive_service


def simple_tokenize(text: str) -> List[str]:
    return re.findall(r"\w+", text.lower())


class VectorMemoryStore:
    def __init__(self):
        # Stores local (commit_hash, text, vector, metadata)
        self.documents: List[Dict[str, Any]] = []

    def _text_to_vector(self, text: str) -> Dict[str, float]:
        tokens = simple_tokenize(text)
        counts = Counter(tokens)
        total = len(tokens) or 1
        return {word: count / total for word, count in counts.items()}

    def _cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        intersection = set(vec1.keys()) & set(vec2.keys())
        if not intersection:
            return 0.0
        
        dot_product = sum(vec1[w] * vec2[w] for w in intersection)
        mag1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
        mag2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
        
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot_product / (mag1 * mag2)

    def index_commit(self, commit: CityCommit):
        text_content = (
            f"Zone: {commit.zone_id}. Domain: {commit.domain.value}. Trigger: {commit.trigger.value}. "
            f"Summary: {commit.ai_summary}. Tags: {' '.join(commit.tags)}. "
            f"Diffs: {' '.join([d.metric for d in commit.diffs])}"
        )
        
        # Generate 384-dim dense embedding vector using Amazon Bedrock Titan
        dense_embedding = bedrock_service.generate_embeddings(text_content)
        
        # 1. Index into CockroachDB Distributed Vector Indexing engine
        cockroach_indexed = cockroach_vector_store.index_commit(commit, dense_embedding)

        # 2. Archive commit snapshot to Amazon S3 Object Archive
        s3_archive_service.archive_commit(commit)

        # 3. Maintain in-memory document store fallback
        vec = self._text_to_vector(text_content)
        for doc in self.documents:
            if doc["commit_hash"] == commit.commit_hash:
                doc["text"] = text_content
                doc["vector"] = vec
                doc["dense_embedding"] = dense_embedding
                doc["commit"] = commit
                return

        self.documents.append({
            "commit_hash": commit.commit_hash,
            "text": text_content,
            "vector": vec,
            "dense_embedding": dense_embedding,
            "commit": commit
        })

    def search(self, query: str, top_k: int = 5) -> List[Tuple[CityCommit, float]]:
        # Check CockroachDB Distributed Vector Indexing first if enabled
        if cockroach_vector_store.enabled:
            query_embedding = bedrock_service.generate_embeddings(query)
            crdb_results = cockroach_vector_store.search_similar(query_embedding, top_k=top_k)
            if crdb_results:
                matched_commits = []
                for res_item, score in crdb_results:
                    for doc in self.documents:
                        if doc["commit_hash"] == res_item["commit_hash"]:
                            matched_commits.append((doc["commit"], round(score, 4)))
                            break
                if matched_commits:
                    return matched_commits

        if not self.documents:
            return []

        query_vec = self._text_to_vector(query)
        scored = []

        for doc in self.documents:
            score = self._cosine_similarity(query_vec, doc["vector"])
            query_tokens = set(simple_tokenize(query))
            doc_tokens = set(simple_tokenize(doc["text"]))
            overlap = len(query_tokens & doc_tokens)
            boosted_score = min(1.0, score + (overlap * 0.1))
            
            if boosted_score > 0.05:
                scored.append((doc["commit"], round(boosted_score, 4)))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]


vector_memory_store = VectorMemoryStore()
