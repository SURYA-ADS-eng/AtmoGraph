# backend/api/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from neo4j import GraphDatabase

# --- Config ---
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

# --- FastAPI App ---
app = FastAPI(title="AtmoGraph API", version="1.0")

# --- Neo4j Driver ---
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# --- Request Models ---
class NewsEvent(BaseModel):
    id: str
    type: str
    location: str
    date: str

class PredictionRequest(BaseModel):
    disruption_id: str

# --- Routes ---
@app.get("/")
def root():
    return {"message": "AtmoGraph API is running!"}

@app.post("/ingest_news")
def ingest_news(event: NewsEvent):
    """Insert a disruption event into Neo4j"""
    with driver.session() as session:
        session.run(
            """
            CREATE (:Disruption {id:$id, type:$type, location:$location, date:$date})
            """,
            id=event.id, type=event.type, location=event.location, date=event.date
        )
    return {"status": "success", "event": event.dict()}

@app.post("/predict_ripple")
def predict_ripple(req: PredictionRequest):
    """
    Placeholder for GNN ripple effect prediction.
    Later: connect PyTorch Geometric model here.
    """
    # TODO: Load GNN model and run inference
    return {"disruption_id": req.disruption_id, "predicted_delay_months": 3}

@app.get("/graph_data")
def graph_data():
    """Return supply chain graph nodes and relationships"""
    with driver.session() as session:
        result = session.run("MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 50")
        edges = []
        for record in result:
            edges.append({
                "source": record["n"].get("name"),
                "relation": type(record["r"]).__name__,
                "target": record["m"].get("name")
            })
    return {"graph": edges}
