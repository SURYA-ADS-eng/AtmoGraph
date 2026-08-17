// Find all retailers affected by a disruption
MATCH (d:Disruption {id:'E1'})-[:AFFECTS]->(p:Port)
MATCH path=(p)-[*]->(r:Retailer)
RETURN r.name, path;

// Trace supply chain path from supplier to retailer
MATCH path=(s:Supplier {id:'S1'})-[:SUPPLIES*..5]->(r:Retailer)
RETURN path;

// List all disruptions and their affected nodes
MATCH (d:Disruption)-[:AFFECTS]->(n)
RETURN d.type, d.location, n.name;
