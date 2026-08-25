# 🌐 AtmoGraph

### AI-Powered Supply Chain Ripple-Effect Prediction System

AtmoGraph is an AI-powered supply-chain intelligence platform designed to model complex supply-chain dependencies and predict how a disruption at one point in the network can propagate to connected suppliers, manufacturers, logistics nodes, products, and other downstream entities.

Instead of treating a supply chain as a simple list of companies, AtmoGraph represents it as a **graph** where entities are nodes and their dependencies are relationships. A **Graph Neural Network (GNN)** is then used to analyze these relationships and predict potential ripple effects.

---

## 🎯 Problem Statement

Modern supply chains are highly interconnected.

A disruption such as:

* Supplier delays
* Transportation problems
* Port disruptions
* Demand spikes
* Manufacturing issues
* Logistics failures

can affect multiple connected entities.

Traditional supply-chain monitoring systems may identify an individual disruption but often struggle to understand its **downstream impact**.

### AtmoGraph aims to answer:

> **"If one part of the supply chain is disrupted, which connected entities are likely to be affected next?"**

---

## 💡 Solution

AtmoGraph combines:

**Supply Chain Graph + Neo4j + Graph Neural Network + FastAPI + React**

to create a system that can:

1. Represent supply-chain dependencies as a graph.
2. Store and query relationships using Neo4j.
3. Ingest disruption information.
4. Analyze graph relationships.
5. Apply a Graph Convolutional Network (GCN).
6. Predict potential ripple effects.
7. Visualize supply-chain dependencies through an interactive graph.
8. Present supply-chain metrics through a dashboard.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────────┐
                    │       User / Analyst     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      React Frontend      │
                    │                          │
                    │  • Dashboard             │
                    │  • Graph Visualization   │
                    │  • Supply Chain Metrics  │
                    └────────────┬─────────────┘
                                 │
                           HTTP / REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       FastAPI Backend    │
                    │                          │
                    │  • News Ingestion        │
                    │  • Graph Data API        │
                    │  • Ripple Prediction     │
                    └───────┬───────────┬──────┘
                            │           │
                            │           │
                            ▼           ▼
                ┌────────────────┐  ┌──────────────────┐
                │     Neo4j      │  │   RippleGCN      │
                │                │  │                  │
                │ Supply Chain   │  │ Graph Neural     │
                │ Knowledge Graph│  │ Network           │
                └────────────────┘  └────────┬─────────┘
                                             │
                                             ▼
                                    Ripple Effect
                                      Prediction
```

---

## 🧠 Core Technology

| Layer               | Technology        | Purpose                        |
| ------------------- | ----------------- | ------------------------------ |
| Frontend            | React             | User interface                 |
| Graph Visualization | ReactFlow         | Interactive supply-chain graph |
| Backend             | FastAPI           | REST API layer                 |
| Database            | Neo4j             | Supply-chain graph database    |
| ML Framework        | PyTorch           | Deep learning                  |
| Graph ML            | PyTorch Geometric | Graph Neural Network           |
| Model               | RippleGCN         | Ripple-effect prediction       |
| Data Processing     | Pandas            | Training-data processing       |
| API Server          | Uvicorn           | Runs FastAPI                   |

---

## 📁 Project Structure

```text
AtmoGraph/
│
├── Data/
│   ├── mock/
│   ├── queries.cypher
│   ├── resnet.cypher
│   ├── ripple_training.csv
│   ├── sample_data.cypher
│   └── schema.cypher
│
├── backend/
│   │
│   ├── api/
│   │   ├── main.py
│   │   └── utils/
│   │
│   ├── models/
│   │   └── ripple_gnn.py
│   │
│   └── neo4j/
│       ├── README.md
│       ├── initial_graph.cypher
│       ├── mock_data.cypher
│       ├── node.cypher
│       ├── nodes.cypher
│       ├── relationships.cypher
│       └── schema.cypher
│
├── frontend/
│   └── components/
│       ├── GraphView.jsx
│       ├── SupplyChainDashboard.jsx
│       └── SupplyChainDashboard.css
│
├── README.md
└── requirements.txt
```

---

# 🔗 Supply Chain Graph

AtmoGraph uses a graph-based representation of the supply chain.

### Example

```text
Supplier
   │
   │ SUPPLIES
   ▼
Manufacturer
   │
   │ EXPORTS_VIA
   ▼
Port
   │
   │ HANDLED_BY
   ▼
Shipping Company
   │
   │ DELIVERS_TO
   ▼
Warehouse
   │
   │ SUPPLIES
   ▼
