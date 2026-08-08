"""CityMind - Amazon Bedrock AI Reasoning & Embedding Service.

Interfaces with Amazon Bedrock Runtime (Claude 3.5 Sonnet / Titan Embeddings).
"""

import json
from typing import Dict, Any, List, Optional
from city_mind.core.config import settings


class AmazonBedrockService:
    def __init__(self):
        self.enabled = False
        self._bedrock_client = None
        self._init_client()

    def _init_client(self):
        try:
            import boto3
            self._bedrock_client = boto3.client(
                service_name="bedrock-runtime",
                region_name=settings.AWS_REGION
            )
            self.enabled = True
        except Exception:
            # Fallback mode when AWS credentials / boto3 runtime are not active locally
            self.enabled = False

    def generate_embeddings(self, text: str) -> List[float]:
        """Generates embeddings using Amazon Titan Embeddings or deterministic hash fallback."""
        if self.enabled and self._bedrock_client:
            try:
                body = json.dumps({"inputText": text})
                response = self._bedrock_client.invoke_model(
                    body=body,
                    modelId=settings.AWS_BEDROCK_EMBEDDING_MODEL_ID,
                    accept="application/json",
                    contentType="application/json"
                )
                response_body = json.loads(response.get("body").read())
                return response_body.get("embedding", [])
            except Exception:
                pass

        # Deterministic 384-dim pseudo-embedding generator fallback for local dev
        import hashlib
        tokens = text.lower().split()
        vector = [0.0] * 384
        for token in tokens:
            idx = int(hashlib.md5(token.encode()).hexdigest(), 16) % 384
            vector[idx] += 1.0
        norm = sum(x*x for x in vector) ** 0.5 or 1.0
        return [x / norm for x in vector]

    def invoke_claude_rag_reasoning(self, prompt: str, context_commits: List[Dict[str, Any]]) -> Optional[str]:
        """Performs RAG synthesis using Amazon Bedrock (Claude 3.5 Sonnet)."""
        if not self.enabled or not self._bedrock_client:
            return None

        try:
            context_str = "\n".join([
                f"- Commit {c.get('commit_hash', '')[:7]} [{c.get('zone_id', '')}]: {c.get('summary', '')}"
                for c in context_commits
            ])

            user_message = f"User Question: {prompt}\n\nRetrieved City Memory Context:\n{context_str}\n\nSynthesize a clear, actionable urban decision insight."
            
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 500,
                "messages": [
                    {"role": "user", "content": user_message}
                ]
            })

            response = self._bedrock_client.invoke_model(
                body=body,
                modelId=settings.AWS_BEDROCK_MODEL_ID,
                accept="application/json",
                contentType="application/json"
            )
            response_body = json.loads(response.get("body").read())
            content = response_body.get("content", [])
            if content and len(content) > 0:
                return content[0].get("text", "")
        except Exception:
            return None
        return None


bedrock_service = AmazonBedrockService()
