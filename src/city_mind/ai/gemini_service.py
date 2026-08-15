"""CityMind - Google Gemini Free Tier AI Reasoning & Insight Service.

Interfaces with Google Gemini 1.5 Flash API via zero-cost free tier using httpx.
"""

from typing import Dict, Any, List, Optional
import httpx
from city_mind.core.config import settings


class GoogleGeminiService:
    def __init__(self):
        self.model = settings.GEMINI_MODEL
        self.api_key = settings.GEMINI_API_KEY

    @property
    def enabled(self) -> bool:
        return bool(self.api_key and self.api_key != "your_gemini_api_key_here")

    def generate_insight(self, prompt: str, context_commits: List[Dict[str, Any]]) -> Optional[str]:
        """Performs RAG reasoning using Google Gemini 1.5 Flash Free Tier."""
        if not self.enabled:
            return None

        try:
            context_str = "\n".join([
                f"- Commit {c.get('commit_hash', '')[:7]} [{c.get('zone_id', '')}]: {c.get('summary', '')}"
                for c in context_commits
            ])

            user_prompt = (
                f"You are CityMind AI, an urban decision intelligence engine.\n"
                f"User Question: {prompt}\n\n"
                f"Retrieved Smart City Memory Context:\n{context_str}\n\n"
                f"Provide a concise, actionable urban operational insight and recommended response."
            )

            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": user_prompt}
                        ]
                    }
                ]
            }

            with httpx.Client(timeout=10.0) as client:
                resp = client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        except Exception:
            return None
        return None


gemini_service = GoogleGeminiService()
