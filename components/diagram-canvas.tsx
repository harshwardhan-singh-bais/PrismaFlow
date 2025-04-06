"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";

// Define a custom data type for nodes
interface CustomNodeData {
  label: string;
  fields: string[];
  onClick: () => void;
}

// Parse Prisma schema with explicit typing
const parsePrismaSchema = (
  schema: string
): {
  nodes: Node<CustomNodeData, string | undefined>[];
  edges: Edge<string | undefined>[];
} => {
  const nodes: Node<CustomNodeData, string | undefined>[] = [];
  const edges: Edge<string | undefined>[] = [];
  const models = schema.match(/model\s+(\w+)\s*{([^}]+)}/g) || [];

  let yOffset = 0;

  models.forEach((model, index) => {
    const modelName = model.match(/model\s+(\w+)/)?.[1] || `model${index + 1}`;
    const fields = model.match(/(\w+\s+\w+(?:\s+\@\w+)?)/g) || [];
    const nodeId = `${index + 1}`;

    nodes.push({
      id: nodeId,
      type: index === 0 ? "input" : "default",
      data: {
        label: modelName,
        fields: fields.map((field) => field.trim()),
        onClick: () => console.log(`Clicked ${modelName}`),
      },
      position: { x: 250, y: yOffset },
      style: {
        background: "#2563eb",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
      },
    });

    yOffset += 200;

    const relations = model.match(/@relation\(/g);
    if (relations && index > 0) {
      edges.push({
        id: `${index}-${index + 1}`,
        source: "1",
        target: nodeId,
        label: "1-to-many",
        type: "smoothstep",
        style: { stroke: "#8b5cf6" },
      });
    }
  });

  return { nodes, edges };
};

export const DiagramCanvas = ({
  schema,
  isGenerated,
  view,
  layout,
  spacing,
}: {
  schema: string;
  isGenerated: boolean;
  view: "3d" | "2d";
  layout: "flowchart" | "traditional";
  spacing: number;
}) => {
  const [elements, setElements] = useState<{
    nodes: Node<CustomNodeData, string | undefined>[];
    edges: Edge<string | undefined>[];
  }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (isGenerated && view === "2d") {
      const { nodes, edges } = parsePrismaSchema(schema);
      setElements({ nodes, edges });
    }
  }, [schema, isGenerated, view]);

  if (!isGenerated || view !== "2d") {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Generate a 2D diagram to see the result.
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={elements.nodes}
          edges={elements.edges}
          onConnect={(params: Connection) =>
            setElements((els) => ({
              nodes: els.nodes,
              edges: addEdge(params, els.edges),
            }))
          }
          style={{ background: "#121212" }}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
