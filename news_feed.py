"""
AtmoGraph - Real-Time News Stream Simulator & Preset Scenarios
Contains high-impact real-world scenario feeds and live news generator.
"""
from typing import List, Dict, Any
PRESET_SCENARIOS = [
    {
        "id": "scenario_rotterdam_strike",
        "title": "Rotterdam Dockers Indefinite Strike (Europe-NA Artery)",
        "headline": "Dock workers strike halts Port of Rotterdam container operations indefinitely over automated crane dispute",
        "full_text": "Live breaking report from the Netherlands: Port of Rotterdam dock workers have launched an indefinite union strike halting all crane and terminal container operations. Over 80 container vessels are currently anchored offshore. Logistics experts warn that critical semiconductor equipment from ASML Veldhoven and automotive components from Bosch Stuttgart destined for North America and Germany will experience catastrophic backlogs exceeding 3 months.",
        "target_node_id": "PORT_ROTTERDAM",
        "category": "PORT_STRIKE",
        "severity": 0.88,
        "region": "Europe"
    },
    {
        "id": "scenario_taiwan_strait",
        "title": "Taiwan Strait Geopolitical Tension & Shipping Warning",
        "headline": "Naval exercises and airspace closure impose temporary maritime blockade across Taiwan Strait",
        "full_text": "Tensions escalate in the Asia-Pacific region as unannounced naval drills force commercial container shipping to reroute away from Kaohsiung and Hsinchu shipping lanes. TSMC Fab 18 wafer shipments to global fabless designers and finished smartphone assemblers Foxconn Zhengzhou face severe bottlenecking.",
        "target_node_id": "T1_TSMC_FAB18",
        "category": "BLOCKADE_OR_CONFLICT",
        "severity": 0.92,
        "region": "Asia-Pacific"
    },
    {
        "id": "scenario_suez_canal",
        "title": "Suez Canal Ultra-Large Container Ship Grounding",
        "headline": "Mega-vessel aground blocks Suez Canal transit point, halting Asia-Europe maritime lane",
        "full_text": "Suez Canal Authority confirms a 24,000 TEU container ship is wedged bank-to-bank near Ismailia, paralyzing 12% of global trade. Tankers and container ships carrying raw materials, lithium batteries, and European auto parts are forced to detour around the Cape of Good Hope, adding 14-21 transit days.",
        "target_node_id": "CANAL_SUEZ",
        "category": "BLOCKADE_OR_CONFLICT",
        "severity": 0.85,
        "region": "Middle East"
    },
