"use client";
import React from "react";

// Importing React Flow for mind map visualization
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Nodes for the mind map
const initialNodes = [
    {
        id: 'n1',
        position: { x: 0, y: 0 },
        data: { label: 'Node 1' },
        type: 'input',
    },
    {
        id: 'n2',
        position: { x: 100, y: 100 },
        data: { label: 'Node 2' },
    },
];

// Edges for the mind map
const initialEdges = [
    {
        id: 'n1-n2',
        source: 'n1',
        target: 'n2',
        type: 'step',
        label: 'connects with',
    },
];

export default function MindMap({ text, loading, error }) {

    // State for the mind map nodes and edges
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Function to handle node changes
    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    // Function to handle edge changes
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    // Function to handle edge connection
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );





    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ 
                fontFamily: "Amiri", 
                fontSize: "24px", 
                fontWeight: "bold" 
            }}>
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
                    backgroundColor: "#fee",
                    color: "#c33",
                    borderRadius: "5px",
                }}
                >
                Error: {error}
                </div>
            )}

            {text && (
                <div style={{ marginTop: "20px" }}>
                <pre
                    style={{
                    padding: "15px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    }}
                >
                    {text}
                </pre>
                </div>
            )}
            {/* Mind Map Visualization */}
            <div style={{ width: '80vw', height: '80vh' }}>
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}