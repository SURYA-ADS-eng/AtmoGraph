import React from "react";
import SupplyChainDashboard from "../frontend/components/SupplyChainDashboard";
import GraphView from "../frontend/components/GraphView";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>AtmoGraph</h1>
        <p>Supply Chain Ripple Effect Analysis</p>
      </header>

      <main>
        <SupplyChainDashboard />

        <section className="graph-section">
          <h2>Supply Chain Graph</h2>
          <GraphView />
        </section>
      </main>
    </div>
  );
}

export default App;