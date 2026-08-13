// ========================================
// AtmoGraph - Supply Chain Relationships
// ========================================


// SUPPLIER → MANUFACTURER

MATCH (s:Supplier {id: "S001"}),
      (m:Manufacturer {id: "M001"})
CREATE (s)-[:SUPPLIES]->(m);

MATCH (s:Supplier {id: "S002"}),
      (m:Manufacturer {id: "M002"})
CREATE (s)-[:SUPPLIES]->(m);

MATCH (s:Supplier {id: "S003"}),
      (m:Manufacturer {id: "M003"})
CREATE (s)-[:SUPPLIES]->(m);


// MANUFACTURER → FACTORY

MATCH (m:Manufacturer {id: "M001"}),
      (f:Factory {id: "F001"})
CREATE (m)-[:OPERATES]->(f);

MATCH (m:Manufacturer {id: "M002"}),
      (f:Factory {id: "F002"})
CREATE (m)-[:OPERATES]->(f);

MATCH (m:Manufacturer {id: "M003"}),
      (f:Factory {id: "F003"})
CREATE (m)-[:OPERATES]->(f);


// FACTORY → SHIPPING ROUTE

MATCH (f:Factory {id: "F001"}),
      (r:ShippingRoute {id: "R001"})
CREATE (f)-[:SHIPS_THROUGH]->(r);

MATCH (f:Factory {id: "F002"}),
      (r:ShippingRoute {id: "R002"})
CREATE (f)-[:SHIPS_THROUGH]->(r);


// SHIPPING ROUTE → PORT

MATCH (r:ShippingRoute {id: "R001"}),
      (p:Port {id: "P003"})
CREATE (r)-[:CONNECTS_TO]->(p);

MATCH (r:ShippingRoute {id: "R002"}),
      (p:Port {id: "P003"})
CREATE (r)-[:CONNECTS_TO]->(p);

MATCH (r:ShippingRoute {id: "R003"}),
      (p:Port {id: "P004"})
CREATE (r)-[:CONNECTS_TO]->(p);


// PORT → DISTRIBUTOR

MATCH (p:Port {id: "P003"}),
      (d:Distributor {id: "D001"})
CREATE (p)-[:DISTRIBUTES_TO]->(d);

MATCH (p:Port {id: "P004"}),
      (d:Distributor {id: "D002"})
CREATE (p)-[:DISTRIBUTES_TO]->(d);


// DISTRIBUTOR → RETAILER

MATCH (d:Distributor {id: "D001"}),
      (r:Retailer {id: "RT001"})
CREATE (d)-[:SELLS_TO]->(r);

MATCH (d:Distributor {id: "D002"}),
      (r:Retailer {id: "RT002"})
CREATE (d)-[:SELLS_TO]->(r);


// MANUFACTURER → PRODUCT

MATCH (m:Manufacturer {id: "M001"}),
      (p:Product {id: "PR001"})
CREATE (m)-[:MANUFACTURES]->(p);

MATCH (m:Manufacturer {id: "M002"}),
      (p:Product {id: "PR001"})
CREATE (m)-[:MANUFACTURES]->(p);

MATCH (m:Manufacturer {id: "M003"}),
      (p:Product {id: "PR002"})
CREATE (m)-[:MANUFACTURES]->(p);


// ENTITY → COUNTRY

MATCH (s:Supplier {id: "S001"}),
      (c:Country {id: "C001"})
CREATE (s)-[:LOCATED_IN]->(c);

MATCH (s:Supplier {id: "S002"}),
      (c:Country {id: "C002"})
CREATE (s)-[:LOCATED_IN]->(c);

MATCH (m:Manufacturer {id: "M001"}),
      (c:Country {id: "C001"})
CREATE (m)-[:LOCATED_IN]->(c);

MATCH (m:Manufacturer {id: "M002"}),
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
