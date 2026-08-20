// frontend/src/components/GraphView.jsx

import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const GraphView = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Fetch graph data from backend
    axios.get("http://localhost:8000/graph_data")
      .then((res) => {
        const graph = res.data.graph;

        // Convert backend edges into React Flow nodes + edges
        const nodes = [];
        const edges = [];

        graph.forEach((edge, index) => {
          // Add source node if not already present
          if (!nodes.find((n) => n.id === edge.source)) {
            nodes.push({
              id: edge.source,
              data: { label: edge.source },
              position: { x: Math.random() * 400, y: Math.random() * 400 },
              style: { background: "#e0f7fa", border: "1px solid #00796b" }
            });
          }

          // Add target node if not already present
          if (!nodes.find((n) => n.id === edge.target)) {
            nodes.push({
              id: edge.target,
              data: { label: edge.target },
              position: { x: Math.random() * 400, y: Math.random() * 400 },
              style: { background: "#fff9c4", border: "1px solid #fbc02d" }
            });
          }

          // Add edge
          edges.push({
            id: `e${index}`,
            source: edge.source,
            target: edge.target,
            label: edge.relation,
            animated: true,
            style: { stroke: "#0288d1" }
          });
        });

        setElements([...nodes, ...edges]);
      })
      .catch((err) => console.error("Error fetching graph data:", err));
  }, []);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow elements={elements}>
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphView;
