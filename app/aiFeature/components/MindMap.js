"use client";
import React, { useState, useCallback, useEffect } from "react";

import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Background,
    Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Simple initial nodes/edges before API data
const initialNodes = [
    {
        id: "n1",
        position: { x: 0, y: 0 },
        data: {
            label: "Waiting for ai generation...",
            name: "",
            relation: "",
            reason: "",
            expanded: false,
        },
        type: "",
    },
];

const initialEdges = [];

function buildMindMapFromConcepts(concepts) {
    if (!Array.isArray(concepts) || concepts.length === 0) {
        return { nodes: [], edges: [] };
    }

    const center = concepts[0];

    const nodes = concepts.map((concept, index) => {
        let x, y;
        if (index === 0) {
            x = 0;
            y = 0;
        } else {
            const totalChildren = concepts.length - 1;
            const childIndex = index - 1;
            const spacing = 250;
            const totalWidth = spacing * (totalChildren - 1);
            x = -totalWidth / 2 + childIndex * spacing;
            y = 200;
        }

        return {
            id: concept.name || `node-${index}`,
            position: { x, y },
            data: {
                label: concept.name,
                name: concept.name,
                relation: concept.relation,
                reason: concept.reason,
                expanded: false,
                subtopics: concept.subtopics,
                category: concept.category,
            },
            type: index === 0 ? "input" : "default",
        };
    });

    const edges = concepts.slice(1).map((concept, index) => ({
        id: `e-${center.name}-${concept.name || index}`,
        source: center.name,
        target: concept.name || `node-${index + 1}`,
        type: "step",
        label: "",
    }));

    return { nodes, edges };
}

export default function MindMap({ text, loading, error }) {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // When `text` changes, rebuild nodes/edges
    useEffect(() => {
        if (!text || loading || error) {
            return;
        }

        try {
            let concepts;

            if (Array.isArray(text)) {
                concepts = text;
            } else if (typeof text === "string") {
                let s = text.trim();

                // Convert 'text' to valid JSON:
                s = s.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

                concepts = JSON.parse(s);
            } else if (Array.isArray(text.concepts)) {
                concepts = text.concepts;
            } else {
                console.warn("Unexpected format for text prop:", text);
                return;
            }

            const { nodes: newNodes, edges: newEdges } =
                buildMindMapFromConcepts(concepts);

            setNodes(newNodes);
            setEdges(newEdges);
        } catch (err) {
            console.error("Failed to convert text into mind map:", err);
        }
    }, [text, loading, error]);

    const onNodesChange = useCallback(
        (changes) =>
            setNodes((nodesSnapshot) =>
                applyNodeChanges(changes, nodesSnapshot)
            ),
        []
    );

    const onEdgesChange = useCallback(
        (changes) =>
            setEdges((edgesSnapshot) =>
                applyEdgeChanges(changes, edgesSnapshot)
            ),
        []
    );

    const onConnect = useCallback(
        (params) =>
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        []
    );

    // Expand/collapse the clicked node data
    const onNodeClick = useCallback((event, node) => {
        setNodes((nodesSnapshot) =>
            nodesSnapshot.map((n) => {
                if (n.id !== node.id || !n.data) {
                    return n;
                }

                const currentlyExpanded = !!n.data.expanded;
                const newExpanded = !currentlyExpanded;

                const newLabel = newExpanded
                    ? `${n.data.name}\n${n.data.relation}\n${n.data.reason}`
                    : n.data.name;

                return {
                    ...n,
                    data: {
                        ...n.data,
                        expanded: newExpanded,
                        label: newLabel,
                    },
                };
            })
        );
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2
                style={{
                    fontFamily: "Amiri",
                    fontSize: "24px",
                    fontWeight: "bold",
                }}
            >
                MindMap
            </h2>

            {loading && (
                <div style={{ marginTop: "20px", padding: "10px" }}>
                    Generating...
                </div>
            )}

            {error && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#eee",
                        color: "#000",
                        borderRadius: "5px",
                    }}
                >
                    Error: {error}
                </div>
            )}

            <div style={{ width: "80vw", height: "80vh" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}
