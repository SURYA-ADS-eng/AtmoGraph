"""
AtmoGraph - Neo4j Client & HTTP Connector
Provides direct Cypher execution and syncing capabilities with Neo4j database instances.
Automatically detects whether Neo4j is reachable and falls back gracefully to in-memory GraphEngine.
"""
import logging
import requests
from typing import Dict, Any, List, Optional
logger = logging.getLogger("AtmoGraph.Neo4j")
class Neo4jClient:
    def __init__(self, uri: str = "http://localhost:7474", auth: tuple = ("neo4j", "password")):
        self.uri = uri.rstrip('/')
        self.auth = auth
        self.tx_endpoint = f"{self.uri}/db/neo4j/tx/commit"
        self._is_connected = False
        self.check_connection()
    def check_connection(self) -> bool:
        """Pings the Neo4j HTTP API endpoint."""
        try:
            resp = requests.get(self.uri, auth=self.auth, timeout=1.5)
            self._is_connected = (resp.status_code == 200)
        except Exception:
            self._is_connected = False
        return self._is_connected
    @property
    def is_connected(self) -> bool:
        return self._is_connected
    def execute_cypher(self, statement: str, parameters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Executes a Cypher query against Neo4j HTTP Transaction API."""
        if not self._is_connected:
            return {"connected": False, "message": "Neo4j instance offline. Running in Standalone In-Memory Graph Mode."}
        payload = {
            "statements": [
                {
                    "statement": statement,
                    "parameters": parameters or {}
                }
            ]