Retailer
```

A disruption at one node can therefore be analyzed in relation to the nodes connected to it.

The Neo4j schema currently defines entities including:

* Country
* Supplier
* Manufacturer
* Factory
* Port
* Shipping Route
* Distributor
* Retailer
* Product

with unique identifiers enforced through Neo4j constraints.

---

# 🗄️ Neo4j Graph Database

Neo4j acts as the graph database layer of AtmoGraph.

The repository contains Cypher scripts for:

* Graph schema creation
* Node creation
* Relationship creation
* Initial graph construction
* Mock data
* Graph queries

The initial graph already demonstrates a supplier-to-factory dependency:

```text
India Metals
      │
      │ SUPPLIES
      ▼
India Electronics Factory
```

---

# 🤖 RippleGCN

The machine-learning component is implemented as a **Graph Convolutional Network (GCN)** using PyTorch Geometric.

The current model contains two graph-convolution layers:

```text
Input Node Features
        │
        ▼
   GCNConv Layer
        │
        ▼
      ReLU
        │
        ▼
   GCNConv Layer
        │
        ▼
   Ripple Prediction
```

### Model inputs

The current training dataset uses:

* `feature_supply_delay`
* `feature_transport_risk`
* `feature_demand_spike`

### Output

The current model uses two classes:

```text
0 → No Ripple Effect
1 → Ripple Effect
```

The current dataset is a small synthetic dataset intended for development and demonstration.

---

# 📊 Training Data

The current training data is stored in:

```text
Data/ripple_training.csv
```

Example structure:

```csv
node_id,feature_supply_delay,feature_transport_risk,feature_demand_spike,label
1,0.2,0.1,0,0
2,0.8,0.4,1,1
3,0.5,0.7,1,1
4,0.1,0.2,1,1
```

These features represent simplified disruption indicators.

Future versions can replace the synthetic dataset with real-world supply-chain disruption data.

---

# ⚙️ Backend API

The FastAPI application is located at:

```text
backend/api/main.py
```

## API Endpoints

### `GET /`

Checks whether the AtmoGraph API is running.

Example response:

```json
{
  "message": "AtmoGraph API is running!"
}
```

---

### `POST /ingest_news`

Accepts disruption/news text and creates a `Disruption` node in Neo4j.

Example request:

```json
{
  "text": "Major shipping delay reported at the port."
}
```

---

### `POST /predict_ripple`

Runs the RippleGCN model for ripple-effect prediction.

Example request:

```json
{
  "disruption_id": "E001"
}
```

Example response:

```json
{
  "disruption_id": "E001",
  "predictions": [0, 1, 1, 0],
  "note": "0 = no ripple, 1 = ripple effect"
}
```

---

### `GET /graph_data`

Retrieves graph relationships from Neo4j for frontend visualization.

The frontend uses this endpoint to construct nodes and edges.

---

# 🖥️ Frontend

AtmoGraph includes a React-based frontend.

## Supply Chain Dashboard

The dashboard displays:

* Total Suppliers
* Products Tracked
* Active Dependencies
* At-Risk Nodes
* Ripple Effect Analysis

The dashboard obtains graph information from:

```text
GET http://localhost:8000/graph_data
```

---

## 🕸️ Interactive Graph

`GraphView.jsx` uses **ReactFlow** to display supply-chain relationships.

The graph provides:

* Nodes
* Relationships
* Labels
* Controls
* MiniMap
* Background grid
* Automatic fitting of the graph view

This allows users to visually understand how supply-chain entities are connected.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/SURYA-ADS-eng/AtmoGraph.git
cd AtmoGraph
git checkout surya
```

---

## 2. Create Python Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

> The ML implementation also imports PyTorch, PyTorch Geometric and Pandas. Install the appropriate versions for your Python/CUDA environment if they are not already available.

---

# 🗃️ Configure Neo4j

Start a local Neo4j instance.

The current backend expects:

```text
URI:      bolt://localhost:7687
Username: neo4j
Password: password
```

These values are currently configured directly in:

```text
backend/api/main.py
```

For production deployment, these credentials should be moved to environment variables.

---

# 🌱 Initialize the Graph

Use the Cypher scripts located inside:

```text
backend/neo4j/
```

The main files include:

```text
schema.cypher
initial_graph.cypher
mock_data.cypher
nodes.cypher
relationships.cypher
```

Run the schema and sample graph data in Neo4j before starting the backend.

---

# ▶️ Run the Backend

From the project root:

