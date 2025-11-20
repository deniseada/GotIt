"use client";
import React, { useState } from "react";

const SUMMARIZED_PROMPT =
    "Simplify all parts of Delmar - Section 1 into: main points, key concepts, important definitions. Ignore any figures, images, and page numbers.";

export default function Simplification() {
    const [simplifiedText, setSimplifiedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cleanText = (text) => {
        if (!text) return "";
        let cleaned = text;
        cleaned = cleaned.replace(/\+/g, "");
        cleaned = cleaned.replace(/\bN\b/g, "");
        cleaned = cleaned.replace(/(\n\s*){3,}/g, "\n\n");
        return cleaned.trim();
    };

    const handleSimplify = async () => {
        setLoading(true);
        setError(null);
        setSimplifiedText("");

        try {
        const response = await fetch("/api/simplify", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            prompt: SUMMARIZED_PROMPT,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || "Failed to simplify text";
            const errorDetails = errorData.details ? `\n\nDetails: ${errorData.details}` : "";
            throw new Error(errorMessage + errorDetails);
        }

        const result = await response.json();

        // Extract the simplified text from the response
        // The API returns { text: "...", content: "...", format: "sse" } for SSE streams
        const rawContent = result.text || result.content || JSON.stringify(result, null, 2);
        const simplifiedContent = cleanText(rawContent);
        setSimplifiedText(simplifiedContent);
        } catch (err) {
        setError(err.message);
        console.error("Error simplifying text:", err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h2>Simplified</h2>

        <button
            onClick={handleSimplify}
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
            {loading ? "Simplifying..." : "Simplify"}
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

        {simplifiedText && (
            <div style={{ marginTop: "20px" }}>
            <h3>Simplified Result:</h3>
            <pre
                style={{
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                }}
            >
                {simplifiedText}
            </pre>
            </div>
        )}
        </div>
    );
    }
