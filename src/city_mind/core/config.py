"""CityMind - Core Configuration Module."""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application Settings."""

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "sqlite:///./citymind.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    TIMESCALE_URL: Optional[str] = None

    MQTT_BROKER_HOST: str = "localhost"
    MQTT_BROKER_PORT: int = 1883
    MQTT_TOPIC_PREFIX: str = "citymind/sensors"

    OPENAI_API_KEY: Optional[str] = None
    QDRANT_URL: str = "http://localhost:6333"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    # CockroachDB Distributed Vector Indexing & Cloud MCP Server
    COCKROACH_DATABASE_URL: Optional[str] = "postgresql://root@localhost:26257/citymind?sslmode=disable"
    COCKROACH_VECTOR_DIMENSION: int = 384
    COCKROACH_MCP_ENDPOINT: str = "https://cockroachlabs.cloud/mcp"

    # AWS Services (Amazon Bedrock & Amazon S3)
    AWS_REGION: str = "us-east-1"
    AWS_BEDROCK_MODEL_ID: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    AWS_BEDROCK_EMBEDDING_MODEL_ID: str = "amazon.titan-embed-text-v1"
    AWS_S3_BUCKET_NAME: str = "citymind-event-memory-archive"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
