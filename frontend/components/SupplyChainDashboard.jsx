import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplyChainDashboard = () => {
  const [metrics, setMetrics] = useState([
    {
      title: "Total Suppliers",
      value: "0",
      description: "Active suppliers",
    },
    {
      title: "Products Tracked",
      value: "0",
      description: "Products in network",
    },
    {
      title: "Active Dependencies",
      value: "0",
      description: "Supply relationships",
    },
    {
      title: "At-Risk Nodes",
      value: "0",
      description: "Requires attention",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:8000/graph_data"
        );

        const graph = response.data?.graph || [];

        const nodes = new Set();
        const suppliers = new Set();
        const products = new Set();

        graph.forEach((edge) => {
          if (edge.source) {
            nodes.add(edge.source);

            if (
              edge.source.toLowerCase().includes("supplier")
            ) {
              suppliers.add(edge.source);
            }

            if (
              edge.source.toLowerCase().includes("product")
            ) {
              products.add(edge.source);
            }
          }

          if (edge.target) {
            nodes.add(edge.target);

            if (
              edge.target.toLowerCase().includes("supplier")
            ) {
              suppliers.add(edge.target);
            }

            if (
              edge.target.toLowerCase().includes("product")
            ) {
              products.add(edge.target);
            }
          }
        });

        const atRiskNodes = 0;

        setMetrics([
          {
            title: "Total Suppliers",
            value: suppliers.size.toString(),
            description: "Suppliers in network",
          },
          {
            title: "Products Tracked",
            value: products.size.toString(),
            description: "Products in network",
          },
          {
            title: "Active Dependencies",
            value: graph.length.toString(),
            description: "Supply relationships",
          },
          {
            title: "At-Risk Nodes",
            value: atRiskNodes.toString(),
            description: "Requires attention",
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Unable to load live supply-chain data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  return (
    <section className="supply-chain-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Supply Chain Overview</h1>

          <p>
            Monitor suppliers, products, dependencies, and
            potential disruption risks across the supply chain.
          </p>
        </div>

        <span className="dashboard-status">
          {loading ? "Loading..." : "System Active"}
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            background: "#ffebee",
            color: "#c62828",
          }}
        >
          {error}
        </div>
      )}

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.title}>
            <h3>{metric.title}</h3>

            <strong>
              {loading ? "..." : metric.value}
            </strong>

            <p>{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-panel">
        <h2>Ripple Effect Analysis</h2>

        <p>
          Select a supplier or disruption event to identify
          downstream entities that may be affected.
        </p>

        <div className="analysis-actions">
          <button type="button">
            Analyze Supply Chain
          </button>

          <button
            type="button"
            className="secondary-button"
          >
            View Dependencies
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupplyChainDashboard;
