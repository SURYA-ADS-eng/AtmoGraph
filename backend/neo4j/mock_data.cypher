// Countries

CREATE
(:Country {id: "C001", name: "India"}),
(:Country {id: "C002", name: "China"}),
(:Country {id: "C003", name: "Germany"}),
(:Country {id: "C004", name: "USA"});


// Suppliers

CREATE
(:Supplier {
    id: "S001",
    name: "India Metals",
    industry: "Raw Materials"
}),
(:Supplier {
    id: "S002",
    name: "China Components",
    industry: "Electronics"
});


// Manufacturers

CREATE
(:Manufacturer {
    id: "M001",
    name: "India Electronics",
    industry: "Electronics"
}),
(:Manufacturer {
    id: "M002",
    name: "China Tech Manufacturing",
    industry: "Electronics"
});


// Factories

CREATE
(:Factory {
    id: "F001",
    name: "Chennai Electronics Factory",
    capacity: 10000
}),
(:Factory {
    id: "F002",
    name: "Shanghai Electronics Factory",
    capacity: 15000
});


// Ports

CREATE
(:Port {
    id: "P001",
    name: "Chennai Port",
    country: "India"
}),
(:Port {
    id: "P002",
    name: "Shanghai Port",
    country: "China"
}),
(:Port {
    id: "P003",
    name: "Rotterdam Port",
    country: "Netherlands"
});


// Shipping Routes

CREATE
(:ShippingRoute {
    id: "R001",
    name: "Chennai-Rotterdam Route",
    distance_km: 8500
}),
(:ShippingRoute {
    id: "R002",
    name: "Shanghai-Rotterdam Route",
    distance_km: 10500
});


// Distributors

CREATE
(:Distributor {
    id: "D001",
    name: "Europe Electronics Distribution Hub"
});


// Retailers

CREATE
(:Retailer {
    id: "RT001",
    name: "North America Electronics Retailer"
});


// Products

CREATE
(:Product {
    id: "PR001",
    name: "Consumer Electronics"
});
