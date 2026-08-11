# AtmoGraph

AtmoGraph is an AI-powered supply-chain intelligence platform that uses NLP, Neo4j, and Graph Neural Networks to predict multi-hop ripple effects from global disruptions and visualize supply-chain risks in real time.

AtmoGraph — Supply Chain Ripple Effect Predictor

An AI-powered supply chain intelligence platform that models global supply-chain dependencies as a graph and predicts how localized disruptions can propagate across multiple supply-chain layers.

📌 Project Overview

AtmoGraph is a predictive supply-chain analytics system designed to identify and forecast the ripple effects of global supply-chain disruptions.

Traditional supply-chain prediction systems often rely on isolated time-series data and may fail to capture complex relationships between suppliers, manufacturers, shipping routes, ports, and markets.

AtmoGraph addresses this problem by combining:

Graph Database to represent global supply-chain relationships
NLP to extract disruption information from unstructured news
Graph Neural Networks (GNNs) to predict multi-hop disruption effects
Interactive Graph Visualization to help users understand affected supply-chain nodes
Real-time integration for continuously updating predictions
🎯 Example Use Case

Suppose a major port in Europe experiences a sudden strike.

AtmoGraph can:

Detect the event from a news article.
Extract entities such as the port, companies, suppliers, and affected regions.
Map the event to the global supply-chain graph.
Identify connected suppliers and manufacturers.
Predict downstream effects.
Highlight high-risk nodes on the dashboard.
Help logistics managers proactively reroute shipments.
🚨 Problem Statement

Traditional supply-chain predictive models often rely on linear and isolated time-series data. They struggle to understand complex global networks and cannot effectively predict how a localized crisis in one industry or location can affect interconnected supply chains worldwide.

💡 Proposed Solution

AtmoGraph represents the supply chain as an interconnected graph structure.

Each entity such as a:

Supplier
Manufacturer
Distributor
Port
Shipping route
Product
Market

is represented as a graph node, while relationships between them are represented as edges.

When a disruption is detected, the system uses NLP and Graph Neural Networks to estimate how the disruption propagates through connected nodes.

🏗️ System Architecture
                    ┌─────────────────────┐
                    │   Live News Feeds   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    NLP Pipeline     │
                    │ spaCy / HuggingFace │
                    └──────────┬──────────┘
                               │
                     Entity Extraction
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Neo4j Graph DB    │
                    │ Supply Chain Graph  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Graph Neural Network│
                    │   PyTorch Geometric │
                    └──────────┬──────────┘
                               │
                       Risk Prediction
                               │
                               ▼
              ┌─────────────────────────────┐
              │       FastAPI Backend       │
              │     WebSocket / REST API    │
              └──────────────┬──────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │       React Dashboard       │
              │       React Flow / D3.js    │
              └─────────────────────────────┘
🔑 Key Modules
1. Graph Database

Technology: Neo4j

Stores the interconnected global supply-chain network.

Example:

Supplier
   │
   ▼
Manufacturer
   │
   ▼
Shipping Route
   │
   ▼
Port
   │
   ▼
Distributor
   │
   ▼
Consumer Market

Neo4j allows the system to efficiently query relationships and identify connected supply-chain nodes.

2. NLP Ingestion Engine

Technologies:

Python
spaCy
HuggingFace Transformers

The NLP engine processes news and other unstructured text.

Example:

Input:
"Port X in Europe has been closed following a major strike."

             ↓

NLP Processing

             ↓

Entities:
Port X → Location
Europe → Region
Strike → Disruption
Closed → Status

The extracted information is then mapped to the Neo4j graph.

3. Graph Neural Network

Technology: PyTorch Geometric

The GNN acts as the core predictive engine.

It analyzes:

Node relationships
Supply-chain dependencies
Disruption locations
Upstream dependencies
Downstream dependencies
Multi-hop relationships

The model predicts which connected nodes are likely to experience increased risk.

4. Interactive Network UI

Technologies:

React
D3.js
React Flow

The dashboard provides an interactive visualization of the supply-chain network.

Users can:

Zoom
Pan
Select nodes
View supplier relationships
Identify affected companies
Explore disruption paths
View risk levels
5. Predictive Overlay

The dashboard visually highlights predicted high-risk nodes.

