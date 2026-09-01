"""
AtmoGraph - NLP Ingestion & Named Entity Recognition (NER) Engine
Extracts entities, disruption triggers, sentiment severity, and maps unstructured news articles
directly to supply chain graph nodes.
"""
import re
from typing import Dict, List, Any, Optional
# Pre-defined entity knowledge base & aliases mapping to graph node IDs
ENTITY_ALIASES = {
    # Ports & Logistics
    "rotterdam": "PORT_ROTTERDAM",
    "port of rotterdam": "PORT_ROTTERDAM",
    "rotterdam port": "PORT_ROTTERDAM",
    "dutch port": "PORT_ROTTERDAM",
    "antwerp": "PORT_ANTWERP",
    "port of antwerp": "PORT_ANTWERP",
    "hamburg": "PORT_HAMBURG",
    "port of hamburg": "PORT_HAMBURG",
    "los angeles": "PORT_LA",
    "port of los angeles": "PORT_LA",
    "port of la": "PORT_LA",
    "long beach": "PORT_LONG_BEACH",
    "shanghai": "PORT_SHANGHAI",
    "port of shanghai": "PORT_SHANGHAI",
    "singapore": "PORT_SINGAPORE",
    "port of singapore": "PORT_SINGAPORE",
    "ningbo": "PORT_NINGBO",
    "suez": "CANAL_SUEZ",
    "suez canal": "CANAL_SUEZ",
    "panama": "CANAL_PANAMA",
    "panama canal": "CANAL_PANAMA",
    "frankfurt": "HUB_FRANKFURT_AIR",
    "memphis": "HUB_MEMPHIS_AIR",
    "incheon": "HUB_INCHEON_AIR",
    # Key Manufacturers & Tech Hubs
    "tsmc": "T1_TSMC_FAB18",
    "taiwan semiconductor": "T1_TSMC_FAB18",
    "hsinchu": "T1_TSMC_FAB18",
    "fab 18": "T1_TSMC_FAB18",
    "asml": "T2_EUVSYSTEMS_ASML",
    "veldhoven": "T2_EUVSYSTEMS_ASML",
    "bosch": "T1_BOSCH_STUTTGART",
    "stuttgart": "T1_BOSCH_STUTTGART",
    "samsung": "T1_SAMSUNG_PYEONGTAEK",
