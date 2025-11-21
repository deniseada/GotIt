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

// Optional: simple initial nodes/edges before API data arrives
const initialNodes = [
    {
        id: "n1",
        position: { x: 0, y: 0 },
        data: {
            label: "Node 1",
            name: "Node 1",
            relation: "",
            reason: "",
            expanded: false,
        },
        type: "input",
    },
];

const initialEdges = [];

function buildMindMapFromConcepts(concepts) {
    if (!Array.isArray(concepts) || concepts.length === 0) {
        return { nodes: [], edges: [] };
    }

    const center = concepts[0];

    const nodes = concepts.map((concept, index) => {
        // position: centered tree layout
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
                label: concept.name,          // initial text
                name: concept.name,
                relation: concept.relation,
                reason: concept.reason,
                expanded: false,
                parentId: index === 0 ? null : center.name, // 👈 parent info
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

                // Convert JS-like objects to valid JSON:
                // [{name: "atoms", ...}] -> [{"name": "atoms", ...}]
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
    const onNodeClick = useCallback((event, node) => {
        setNodes((nodesSnapshot) =>
            nodesSnapshot.map((n) => {
                // 1) Toggle the clicked node's expanded state + label
                if (n.id === node.id) {
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
                }
    
                // 2) Show/hide direct children of the clicked node
                if (n.data && n.data.parentId === node.id) {
                    const clickedIsCurrentlyExpanded = !!node.data.expanded;
                    // if it WAS expanded, we are collapsing -> hide children
                    // if it WAS collapsed, we are expanding -> show children
                    const hideChild = clickedIsCurrentlyExpanded;
    
                    return {
                        ...n,
                        hidden: hideChild,
                    };
                }
    
                return n;
            })
        );
    
        setEdges((edgesSnapshot) =>
            edgesSnapshot.map((e) => {
                // hide edges that connect to children of this node
                const clickedIsCurrentlyExpanded = !!node.data.expanded;
                const hideEdge = clickedIsCurrentlyExpanded && e.source === node.id;
    
                if (hideEdge) {
                    return { ...e, hidden: true };
                }
    
                // when expanding, show edges again
                if (!clickedIsCurrentlyExpanded && e.source === node.id) {
                    return { ...e, hidden: false };
                }
    
                return e;
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
