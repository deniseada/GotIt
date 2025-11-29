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
            label: "Atom",
            name: "Atom",
            relation: "The atom is the smallest part of an element.",
            reason: "The atom is the smallest part of an element.",
            expanded: false,
        },
        type: "",
    },
    {
        id: "n2",
        position: { x: 150, y: 150 },
        data: {
            label: "Proton",
            name: "Proton",
            relation: "The proton is a positively charged particle located in the nucleus of an atom.",
            reason: "The proton is a positively charged particle located in the nucleus of an atom.",
            expanded: false,
        },
        type: "",
    },
    {
        id: "n3",
        position: { x: -150, y: 150 },
        data: {
            label: "Electron",
            name: "Electron",
            relation: "The electron is a negatively charged particle that orbits the nucleus of an atom.",
            reason: "The electron is a negatively charged particle that orbits the nucleus of an atom.",
            expanded: false,
        },
        type: "",
    }
];

const initialEdges = [
    {
        id: "e1",
        source: "n1",
        target: "n2",
        type: "step",
        label: "",
    },
    {
        id: "e2",
        source: "n1",
        target: "n3",
        type: "step",
        label: "",
    },
];

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
    const [rawText, setRawText] = useState("");
    const [processedText, setProcessedText] = useState("");
    const [showDebug, setShowDebug] = useState(true);

    // When `text` changes, rebuild nodes/edges
    useEffect(() => {
        if (!text || loading || error) {
            return;
        }

        try {
            let concepts;

            if (Array.isArray(text)) {
                setRawText(JSON.stringify(text, null, 2));
                setProcessedText(JSON.stringify(text, null, 2));
                concepts = text;
            } else if (typeof text === "string") {
                // Store raw text
                setRawText(text);
                
                let s = text.trim();
                setProcessedText(s);

                // Convert 'text' to valid JSON:
                s = s.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
                
                // Store processed text
                setProcessedText(s);

                concepts = JSON.parse(s);
            } else if (Array.isArray(text.concepts)) {
                setRawText(JSON.stringify(text, null, 2));
                setProcessedText(JSON.stringify(text.concepts, null, 2));
                concepts = text.concepts;
            } else {
                setRawText(JSON.stringify(text, null, 2));
                setProcessedText("Unexpected format");
                console.warn("Unexpected format for text prop:", text);
                return;
            }

            const { nodes: newNodes, edges: newEdges } =
                buildMindMapFromConcepts(concepts);

            setNodes(newNodes);
            setEdges(newEdges);
        } catch (err) {
            console.error("Failed to convert text into mind map:", err);
            const errorText = `ERROR: ${err.message}\n\nAttempted to parse:\n${processedText || rawText || text}`;
            setProcessedText(errorText);
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

            {/* Debug Section - Show raw and processed text */}
            {/* {text && (
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <button
                        onClick={() => setShowDebug(!showDebug)}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginBottom: "10px",
                        }}
                    >
                        {showDebug ? "Hide" : "Show"} Debug Info
                    </button>
                    
                    {showDebug && (
                        <div
                            style={{
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                padding: "15px",
                                maxHeight: "400px",
                                overflow: "auto",
                                fontFamily: "monospace",
                                fontSize: "12px",
                            }}
                        >
                            <div style={{ marginBottom: "20px" }}>
                                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                                    Raw Text from API:
                                </h3>
                                <pre
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "10px",
                                        borderRadius: "3px",
                                        border: "1px solid #ccc",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        maxHeight: "200px",
                                        overflow: "auto",
                                    }}
                                >
                                    {rawText || "No text received yet"}
                                </pre>
                            </div>
                            
                            <div>
                                <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                                    Processed Text (being parsed):
                                </h3>
                                <pre
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "10px",
                                        borderRadius: "3px",
                                        border: "1px solid #ccc",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        maxHeight: "200px",
                                        overflow: "auto",
                                    }}
                                >
                                    {processedText || "No processed text yet"}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )} */}

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
