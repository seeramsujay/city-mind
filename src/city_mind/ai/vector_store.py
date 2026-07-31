"""CityMind - Vector Memory Store & Embedding Pipeline."""

import math
import re
from collections import Counter
from typing import List, Dict, Any, Tuple, Optional
from city_mind.models.commit import CityCommit


def simple_tokenize(text: str) -> List[str]:
    return re.findall(r"\w+", text.lower())


class VectorMemoryStore:
    def __init__(self):
        # Stores (commit_hash, text, vector, metadata)
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
        vec = self._text_to_vector(text_content)
        
        # Check if already indexed
        for doc in self.documents:
            if doc["commit_hash"] == commit.commit_hash:
                doc["text"] = text_content
                doc["vector"] = vec
                doc["commit"] = commit
                return

        self.documents.append({
            "commit_hash": commit.commit_hash,
            "text": text_content,
            "vector": vec,
            "commit": commit
        })

    def search(self, query: str, top_k: int = 5) -> List[Tuple[CityCommit, float]]:
        if not self.documents:
            return []

        query_vec = self._text_to_vector(query)
        scored = []

        for doc in self.documents:
            score = self._cosine_similarity(query_vec, doc["vector"])
            # Boost score if tags or keywords match query tokens directly
            query_tokens = set(simple_tokenize(query))
            doc_tokens = set(simple_tokenize(doc["text"]))
            overlap = len(query_tokens & doc_tokens)
            boosted_score = min(1.0, score + (overlap * 0.1))
            
            if boosted_score > 0.05:
                scored.append((doc["commit"], round(boosted_score, 4)))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]


vector_memory_store = VectorMemoryStore()