Example:

        Supplier A
             │
             ▼
       Manufacturer B
             │
        ⚠ HIGH RISK
             │
             ▼
          Port C
             │
             ▼
       Distributor D
             │
        ⚠ MEDIUM RISK
             │
             ▼
         Market E
🛠️ Technology Stack
Component	Technology
Programming Language	Python
Graph Database	Neo4j
NLP	spaCy, HuggingFace
Machine Learning	PyTorch
GNN	PyTorch Geometric
Backend	FastAPI
Frontend	React
Visualization	D3.js / React Flow
API Communication	REST / WebSocket
Database Query	Cypher
Version Control	Git & GitHub
📁 Suggested Project Structure
AtmoGraph/
│
├── backend/
│   ├── main.py
│   ├── api/
│   │   ├── routes.py
│   │   └── websocket.py
│   │
│   ├── nlp/
│   │   ├── entity_extractor.py
│   │   └── news_processor.py
│   │
│   ├── graph/
│   │   ├── neo4j_client.py
│   │   └── queries.py
│   │
│   └── gnn/
│       ├── model.py
│       ├── train.py
│       └── predict.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── data/
│   ├── sample_news/
│   └── sample_supply_chain/
│
├── models/
│   └── trained_model.pt
│
├── requirements.txt
├── README.md
└── .gitignore
⚙️ Installation
Clone Repository
git clone https://github.com/<your-username>/AtmoGraph.git
cd AtmoGraph
Backend Setup
cd backend

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run the backend:

uvicorn main:app --reload
Frontend Setup
cd frontend
npm install
npm run dev

The dashboard will then be available through the local development URL shown by Vite.

🔄 Workflow
News/Event
    ↓
NLP Processing
    ↓
Entity & Disruption Extraction
    ↓
Neo4j Graph Update
    ↓
Graph Neural Network
    ↓
Ripple Effect Prediction
    ↓
Risk Score Generation
    ↓
FastAPI
    ↓
React Dashboard
    ↓
Supply Chain Decision Support
📊 Example Prediction

A disruption at a major shipping port could produce a prediction such as:

Disruption:
European Port Strike

Predicted Impact:

Port A             → Critical
Manufacturer B     → High Risk
Supplier C         → High Risk
Distributor D      → Medium Risk
Market E           → Low Risk

The dashboard displays these risk levels directly on the supply-chain graph.

📅 Development Plan
Week 1 — Graph Foundations

Backend

Set up Neo4j
Design supply-chain graph schema
Create nodes and relationships
Develop Cypher ingestion scripts

Frontend

Set up React dashboard
Configure React Flow
Render initial static graph
Week 2 — NLP Pipeline

Backend

Build NLP ingestion engine
Implement Named Entity Recognition
Extract disruption information
Update Neo4j dynamically

Frontend

Connect UI to graph data
Add zoom and pan
Add node-click functionality
Mid-Project Review
Validate NLP entity extraction
Verify Neo4j data insertion
Test large graph visualization
Ensure frontend performance
Week 3 — GNN Engineering

Backend

Develop Graph Neural Network
Train model using supply-chain graph data
Perform node-risk prediction

Frontend

Add predictive overlays
Highlight high-risk nodes
Display predicted disruption levels
Week 4 — Real-Time Integration

Backend

Integrate FastAPI/WebSocket
Push real-time predictions
Connect NLP → Graph → GNN pipeline

Frontend

Add timeline controls
Display 30/60/90-day predictions
Refine dashboard UI
🎯 Project Objectives
Build a global supply-chain graph using Neo4j.
Automatically extract disruption information from unstructured news.
Map extracted entities to supply-chain relationships.
Use GNNs to predict multi-hop ripple effects.
Provide real-time visualization of supply-chain risks.
Help logistics managers make proactive decisions.
Reduce the impact of unexpected supply-chain disruptions.
🚀 Future Enhancements
Integration with real-time shipping APIs
Weather and natural-disaster data integration
Stock-market and commodity-price signals
Multi-language news analysis
Advanced GNN architectures
Automated shipment rerouting recommendations
AI-generated disruption summaries
30/60/90-day impact forecasting
Cloud deployment and enterprise scalability
📌 Expected Outcome

AtmoGraph will provide an enterprise-grade interactive supply-chain intelligence dashboard capable of ingesting unstructured disruption information, mapping it onto a global supply-chain graph, and predicting how disruptions may propagate across multiple supply-chain levels.
