"""
AtmoGraph - Graph Database & Analytics Engine
Maintains the high-performance in-memory supply chain graph (NetworkX),
provides graph traversal algorithms, bottleneck analysis, shortest path rerouting,
and exports/syncs Cypher statements for Neo4j.
"""
import json
import networkx as nx
from typing import Dict, List, Any, Optional, Tuple
try:
    from graph.mock_data_generator import generate_full_supply_chain_graph
except ImportError:
    try:
        from .mock_data_generator import generate_full_supply_chain_graph
    except ImportError:
        from mock_data_generator import generate_full_supply_chain_graph
class GraphEngine:
    def __init__(self):
        self.nx_graph = nx.DiGraph()
        self.node_metadata: Dict[str, Dict[str, Any]] = {}
        self.edge_metadata: Dict[str, Dict[str, Any]] = {}
        self.active_disruptions: Dict[str, Dict[str, Any]] = {}
        self._initialize_graph()
    def _initialize_graph(self):
        """Initializes the graph from the global supply chain generator."""
        raw_data = generate_full_supply_chain_graph()
        
        for n in raw_data["nodes"]:
            self.node_metadata[n["id"]] = n.copy()
            self.nx_graph.add_node(
                n["id"],
                label=n["label"],
                tier=n["tier"],
                tier_name=n["tier_name"],
                industry=n.get("industry", "General"),
                region=n.get("region", "Global"),
                country=n.get("country", "Global"),
