"use client";
import React, { useState } from "react";

const MINDMAP_PROMPT = "topic: atoms, return the json formatted array of nodes and edges";

export default function MindMap() {
    const [mindmap, setMindmap] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cleanText = (text) => {
        if (!text) return "";
        let cleaned = text;
        // Remove all backslashes first (unescape quotes)
        cleaned = cleaned.replace(/\\/g, "");
        // Remove quotation marks only around "name", "category", and "reason" keys
        cleaned = cleaned.replace(/"name"\s*:/g, "name:");
        cleaned = cleaned.replace(/"category"\s*:/g, "category:");
        cleaned = cleaned.replace(/"reason"\s*:/g, "reason:");
        cleaned = cleaned.replace(/"relation"\s*:/g, "relation:");
        cleaned = cleaned.replace(/"subtopics"\s*:/g, "subtopics:");
        // Remove apostrophes from curly braces
        cleaned = cleaned.replace(/"{/g, "{");
        cleaned = cleaned.replace(/"]}"/g, "]}");
        cleaned = cleaned.replace(/}"/g, "}");
        return cleaned.trim();
    };

    const handleMindMap = async () => {
        setLoading(true);
        setError(null);
        setMindmap("");

        try {
        const response = await fetch("/api/mindmap", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            prompt: MINDMAP_PROMPT,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || "Failed to generate mind map";
            const errorDetails = errorData.details ? `\n\nDetails: ${errorData.details}` : "";
            throw new Error(errorMessage + errorDetails);
        }

        const result = await response.json();
        const rawContent = result.text || result.content || JSON.stringify(result, null, 2);
        const cleanedContent = cleanText(rawContent);
        setMindmap(cleanedContent);
        } catch (err) {
        setError(err.message);
        console.error("Error fetching mind map:", err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h2>MindMap</h2>
        <button
            onClick={handleMindMap}
            disabled={loading}
            style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            }}
        >
            {loading ? "Generating..." : "MindMap"}
        </button>

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

        {mindmap && (
            <div style={{ marginTop: "20px" }}>
            <h3>Mind Map Output:</h3>
            <pre
                style={{
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                }}
            >
                {mindmap}
            </pre>
            </div>
        )}
        </div>
    );
    }