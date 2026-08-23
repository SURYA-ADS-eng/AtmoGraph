import React from "react";

const SupplyChainDashboard = () => {
  const metrics = [
    {
      title: "Total Suppliers",
      value: "128",
      description: "Active suppliers",
    },
    {
      title: "Products Tracked",
      value: "342",
      description: "Products in network",
    },
    {
      title: "Active Dependencies",
      value: "516",
      description: "Supply relationships",
    },
    {
      title: "At-Risk Nodes",
      value: "17",
      description: "Requires attention",
    },
  ];

  return (
    <section className="supply-chain-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Supply Chain Overview</h1>
          <p>
            Monitor suppliers, products, dependencies, and potential
            disruption risks across the supply chain.
          </p>
        </div>

        <span className="dashboard-status">
          System Active
        </span>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.title}>
            <h3>{metric.title}</h3>
            <strong>{metric.value}</strong>
            <p>{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-panel">
        <h2>Ripple Effect Analysis</h2>
        <p>
          Select a supplier or disruption event to identify downstream
          entities that may be affected.
        </p>

        <div className="analysis-actions">
          <button type="button">
            Analyze Supply Chain
          </button>

          <button type="button" className="secondary-button">
            View Dependencies
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupplyChainDashboard;