```bash
uvicorn backend.api.main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

---

# 🔬 Current Development Status

### Implemented

* [x] AtmoGraph repository structure
* [x] Neo4j graph database integration
* [x] Supply-chain graph schema
* [x] Sample supply-chain graph
* [x] FastAPI backend
* [x] Graph data API
* [x] Disruption ingestion endpoint
* [x] Ripple prediction endpoint
* [x] RippleGCN model
* [x] Synthetic ripple-effect dataset
* [x] React supply-chain dashboard
* [x] ReactFlow graph visualization

### In Development

* [ ] Real-time disruption ingestion
* [ ] Automated news/NLP processing
* [ ] Production-scale training dataset
* [ ] Graph-based edge construction for the GNN
* [ ] Automated model training pipeline
* [ ] Real-time ripple propagation
* [ ] Risk scoring
* [ ] Historical disruption analysis
* [ ] Advanced dashboard analytics
* [ ] Production deployment

---

# 🔮 Future Enhancements

## 1. Real-Time News Intelligence

Integrate news and external event sources to automatically detect:

* Port strikes
* Supplier failures
* Natural disasters
* Transportation delays
* Geopolitical disruptions
* Demand changes

---

## 2. NLP-Based Event Extraction

Convert unstructured news into structured disruption events.

```text
News Article
     │
     ▼
NLP / LLM
     │
     ▼
Disruption Event
     │
     ▼
Affected Entity
     │
     ▼
Neo4j Graph
```

---

## 3. Advanced Ripple Prediction

Extend the current binary prediction:

```text
No Ripple
     │
     ├── Low Risk
     ├── Medium Risk
     ├── High Risk
     └── Critical Risk
```

The model can eventually estimate:

* Probability of disruption propagation
* Number of affected nodes
* Expected severity
* Downstream impact
* Critical dependencies

---

## 4. Explainable AI

Instead of only showing:

```text
Ripple Effect = 1
```

AtmoGraph can explain:

```text
Port disruption
      ↓
Shipping delay
      ↓
Warehouse shortage
      ↓
Manufacturer delay
      ↓
Retail impact
```

This makes the prediction useful for decision-makers.

---

# 🎯 Project Objective

The long-term objective of AtmoGraph is to transform supply-chain monitoring from:

```text
"What happened?"
```

into:

```text
"Why did it happen?"
        +
"Who will be affected?"
        +
"How severe will the impact be?"
        +
"What should we monitor next?"
```

---

# 📌 Why Graph Neural Networks?

Supply chains are naturally represented as graphs.

Traditional machine-learning models primarily focus on individual records and features.

A GNN can incorporate both:

```text
Node Features
     +
Graph Relationships
     ↓
Context-Aware Prediction
```

This makes GNNs suitable for modeling ripple effects across interconnected supply-chain networks.

---

# 🧪 Current Limitations

At the current development stage:

1. The training dataset is synthetic and very small.
2. The example GNN currently creates sequential edges from the CSV rather than constructing the graph directly from Neo4j.
3. News ingestion currently stores the submitted text as a disruption node; automated NLP extraction is not yet implemented.
4. The dashboard's "At-Risk Nodes" metric is currently a placeholder.
5. The prediction endpoint currently performs inference on the loaded training graph rather than dynamically generating a graph from the requested disruption ID.
6. Neo4j credentials are currently hard-coded in the backend and should be moved to environment variables.
7. The frontend/backend integration is under active development.

These limitations are intentional parts of the current prototype/development stage.

---

# 🛡️ Security Considerations

Before production deployment:

* Move Neo4j credentials to environment variables.
* Add API authentication.
* Validate incoming disruption data.
* Add rate limiting.
* Enable HTTPS.
* Restrict database access.
* Add structured logging.
* Add model/version management.
* Protect sensitive supply-chain information.

---

# 📈 Development Roadmap

```text
Phase 1
Repository + Neo4j Graph
        ↓
Phase 2
FastAPI + React Integration
        ↓
Phase 3
Graph Neural Network
        ↓
Phase 4
Real Disruption Data
        ↓
Phase 5
NLP / News Intelligence
        ↓
Phase 6
Real-Time Ripple Prediction
        ↓
Phase 7
Risk Scoring + Explainable AI
        ↓
Phase 8
Production Deployment
```

---

# 👥 Team

**AtmoGraph** is being developed as an AI & Data Science project focused on applying:

* Artificial Intelligence
* Machine Learning
* Graph Neural Networks
* Knowledge Graphs
* Supply Chain Analytics
* Natural Language Processing
* Data Visualization

---

# 📄 License

License information will be added as the project progresses.

---

## 🌐 Repository

**GitHub:**
https://github.com/SURYA-ADS-eng/AtmoGraph

**Branch:** `surya`

---

## ⭐ AtmoGraph

> **Map the network. Predict the ripple. Protect the supply chain.**
