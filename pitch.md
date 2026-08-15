# 🌆 CityMind: Interactive Live Demo & Technical Walkthrough

> **Concept**: A Git-Inspired AI Memory Operating System for Smart Cities.  
> **Core Premise**: Smart cities don't need more unindexed telemetry—they need **version control for physical infrastructure**. CityMind captures state changes as immutable, cryptographically verifiable **SHA-256 City Commits**, backed by a live multi-tier memory architecture (CockroachDB distributed vector indexing, Google Gemini embeddings, and live AWS cloud infrastructure).

---

## 🎬 Live Demo Flow & Interactive Script

This guide walks through a live, end-to-end demonstration of CityMind in action.

```
  [1. Live Hot Stream]        [2. Anomaly & Commit]        [3. Multi-Agent Mesh]       [4. Cloud & Archival]
   IoT Telemetry Buffer  ──►  SHA-256 State Diff &   ──►   Autonomous Consensus   ──►  Live AWS SNS Alert,
   & Real-Time WebSocket      CockroachDB Vector Index     & Gemini Reasoning          DynamoDB & S3 Sync
```

---

### ⏱️ Act 1: The Genesis State & Real-Time Telemetry Stream (00:00 - 01:30)

#### 🎯 Demo Goal
Show live baseline tracking across city zones, where high-frequency IoT readings stream through the in-memory hot buffer and WebSockets.

#### 🛠️ What to Show & Run:
1. **Launch Dashboard**: Open the CityMind Web UI (`http://localhost:5173`).
2. **Observe Real-Time Telemetry**:
   - Streams from **Downtown, North District, West River Corridor, Industrial South, and East Suburbs**.
   - Metrics: Traffic Velocity (km/h), Air Quality Index (AQI), River Water Levels (m), and Grid Power Load (MW).
3. **Genesis State Lineage**:
   - Every zone initializes with an immutable **Genesis Commit** (`parent_hash: None`, `diffs: [system: initialized]`).
   - Query Genesis baseline via API:
     ```bash
     curl -s http://localhost:8000/api/commits/zone/zone-downtown | jq '.[-1]'
     ```

---

### ⏱️ Act 2: Anomaly Spike & SHA-256 "City Commit" Generation (01:30 - 03:00)

#### 🎯 Demo Goal
Demonstrate how raw telemetry threshold crossings trigger an atomic **State Diff** and mine a cryptographically linked **City Commit**.

#### 🛠️ What to Show & Run:
1. **Inject Flash Flood / Water Level Anomaly** in `zone-west`:
   - Simulate sensor readings surging from `1.1m` to `2.85m` (breaching the 2.5m critical threshold).
2. **Watch the Commit Engine Mine a SHA-256 Commit**:
   ```json
   {
     "commit_hash": "7ebbb335629dbc41...",
     "parent_hash": "c0ckr0ach12345678...",
     "zone_id": "zone-west",
     "domain": "environment",
     "trigger": "threshold_crossing",
     "state_diffs": [
       { "metric": "water_level_m", "previous_value": 1.10, "current_value": 2.85, "delta": +1.75 }
     ],
     "ai_summary": "Water level in Zone West surged to 2.85m exceeding critical safety threshold.",
     "confidence": 0.98
   }
   ```
3. **Inspect the State Diff Visualizer**:
   - Click on the commit in the dashboard to view the **Green/Red Git Diff view** of urban metrics.

---

### ⏱️ Act 3: CockroachDB Distributed Vector Memory & Gemini Semantic RAG (03:00 - 04:30)

#### 🎯 Demo Goal
Show how the AI instantly recalls historical precedents using 384-dimensional vector embeddings and CockroachDB distributed vector indexing.

#### 🛠️ What to Show & Run:
1. **Gemini 384-Dimensional Embedding Generation**:
   - The commit's AI summary is transformed into vector space (`VECTOR(384)`).
2. **Semantic Similarity Search**:
   - Ask the AI Copilot: *"Have we encountered a rapid water surge in Zone West before?"*
   - Query CockroachDB Vector Index using Cosine Distance (`<=>` operator):
     ```sql
     SELECT commit_hash, zone_id, domain, ai_summary,
            (1.0 - (vector_embedding <=> $1::vector)) AS similarity
     FROM city_commit_vectors
     ORDER BY vector_embedding <=> $1::vector ASC
     LIMIT 3;
     ```
3. **RAG-Powered Incident Recall**:
   - The AI identifies a previous storm from October 2024 with a **94.2% semantic similarity match**, retrieving the exact mitigation strategy applied back then.

---

### ⏱️ Act 4: Multi-Agent Mesh & Autonomous Consensus (04:30 - 06:00)

#### 🎯 Demo Goal
Witness specialized domain agents collaborate, debate trade-offs, and reach consensus on cross-sector emergency actions without human bottlenecks.

