import React, { useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
} from "reactflow";

import "reactflow/dist/style.css";
import axios from "axios";

const GraphView = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
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

        const nodeMap = new Map();
        const graphEdges = [];

        graph.forEach((edge, index) => {
          const source = edge.source;
          const target = edge.target;

          if (!source || !target) {
            return;
          }

          if (!nodeMap.has(source)) {
            nodeMap.set(source, {
              id: source,
              data: {
                label: source,
              },
            });
          }

          if (!nodeMap.has(target)) {
            nodeMap.set(target, {
              id: target,
              data: {
                label: target,
              },
            });
          }

          graphEdges.push({
            id: `edge-${index}`,
            source,
            target,
            label: edge.relation || "RELATED_TO",
            animated: true,
          });
        });

        const graphNodes = Array.from(
          nodeMap.values()
        ).map((node, index) => {
          const columns = 4;
          const xSpacing = 260;
          const ySpacing = 140;

          const column = index % columns;
          const row = Math.floor(index / columns);

          return {
            ...node,
            position: {
              x: column * xSpacing,
              y: row * ySpacing,
            },
            style: {
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #1976d2",
              background: "#e3f2fd",
              minWidth: "150px",
              textAlign: "center",
            },
          };
        });

        setNodes(graphNodes);
        setEdges(graphEdges);
      } catch (err) {
        console.error(
          "Error fetching graph data:",
          err
        );

        setError(
          "Unable to load supply-chain graph."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading supply-chain graph...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c62828",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <MiniMap />

        <Controls />

        <Background
          color="#aaa"
          gap={16}
        />
      </ReactFlow>
    </div>
  );
};

export default GraphView;
