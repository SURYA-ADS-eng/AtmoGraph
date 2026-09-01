// ==============================================================================
// AtmoGraph: Supply Chain Ripple Effect Predictor
// Neo4j Database Schema, Constraints, Ingestion, and Multi-Hop Cypher Queries
// ==============================================================================
// 1. CONSTRAINTS & INDEXES
CREATE CONSTRAINT unique_supply_node_id IF NOT EXISTS
FOR (n:SupplyNode) REQUIRE n.id IS UNIQUE;
CREATE INDEX node_region_idx IF NOT EXISTS
FOR (n:SupplyNode) ON (n.region);
CREATE INDEX node_industry_idx IF NOT EXISTS
FOR (n:SupplyNode) ON (n.industry);
CREATE INDEX node_risk_score_idx IF NOT EXISTS
FOR (n:SupplyNode) ON (n.risk_score);
// 2. CORE NODES CREATION (SAMPLE SEED DATA)
// Raw Materials (Tier 0)
MERGE (r1:SupplyNode:RawMaterials {id: 'RAW_SILICON_SICHUAN'})
ON CREATE SET r1.label = 'Sichuan High-Purity Polysilicon', r1.tier = 0, r1.industry = 'Raw Materials', r1.region = 'Asia-Pacific', r1.inventory_buffer_days = 60, r1.base_risk = 0.05, r1.risk_score = 0.05;
MERGE (r2:SupplyNode:RawMaterials {id: 'RAW_LITHIUM_ATACAMA'})
ON CREATE SET r2.label = 'Atacama Lithium Brine Extraction', r2.tier = 0, r2.industry = 'Raw Materials', r2.region = 'Latin America', r2.inventory_buffer_days = 90, r2.base_risk = 0.04, r2.risk_score = 0.04;
// Tier-2 Suppliers (Tier 1)
MERGE (t2_1:SupplyNode:Tier2Components {id: 'T2_EUVSYSTEMS_ASML'})
ON CREATE SET t2_1.label = 'ASML Veldhoven EUV Optics Integration', t2_1.tier = 1, t2_1.industry = 'Semiconductor Equipment', t2_1.region = 'Europe', t2_1.inventory_buffer_days = 40, t2_1.base_risk = 0.03, t2_1.risk_score = 0.03;
MERGE (t2_2:SupplyNode:Tier2Components {id: 'T2_MICROCONTROLLERS_INFINEON'})
ON CREATE SET t2_2.label = 'Infineon Dresden Power Semiconductor Fab', t2_2.tier = 1, t2_2.industry = 'Automotive Electronics', t2_2.region = 'Europe', t2_2.inventory_buffer_days = 30, t2_2.base_risk = 0.04, t2_2.risk_score = 0.04;
// Tier-1 Manufacturers (Tier 2)
MERGE (t1_1:SupplyNode:Tier1Manufacturers {id: 'T1_TSMC_FAB18'})
ON CREATE SET t1_1.label = 'TSMC Fab 18 Advanced N3/N5 Node', t1_1.tier = 2, t1_1.industry = 'Semiconductor', t1_1.region = 'Asia-Pacific', t1_1.inventory_buffer_days = 25, t1_1.base_risk = 0.05, t1_1.risk_score = 0.05;
MERGE (t1_2:SupplyNode:Tier1Manufacturers {id: 'T1_BOSCH_STUTTGART'})
ON CREATE SET t1_2.label = 'Bosch Stuttgart ECU & Sensor Systems', t1_2.tier = 2, t1_2.industry = 'Automotive', t1_2.region = 'Europe', t1_2.inventory_buffer_days = 20, t1_2.base_risk = 0.04, t1_2.risk_score = 0.04;
// Logistics & Seaports (Tier 4)
MERGE (p1:SupplyNode:LogisticsPorts {id: 'PORT_ROTTERDAM'})
