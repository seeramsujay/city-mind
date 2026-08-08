<div align="center">

# 🌆 CityMind

### *A Git-Inspired AI Memory Operating System for Smart Cities*

[![CockroachDB](https://img.shields.io/badge/CockroachDB-Vector_Indexing-6933FF?style=for-the-badge&logo=cockroachlabs&logoColor=white)](https://cockroachlabs.com)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon_Bedrock-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io)

[Architecture](#-system-architecture) • [CockroachDB & AWS Tooling](#-cockroachdb--aws-integrations) • [Key Innovations](#-the-paradigm-shift) • [Tech Stack](#-tech-stack) • [Quickstart](#-getting-started)

---

</div>

## 💡 Overview

**CityMind** transforms continuous, overwhelming IoT telemetry streams into a **persistent, version-controlled AI memory operating system**. 

Instead of dumping millions of unindexed time-series sensor values into a storage black hole, CityMind records **event-driven state diffs**—termed **City Commits**. Every significant state change (threshold crossings, environmental anomalies, citizen feedback, or agent observations) creates an immutable SHA-256 commit.

This enables autonomous AI agents to query historical context, perform root-cause analysis over past incidents, and make **explainable, evidence-backed urban decisions**.

---

## 🛠️ CockroachDB & AWS Integrations

CityMind integrates distributed enterprise cloud infrastructure using **CockroachDB** and **AWS Services**:

### 🪳 CockroachDB Ecosystem
1. **CockroachDB Distributed Vector Indexing**:
   - Stores and retrieves high-dimensional vector embeddings using native `VECTOR(384)` data types and `VECTOR INDEX` with cosine distance (`<=>`).
   - Ensures zero consistency gap between operational state diffs and vector data.
2. **CockroachDB Cloud Managed MCP Server (`https://cockroachlabs.cloud/mcp`)**:
   - Enables AI agents to directly inspect, query, and optimize cluster database schemas via Model Context Protocol.
3. **ccloud CLI & CockroachDB Agent Skills**:
   - Executable agent skills (`.agents/skills/cockroachdb-management/SKILL.md`) for automated schema migrations and `ccloud` control plane administration.

### ☁️ AWS Services
1. **Amazon Bedrock**:
   - Powers RAG reasoning and embedding generation using Bedrock Runtime (`anthropic.claude-3-5-sonnet` and `amazon.titan-embed-text-v1`).
2. **Amazon S3**:
   - Archives SHA-256 City Commit payloads and telemetry stream snapshots into persistent object storage (`citymind-event-memory-archive`).

---

## ⚡ The Paradigm Shift

| Feature | Traditional Smart City Systems | 🌆 CityMind Memory OS |
| :--- | :--- | :--- |
| **Data Strategy** | Continuous 24/7 raw sensor stream logging | **Event-Driven State Diffs** (*City Commits*) |
| **Vector Indexing** | Isolated vector database silos | **CockroachDB Distributed Vector Indexing** |
| **AI Reasoning** | Isolated, reactive single-event rules | **Amazon Bedrock (Claude 3.5 Sonnet) RAG** |
| **Historical Context** | Hard-to-query time-series databases | **Hierarchical AI Memory** (*Hot / Warm / Cold*) |
| **Archive Storage** | Static local file dumps | **Amazon S3 Event Archive** |

---

## 🧠 System Architecture

```
                  ┌─────────────────────────────────────────┐
                  │   IoT Sensors & Environmental Data      │
                  └────────────────────┬────────────────────┘
                                       │ Raw Telemetry Stream
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    Hot Memory (Telemetry Buffer)        │
                  └────────────────────┬────────────────────┘
                                       │ Threshold Crossings & Anomalies
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    City Commit Generator (State Diffs)  │
                  └────────────────────┬────────────────────┘
                                       │ Immutable SHA-256 Commits
                                       ▼
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌───────────┐                    ┌───────────┐                     ┌───────────┐
│Warm Memory│                    │ Amazon S3 │                     │CockroachDB│
│ (Postgres)│                    │ (Archive) │                     │ (Vector)  │
└─────┬─────┘                    └─────┬─────┘                     └─────┬─────┘
      │                                │                                 │
      └────────────────────────────────┼─────────────────────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ Autonomous Multi-Agent Mesh & Bedrock   │
                  │ (Amazon Bedrock RAG + Claude 3.5)       │
                  └────────────────────┬────────────────────┘
                                       │ Explainable Decisions & Actions
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │     City Control Dashboard & APIs       │
                  └─────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/seeramsujay/city-mind.git
cd city-mind

# Install backend dependencies via uv
uv sync

# Install frontend dependencies via pnpm
pnpm install
```

### 2. Running Tests

```bash
# Run backend Pytest suite (includes CockroachDB & AWS tests)
uv run pytest
```

### 3. Running Development Servers

```bash
# Terminal 1: Backend FastAPI Server
uv run uvicorn city_mind.main:app --reload --port 8000

# Terminal 2: Frontend Vite Dev Server
pnpm run dev
```