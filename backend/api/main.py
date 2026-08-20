# backend/api/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from neo4j import GraphDatabase
import torch
import torch.nn.functional as F
from models.ripple_gnn import RippleGCN, load_ripple_dataset

# --- Config ---
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

MODEL_PATH = "backend/models/model.pth"
TRAINING_DATA = "data/ripple_training.csv"

# --- FastAPI App ---
app = FastAPI(title="AtmoGraph API", version="1.0")

# --- Neo4j Driver ---
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# --- Request Models ---
class NewsText(BaseModel):
    text: str

class PredictionRequest(BaseModel):
    disruption_id: str

# --- Load Dataset & Model ---
data = load_ripple_dataset(TRAINING_DATA)
num_features = data.num_node_features
num_classes = len(set(data.y.tolist()))

model = RippleGCN(num_node_features=num_features,
                  hidden_channels=16,
                  num_classes=num_classes)

# Load trained weights if available
try:
    model.load_state_dict(torch.load(MODEL_PATH))
    model.eval()
    print("RippleGCN model loaded successfully.")
except FileNotFoundError:
    print("No trained model found. Please train and save model.pth.")

# --- Routes ---
@app.get("/")
def root():
    return {"message": "AtmoGraph API is running!"}

@app.post("/ingest_news")
def ingest_news(news: NewsText):
    # Placeholder: NLP ingestion handled separately
    with driver.session() as session:
        session.run(
            """
            CREATE (:Disruption {id:$id, text:$text, date:date()})
            """,
            id="E" + str(hash(news.text)), text=news.text
        )
    return {"status": "success", "event": news.text}

@app.post("/predict_ripple")
def predict_ripple(req: PredictionRequest):
    """
    Run GNN inference for ripple effect prediction.
    """
    with torch.no_grad():
        out = model(data.x, data.edge_index)
        prediction = out.argmax(dim=1).tolist()

    return {
        "disruption_id": req.disruption_id,
        "predictions": prediction,
        "note": "0 = no ripple, 1 = ripple effect"
    }

@app.get("/graph_data")
def graph_data():
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
