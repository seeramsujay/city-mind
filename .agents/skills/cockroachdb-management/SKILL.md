---
name: cockroachdb-management
description: Machine-executable Agent Skill for CockroachDB schema design, distributed vector indexing, ccloud CLI execution, and cluster management.
---

# CockroachDB Management & Agent Skills

Use this skill when managing CockroachDB clusters, designing vector indexing schemas, or running `ccloud` CLI automation.

## 1. CockroachDB Distributed Vector Indexing Schema

To store and query high-dimensional embeddings efficiently in CockroachDB:

```sql
-- Create vector table for SHA-256 City Commits
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

-- Create Distributed Vector Index using L2 Distance / Cosine Distance
CREATE VECTOR INDEX idx_city_commit_vector 
ON city_commit_vectors (vector_embedding L2DISTANCE);
```

## 2. Distributed Vector Cosine Similarity Search Query

```sql
SELECT commit_hash, zone_id, domain, ai_summary, metadata,
       (1.0 - (vector_embedding <=> $1::vector)) AS similarity
FROM city_commit_vectors
ORDER BY vector_embedding <=> $1::vector ASC
LIMIT 5;
```

## 3. Agent-Ready ccloud CLI Operations

Use `ccloud` CLI for provisioning and monitoring:

```bash
# List all active clusters with JSON output
ccloud cluster list --output json

# Inspect cluster metrics and health
ccloud cluster inspect <cluster_id> --output json

# Create database backup
ccloud backup create <cluster_id> --output json
```

## 4. CockroachDB Cloud Managed MCP Server

Endpoint: `https://cockroachlabs.cloud/mcp`
- Connects AI agents directly to CockroachDB clusters with read-only safety, audit logging, and zero proxy overhead.
