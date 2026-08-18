# backend/api/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from neo4j import GraphDatabase
from utils import nlp_processor   # import your NLP module

# --- Config ---
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

# --- FastAPI App ---
app = FastAPI(title="AtmoGraph API", version="1.0")

# --- Neo4j Driver ---
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# --- Request Models ---
class NewsText(BaseModel):
    text: str

class PredictionRequest(BaseModel):
    disruption_id: str

# --- Routes ---
@app.get("/")
def root():
    return {"message": "AtmoGraph API is running!"}

@app.post("/ingest_news")
def ingest_news(news: NewsText):
    """
    Ingest raw news text, extract entities with NLP,
    and insert disruption + affected nodes into Neo4j.
    """
    entities = nlp_processor.extract_entities(news.text)

    with driver.session() as session:
        # Create disruption node
        session.run(
            """
            CREATE (d:Disruption {id:$id, text:$text, date:date()})
            """,
            id="E" + str(hash(news.text)), text=news.text
        )

        # Link disruption to extracted entities
        for ent in entities:
            session.run(
                """
                MERGE (n:Entity {name:$name, type:$type})
                WITH n
                MATCH (d:Disruption {id:$id})
                CREATE (d)-[:AFFECTS]->(n)
                """,
                name=ent["text"], type=ent["label"], id="E" + str(hash(news.text))
            )

    return {"status": "success", "entities": entities}

@app.post("/predict_ripple")
def predict_ripple(req: PredictionRequest):
    """
    Placeholder for GNN ripple effect prediction.
    Later: connect PyTorch Geometric model here.
    """
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
