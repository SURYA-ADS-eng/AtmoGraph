// ========================================
// AtmoGraph - Mock Supply Chain Nodes
// ========================================

// COUNTRIES

CREATE
(:Country {
    id: "C001",
    name: "India",
    region: "Asia"
}),
(:Country {
    id: "C002",
    name: "China",
    region: "Asia"
}),
(:Country {
    id: "C003",
    name: "Germany",
    region: "Europe"
}),
(:Country {
    id: "C004",
    name: "Netherlands",
    region: "Europe"
}),
(:Country {
    id: "C005",
    name: "USA",
    region: "North America"
});


// SUPPLIERS

CREATE
(:Supplier {
    id: "S001",
    name: "India Metals",
    country: "India",
    industry: "Raw Materials",
    reliability_score: 0.92
}),
(:Supplier {
    id: "S002",
    name: "China Components",
    country: "China",
    industry: "Electronics",
    reliability_score: 0.88
}),
(:Supplier {
    id: "S003",
    name: "Japan Precision Parts",
    country: "Japan",
    industry: "Electronics",
    reliability_score: 0.95
});


// MANUFACTURERS

CREATE
(:Manufacturer {
    id: "M001",
    name: "India Electronics Manufacturing",
    country: "India",
    industry: "Consumer Electronics"
}),
(:Manufacturer {
    id: "M002",
    name: "China Tech Manufacturing",
    country: "China",
    industry: "Consumer Electronics"
}),
(:Manufacturer {
    id: "M003",
    name: "Germany Auto Systems",
    country: "Germany",
    industry: "Automotive"
});


// FACTORIES

CREATE
(:Factory {
    id: "F001",
    name: "Chennai Electronics Factory",
    country: "India",
    capacity: 10000,
    production_type: "Consumer Electronics"
}),
(:Factory {
    id: "F002",
    name: "Shanghai Electronics Factory",
    country: "China",
    capacity: 15000,
    production_type: "Consumer Electronics"
}),
(:Factory {
    id: "F003",
    name: "Munich Auto Factory",
    country: "Germany",
    capacity: 12000,
    production_type: "Automotive"
});


// PORTS

CREATE
(:Port {
    id: "P001",
    name: "Chennai Port",
    country: "India",
    capacity: 85000,
    congestion_level: 20,
    risk_score: 0.12
}),
(:Port {
    id: "P002",
    name: "Shanghai Port",
    country: "China",
    capacity: 120000,
    congestion_level: 30,
    risk_score: 0.18
}),
(:Port {
    id: "P003",
    name: "Rotterdam Port",
    country: "Netherlands",
    capacity: 150000,
    congestion_level: 25,
    risk_score: 0.15
}),
(:Port {
    id: "P004",
    name: "Los Angeles Port",
    country: "USA",
    capacity: 110000,
    congestion_level: 35,
    risk_score: 0.22
});


// SHIPPING ROUTES

CREATE
(:ShippingRoute {
    id: "R001",
    name: "Chennai-Rotterdam Route",
    distance_km: 8500,
    transit_days: 18,
    capacity: 5000
}),
(:ShippingRoute {
    id: "R002",
    name: "Shanghai-Rotterdam Route",
    distance_km: 10500,
    transit_days: 22,
    capacity: 7000
}),
(:ShippingRoute {
    id: "R003",
    name: "Shanghai-Los Angeles Route",
    distance_km: 10000,
    transit_days: 20,
    capacity: 8000
});


// DISTRIBUTORS

CREATE
(:Distributor {
    id: "D001",
    name: "Europe Electronics Distribution Hub",
    country: "Germany"
}),
(:Distributor {
    id: "D002",
    name: "North America Electronics Hub",
    country: "USA"
});


// RETAILERS

CREATE
(:Retailer {
    id: "RT001",
    name: "Europe Electronics Retail Network",
    country: "Germany"
}),
(:Retailer {
    id: "RT002",
    name: "North America Electronics Retail Network",
    country: "USA"
});


// PRODUCTS

CREATE
(:Product {
    id: "PR001",
    name: "Consumer Electronics",
    category: "Electronics"
}),
(:Product {
    id: "PR002",
    name: "Automotive Components",
    category: "Automotive"
});