#### 🛠️ What to Show & Run:
1. **Agent Council Assembly**:
   - **Environmental Agent**: *"Water surge requires opening Floodgate #4 immediately."*
   - **Traffic Agent**: *"Opening Floodgate #4 will inundate Lower Expressway. Rerouting traffic to High Arterial 7."*
   - **Power Grid Agent**: *"Substation 12 is in the runoff zone. Shifting power load to West Substation B."*
   - **Emergency Commander Agent**: *"Consensus reached. Dispatching evacuation and traffic rerouting directives."*
2. **Consensus Vote**:
   - Display the multi-agent decision score (`Agreement: 96%`, `Risk Mitigation Index: 0.92`).

---

### ⏱️ Act 5: Live AWS Cloud Operations & Emergency Alert Dispatch (06:00 - 07:30)

#### 🎯 Demo Goal
Prove that CityMind is not just a mock—it connects to live AWS cloud infrastructure in real-time.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LIVE AWS CLOUD BACKING                          │
├─────────────────────────┬────────────────────────┬─────────────────────┤
│     Amazon SNS          │    Amazon DynamoDB     │      Amazon S3      │
│  (Critical Alerter)     │  (Commit State Store)  │  (Event Memory S3)  │
│  MessageId Returned:    │  Partition Key: Hash   │  Payload JSON Sync  │
│  c8c1ed75-e06b-55db...  │  Sort Key: Timestamp   │  Instant Retrieval  │
└─────────────────────────┴────────────────────────┴─────────────────────┘
```

#### 🛠️ What to Show & Run:
1. **Amazon SNS Real-Time Alert Dispatch**:
   - Trigger the critical alert and verify live publication:
     ```python
     # Live AWS SNS alert dispatched with message ID verification
     resp = sns_alert_service.publish_critical_alert(
         zone_id="zone-west",
         domain="environment",
         severity="critical",
         summary="Flash flood emergency in Zone West - Floodgate #4 opening"
     )
     # Output: {'status': 'published_aws_sns', 'message_id': 'c8c1ed75-...'}
     ```
2. **Amazon DynamoDB Commit Archiving**:
   - Show commit synced to table `citymind-commits` with composite key `(commit_hash, timestamp)`.
3. **Amazon S3 Raw Event Memory Snapshot**:
   - View commit JSON payload saved to S3 bucket `citymind-event-memory-archive/commits/zone-west/environment/...`.

---

### ⏱️ Act 6: Digital Twin "What-If" Simulation & Time-Travel (07:30 - 09:00)

#### 🎯 Demo Goal
Show operators executing a "Git Checkout" to branch the city state and simulate hypothetical future scenarios.

#### 🛠️ What to Show & Run:
1. **Create Simulation Branch**:
   - Fork state from commit `7ebbb335` to create branch `sim/floodgate-delay-30m`.
2. **Run What-If Scenario**:
   - Scenario: *"What happens if floodgate opening is delayed by 30 minutes?"*
   - Digital Twin predicts:
     - Traffic congestion increases by **+340%**.
     - Substation flooding probability reaches **87%**.
3. **Compare State Diffs**:
   - Display side-by-side comparative diff of Action Taken vs. Delayed Scenario.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Role in CityMind |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, Vite, TailwindCSS, Recharts, Lucide | Mission Control Dashboard, Diff Explorer, Timeline Visualizer |
| **Backend API** | Python 3.12, FastAPI, Uvicorn, WebSockets | Async REST endpoints, hot telemetry streaming, commit engine |
| **Distributed Vector Store** | CockroachDB (`VECTOR(384)`, Vector Index) | Co-located relational state and distributed semantic vector memory |
| **AI & Embeddings** | Google Gemini Flash & Sentence-Transformers | Autonomous agent reasoning, RAG synthesis, 384-dim embeddings |
| **Cloud Event Store** | Amazon DynamoDB (Forever Free Tier: 25 GB) | Immutable commit snapshot store with fast key-value lookups |
| **Emergency Dispatch** | Amazon SNS (Forever Free Tier: 1M pushes/mo) | Multi-channel instant alerting to municipal operators & teams |
| **Cold Memory Archive** | Amazon S3 (`citymind-event-memory-archive`) | Long-term JSON event diff payload archiving |
| **Package Tooling** | `uv` (Python) & `pnpm` (Node.js) | High-speed, lightweight dependency management |

---

## ⚡ Quick Run & Test Commands

```bash
# 1. Run Complete Backend Test Suite (32 tests across all engines)
uv run pytest

# 2. Test Live AWS Cloud Integration (STS, SNS, DynamoDB, S3)
uv run python -c "
from city_mind.services.sns_alerter import sns_alert_service
from city_mind.services.dynamodb_archive import dynamodb_archive_service
print(sns_alert_service.get_status())
print(dynamodb_archive_service.get_status())
"

# 3. Start Backend Server
uv run uvicorn city_mind.main:app --reload --port 8000

# 4. Start Frontend Dev Server
pnpm run dev
```
