CREATE (s:Supplier {
    id: "S001",
    name: "India Metals",
    country: "India",
    industry: "Raw Materials"
});

CREATE (f:Factory {
    id: "F001",
    name: "India Electronics Factory",
    country: "India",
    industry: "Electronics"
});

MATCH (s:Supplier {id: "S001"}),
      (f:Factory {id: "F001"})
CREATE (s)-[:SUPPLIES]->(f);



MATCH (n)-[r]->(m)
RETURN n, r, m;
