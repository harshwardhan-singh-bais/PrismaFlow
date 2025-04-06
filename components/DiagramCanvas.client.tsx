"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import { parsePrismaSchema } from "@/lib/parsePrismaSchema";

type DiagramCanvasProps = {
  schema: string;
  layout?: "flowchart" | "traditional";
  spacing?: number;
  view?: "2d" | "3d";
  isGenerated?: boolean;
};

const nodeWidth = 250;
const nodeHeight = 150;

const DiagramCanvas = ({
  schema,
  layout = "flowchart",
  spacing = 200,
}: DiagramCanvasProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const { models, relations } = parsePrismaSchema(schema);

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
      rankdir: layout === "flowchart" ? "LR" : "TB",
      nodesep: 50,
      ranksep: spacing,
    });

    const createdNodes: Node[] = Object.entries(models).map(
      ([modelName, fields]) => {
        const nodeId = modelName;
        dagreGraph.setNode(nodeId, { width: nodeWidth, height: nodeHeight });

        return {
          id: nodeId,
          type: "default",
          data: {
            label: (
              <div className="p-4 bg-purple-100 border border-purple-400 rounded-lg shadow-md">
                <div className="font-bold text-purple-700 mb-2">{modelName}</div>
                <table className="text-sm w-full">
                  <tbody>
                    {fields.map((field, idx) => (
                      <tr key={idx} className="border-t border-purple-300">
                        <td className="py-1 text-purple-800">{field}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          position: { x: 0, y: 0 },
        };
      }
    );

    const createdEdges: Edge[] = relations.map((rel, index) => ({
      id: `e${index}`,
      source: rel.from,
      target: rel.to,
      label: rel.label,
      animated: true,
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));

    createdEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const positionedNodes = createdNodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: x - nodeWidth / 2,
          y: y - nodeHeight / 2,
        },
      };
    });

    setNodes(positionedNodes);
    setEdges(createdEdges);
  }, [schema, layout, spacing]);

  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramCanvas;
