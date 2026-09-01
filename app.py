"""
AtmoGraph - Core Backend API Server (Flask + REST + SSE Stream)
Provides real-time API endpoints for Supply Chain Graph, NLP Ingestion,
GNN Ripple Effect Simulations, Proactive Rerouting, and Neo4j Cypher Export.
"""
import os
import sys
import json
import time
import queue
import logging
from flask import Flask, request, jsonify, Response
# Add backend directory to sys.path if not present
sys.path.insert(0, os.path.dirname(__file__))
try:
    from graph.graph_engine import GraphEngine
    from graph.neo4j_client import Neo4jClient
    from nlp.nlp_engine import NLPIngestionEngine
    from nlp.news_feed import get_preset_scenarios
    from ml.gnn_pipeline import GNNPipeline
except ImportError:
    from .graph.graph_engine import GraphEngine
    from .graph.neo4j_client import Neo4jClient
    from .nlp.nlp_engine import NLPIngestionEngine
    from .nlp.news_feed import get_preset_scenarios
    from .ml.gnn_pipeline import GNNPipeline
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("AtmoGraph.Server")
app = Flask(__name__)
# Native CORS handling for modern browsers & Vite dev server
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response
@app.route("/api/<path:dummy>", methods=["OPTIONS"])
def handle_options(dummy):
    return Response(status=204)
