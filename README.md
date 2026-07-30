<div align="center">

# 🌆 CityMind

### *A Git-Inspired AI Memory Operating System for Smart Cities*

[![Python Version](https://img.shields.io/badge/python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

[Architecture](#-system-architecture) • [Key Innovations](#-the-paradigm-shift) • [Tech Stack](#-tech-stack) • [Quickstart](#-getting-started) • [Roadmap](#-roadmap)

---

</div>

## 💡 Overview

**CityMind** transforms continuous, overwhelming IoT telemetry streams into a **persistent, version-controlled AI memory operating system**. 

Instead of dumping millions of unindexed time-series sensor values into a storage black hole, CityMind records **event-driven state diffs**—termed **City Commits**. Every significant state change (threshold crossings, environmental anomalies, citizen feedback, or agent observations) creates an immutable commit.

This enables autonomous AI agents to query historical context, perform root-cause analysis over past incidents, and make **explainable, evidence-backed urban decisions**.

---

## ⚡ The Paradigm Shift

| Feature | Traditional Smart City Systems | 🌆 CityMind Memory OS |
| :--- | :--- | :--- |
| **Data Strategy** | Continuous 24/7 raw sensor stream logging | **Event-Driven State Diffs** (*City Commits*) |
| **Storage Overhead** | Massive redundancy, high telemetry costs | **High Signal-to-Noise Ratio**, optimized delta logs |
| **Historical Context** | Hard-to-query time-series databases | **Hierarchical AI Memory** (*Hot / Warm / Cold*) |
| **AI Reasoning** | Isolated, reactive single-event rules | **Multi-Agent RAG + Causal Knowledge Graphs** |
| **Decision Output** | Black-box alerts or raw dashboard charts | **Explainable AI** with evidence trails & past commit references |

---

## 🧠 System Architecture & Concepts

```
                  ┌─────────────────────────────────────────┐
                  │   IoT Sensors & Environmental Data       │
                  └────────────────────┬────────────────────┘
                                       │ Raw Telemetry Stream
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    Hot Memory (Telemetry Buffer)         │
                  └────────────────────┬────────────────────┘
                                       │ Threshold Crossings & Anomalies
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    City Commit Generator (State Diffs)   │
                  └────────────────────┬────────────────────┘
                                       │ Immutable Commits
                                       ▼
     ┌─────────────────────────────────┼─────────────────────────────────┐
     ▼                                 ▼                                 ▼
┌───────────┐                    ┌───────────┐                     ┌───────────┐
│Warm Memory│                    │ Cold Graph│                     │Cold Vector│
│(Delta Logs)│                   │(Knowledge)│                     │ (Embeds)  │
└─────┬─────┘                    └─────┬─────┘                     └─────┬─────┘
      │                                │                                 │
      └────────────────────────────────┼─────────────────────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ Autonomous Multi-Agent AI System         │
                  │ (Traffic, Environment, Emergency, etc.) │
                  └────────────────────┬────────────────────┘
                                       │ Explainable Decisions & Actions
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │     City Control Dashboard & APIs       │
                  └─────────────────────────────────────────┘
```

### 1. 🌳 City Commits (State Delta Sourcing)
Each commit represents a delta change in city status and stores:
- **Timestamp & Zone**: Precise geographical and temporal boundaries.
- **Previous & Current State**: Differential state metrics (e.g., `Traffic: Normal ➔ Congested`).
- **Evidence & Sensor Payload**: Triggering threshold metrics, anomalies, or citizen reports.
- **Parent Commit Hash**: Cryptographically linked history forming an immutable chain of urban events.

### 2. 🏛️ Hierarchical Memory Tiers
- 🔥 **Hot Memory** (1–2 hrs): High-speed live telemetry buffer for real-time threshold detection.
- ☀️ **Warm Memory**: Operational event history storing structured City Commits and zone timelines.
- ❄️ **Cold Memory**: Vector embeddings (Qdrant) and Causal Knowledge Graphs (Neo4j) for long-term semantic retrieval.

### 3. 🤖 Autonomous Multi-Agent Mesh
Specialized domain agents interact collaboratively over shared city memory:
- 🚗 **Traffic Agent**: Congestion tracking, signal optimization, and routing.
- 🌊 **Environment Agent**: Flood monitoring, air quality alerts, and weather impacts.
- 🏗️ **Infrastructure Agent**: Power grid integrity, water system oversight, maintenance.
- 🚨 **Emergency Agent**: Rapid incident response, disaster routing, and safety coordination.
- 🏙️ **Citizen Services Agent**: Public feedback correlation and municipal service tracking.

---

## 🛠️ Tech Stack

### **Backend & AI Core**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com) (Async Python 3.10+)
- **Task Queue**: [Celery](https://docs.celeryq.dev/) + [Redis](https://redis.io/)
- **AI Orchestration**: [LangGraph](https://github.com/langchain-ai/langgraph) / LangChain
- **Vector Search**: [Qdrant](https://qdrant.tech/)
- **Graph Database**: [Neo4j](https://neo4j.com/)

### **Data Layer**
- **Relational / Event DB**: PostgreSQL / CockroachDB
- **Time-Series Buffer**: TimescaleDB
- **Broker**: MQTT / Apache Kafka

### **Frontend Dashboard**
- **UI Framework**: React + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Geospatial & Charts**: Leaflet / Mapbox & Recharts

---

## 📂 Project Structure

```
city-mind/
├── src/
│   └── city_mind/         # Core Python Backend Package
│       ├── __init__.py
│       ├── main.py        # FastAPI Application Entrypoint
│       ├── api/           # REST & WebSocket API Routes
│       ├── core/          # Commit Generator & Delta Engine
│       ├── models/        # Pydantic Schemas & DB Models
│       └── agents/        # Multi-Agent RAG Orchestration
├── IDEA.md                # In-depth Architectural Vision
├── ROADMAP.md             # Development Phases & Milestones
├── CONTRIBUTING.md        # Collaboration Guidelines
├── pyproject.toml         # Python Project Metadata & Dependencies
├── requirements.txt       # Compiled Dependencies (for pip/poetry users)
├── .env.example           # Environment Template
└── README.md              # Project Overview
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ & `pnpm`
- Git

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/your-org/city-mind.git
cd city-mind

# Copy the environment file
cp .env.example .env
```

### 2. Backend Installation

#### Option A: Using `pip`
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Option B: Using `poetry`
```bash
poetry install
```

### 3. Run the Development Server

```bash
uvicorn src.city_mind.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` to interact with the OpenAPI Swagger documentation.

---

## 🗺️ Roadmap & Status

- [x] **Phase 1: Foundation & Core Repo Setup** — Initial architecture, FastAPI scaffolding, and commit schema design.
- [ ] **Phase 2: Event Memory Engine** — Threshold detection, state delta logger, and commit chain timeline.
- [ ] **Phase 3: AI Memory & Vector RAG** — Embeddings pipeline, Qdrant vector retrieval, and Neo4j causal knowledge graph.
- [ ] **Phase 4: Autonomous Multi-Agent Mesh** — Specialized agents (Traffic, Environment, Emergency) with shared memory reasoning.
- [ ] **Phase 5: Predictive Intelligence & Digital Twin** — Scenario simulations, flood forecasting, and preventive alerts.

For a detailed phase breakdown, check out [ROADMAP.md](ROADMAP.md).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting pull requests.

---

<div align="center">

Made with ❤️ for Smart, Resilient & Explainable Future Cities.

</div>