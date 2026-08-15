// Suppliers
CREATE (:Supplier {id:'S1', name:'SteelWorks Ltd', country:'Germany'});
CREATE (:Supplier {id:'S2', name:'ChipMakers Taiwan', country:'Taiwan'});

// Manufacturers
CREATE (:Manufacturer {id:'M1', name:'AutoParts Inc', industry:'Automotive'});
CREATE (:Manufacturer {id:'M2', name:'ElectroGadgets Co', industry:'Electronics'});

// Ports
CREATE (:Port {id:'P1', name:'Hamburg Port', country:'Germany'});
CREATE (:Port {id:'P2', name:'Rotterdam Port', country:'Netherlands'});

// Shipping Companies
CREATE (:ShippingCompany {id:'SC1', name:'Maersk Logistics'});
CREATE (:ShippingCompany {id:'SC2', name:'DHL Global'});

// Warehouses
CREATE (:Warehouse {id:'W1', name:'Chicago Distribution Center'});
CREATE (:Warehouse {id:'W2', name:'NYC Central Warehouse'});

// Retailers
CREATE (:Retailer {id:'R1', name:'BestBuy USA'});
CREATE (:Retailer {id:'R2', name:'Walmart USA'});

// Relationships
MATCH (s:Supplier {id:'S1'}), (m:Manufacturer {id:'M1'})
CREATE (s)-[:SUPPLIES]->(m);

MATCH (m:Manufacturer {id:'M2'}), (p:Port {id:'P1'})
CREATE (m)-[:EXPORTS_VIA]->(p);

MATCH (p:Port {id:'P2'}), (sc:ShippingCompany {id:'SC1'})
CREATE (p)-[:HANDLED_BY]->(sc);

MATCH (sc:ShippingCompany {id:'SC2'}), (w:Warehouse {id:'W1'})
CREATE (sc)-[:DELIVERS_TO]->(w);

MATCH (w:Warehouse {id:'W2'}), (r:Retailer {id:'R1'})
CREATE (w)-[:SUPPLIES]->(r);
