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

    # Google Gemini Free Tier AI Settings
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"

    QDRANT_URL: str = "http://localhost:6333"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    # CockroachDB Distributed Vector Indexing & Cloud MCP Server
    COCKROACH_DATABASE_URL: Optional[str] = "postgresql://root@localhost:26257/citymind?sslmode=disable"
    COCKROACH_VECTOR_DIMENSION: int = 384
    COCKROACH_MCP_ENDPOINT: str = "https://cockroachlabs.cloud/mcp"

    # AWS Forever Free Tier Services (DynamoDB 25GB Always Free, SNS 1M pushes/mo, SQS 1M req/mo, Lambda 1M/mo)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_SESSION_TOKEN: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    AWS_DYNAMODB_TABLE_NAME: str = "citymind-commits"
    AWS_SNS_CRITICAL_ALERTS_TOPIC_ARN: Optional[str] = None
    AWS_SQS_TELEMETRY_QUEUE_URL: Optional[str] = None
    AWS_S3_BUCKET_NAME: str = "citymind-event-memory-archive"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

