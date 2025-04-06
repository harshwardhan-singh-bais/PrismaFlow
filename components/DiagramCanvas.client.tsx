"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import { parsePrismaSchema } from "@/lib/parsePrismaSchema";

type DiagramCanvasProps = {
  schema: string;
  isGenerated: boolean;
  view: "3d" | "2d";
  layout: "flowchart" | "traditional";
  spacing: number;
};

const DiagramCanvas = ({
  schema,
  layout = "flowchart",
  spacing = 200,
}: DiagramCanvasProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { models, relations } = parsePrismaSchema(schema);

    const nodeEntries = Object.entries(models);
    const nodeList: Node[] = [];

    nodeEntries.forEach(([modelName, fields], i) => {
      const x = layout === "flowchart" ? (i % 5) * spacing : 0;
      const y = layout === "flowchart" ? Math.floor(i / 5) * spacing : i * spacing;

      nodeList.push({
        id: modelName,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div>
              <strong>{modelName}</strong>
              <ul className="text-xs">
                {fields.map((field, idx) => (
                  <li key={idx}>{field}</li>
                ))}
              </ul>
            </div>
          ),
        },
        style: {
          backgroundColor: "#1d4ed8",
          color: "#fff",
          borderRadius: 8,
          padding: 10,
          width: 200,
        },
      });
    });

    const edgeList: Edge[] = relations.map((rel, i) => ({
      id: `e-${i}`,
      source: rel.from,
      target: rel.to,
      label: rel.label,
      animated: true,
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));

    setNodes(nodeList);
    setEdges(edgeList);
  }, [schema, layout, spacing]);

  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          style={{ background: "#121212" }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramCanvas;
