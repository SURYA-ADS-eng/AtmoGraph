// ============================================
// AtmoGraph Ripple Effect Traversal Queries
// ============================================

// Find direct dependencies of a disrupted supplier
MATCH (s:Supplier {id: $supplier_id})
      -[r:SUPPLIES]->(p:Product)
RETURN s, r, p;


// Find first-level downstream impact
MATCH path =
      (s:Supplier {id: $supplier_id})
      -[:SUPPLIES|PRODUCES*1..2]->
      (target)
RETURN path
LIMIT 50;


// Find multi-level ripple effects through the
// supply-chain dependency graph
MATCH path =
      (d:Disruption {id: $disruption_id})
      -[*1..4]->
      (affected)
RETURN path,
       length(path) AS impact_depth
ORDER BY impact_depth;


// Identify affected products from a disrupted supplier
MATCH (s:Supplier {id: $supplier_id})
      -[:SUPPLIES]->(p:Product)
RETURN
    s.name AS supplier,
    collect(p.name) AS affected_products;


// Calculate the number of downstream entities
MATCH (s:Supplier {id: $supplier_id})
      -[*1..4]->
      (affected)
RETURN
    s.name AS source_supplier,
    count(DISTINCT affected) AS affected_entities;MATCH (m:Manufacturer {id: "M002"}),
      (c:Country {id: "C002"})
CREATE (m)-[:LOCATED_IN]->(c);

MATCH (m:Manufacturer {id: "M003"}),
      (c:Country {id: "C003"})
CREATE (m)-[:LOCATED_IN]->(c);

MATCH (p:Port {id: "P001"}),
      (c:Country {id: "C001"})
CREATE (p)-[:LOCATED_IN]->(c);

MATCH (p:Port {id: "P002"}),
      (c:Country {id: "C002"})
CREATE (p)-[:LOCATED_IN]->(c);

MATCH (p:Port {id: "P003"}),
      (c:Country {id: "C004"})
CREATE (p)-[:LOCATED_IN]->(c);

MATCH (p:Port {id: "P004"}),
      (c:Country {id: "C005"})
CREATE (p)-[:LOCATED_IN]->(c);
