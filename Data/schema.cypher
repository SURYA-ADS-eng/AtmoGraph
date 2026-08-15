// ===============================
// AtmoGraph Supply Chain Schema
// ===============================

// --- Node Labels ---
CREATE CONSTRAINT supplier_id IF NOT EXISTS
ON (s:Supplier) ASSERT s.id IS UNIQUE;

CREATE CONSTRAINT manufacturer_id IF NOT EXISTS
ON (m:Manufacturer) ASSERT m.id IS UNIQUE;

CREATE CONSTRAINT port_id IF NOT EXISTS
ON (p:Port) ASSERT p.id IS UNIQUE;

CREATE CONSTRAINT shipper_id IF NOT EXISTS
ON (sc:ShippingCompany) ASSERT sc.id IS UNIQUE;

CREATE CONSTRAINT warehouse_id IF NOT EXISTS
ON (w:Warehouse) ASSERT w.id IS UNIQUE;

CREATE CONSTRAINT retailer_id IF NOT EXISTS
ON (r:Retailer) ASSERT r.id IS UNIQUE;

// --- Sample Relationships ---
// Supplier → Manufacturer
CREATE (:Supplier {id:'S1', name:'SteelWorks Ltd'})-[:SUPPLIES]->(:Manufacturer {id:'M1', name:'AutoParts Inc'});

// Manufacturer → Port
CREATE (:Manufacturer {id:'M2', name:'ChipMakers Taiwan'})-[:EXPORTS_VIA]->(:Port {id:'P1', name:'Hamburg Port'});

// Port → ShippingCompany
CREATE (:Port {id:'P2', name:'Rotterdam Port'})-[:HANDLED_BY]->(:ShippingCompany {id:'SC1', name:'Maersk Logistics'});

// ShippingCompany → Warehouse
CREATE (:ShippingCompany {id:'SC2', name:'DHL Global'})-[:DELIVERS_TO]->(:Warehouse {id:'W1', name:'Chicago Distribution Center'});

// Warehouse → Retailer
CREATE (:Warehouse {id:'W2', name:'NYC Central Warehouse'})-[:SUPPLIES]->(:Retailer {id:'R1', name:'BestBuy USA'});

// --- Example Event Node ---
CREATE (:Disruption {id:'E1', type:'Port Strike', location:'Hamburg', date:'2026-08-15'})
-[:AFFECTS]->(:Port {id:'P1', name:'Hamburg Port'});
