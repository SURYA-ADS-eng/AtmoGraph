// ============================================
// AtmoGraph Supply Chain Node Constraints
// ============================================

// Ensure unique identifiers for core entities
CREATE CONSTRAINT supplier_id_unique IF NOT EXISTS
FOR (s:Supplier)
REQUIRE s.id IS UNIQUE;

CREATE CONSTRAINT product_id_unique IF NOT EXISTS
FOR (p:Product)
REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT facility_id_unique IF NOT EXISTS
FOR (f:Facility)
REQUIRE f.id IS UNIQUE;

CREATE CONSTRAINT disruption_id_unique IF NOT EXISTS
FOR (d:Disruption)
REQUIRE d.id IS UNIQUE;

// Index frequently queried properties
CREATE INDEX supplier_name_index IF NOT EXISTS
FOR (s:Supplier)
ON (s.name);

CREATE INDEX product_name_index IF NOT EXISTS
FOR (p:Product)
ON (p.name);

CREATE INDEX facility_name_index IF NOT EXISTS
FOR (f:Facility)
ON (f.name);

CREATE INDEX disruption_date_index IF NOT EXISTS
FOR (d:Disruption)
ON (d.date);
