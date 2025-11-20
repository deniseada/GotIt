"use client";
import React, { useState } from "react";

const SUMMARIZE_PROMPT = "Summarize Delmar - Section 1 into a concise summary. Only return the answer.";

export default function Summarization() {
    const [summary, setSummary] = useState("");
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

    const handleSummarize = async () => {
        setLoading(true);
        setError(null);
        setSummary("");

        try {
        const response = await fetch("/api/summarize", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            prompt: SUMMARIZE_PROMPT,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || "Failed to summarize text";
            const errorDetails = errorData.details ? `\n\nDetails: ${errorData.details}` : "";
            throw new Error(errorMessage + errorDetails);
        }

        const result = await response.json();
        const rawContent = result.text || result.content || JSON.stringify(result, null, 2);
        const cleanedContent = cleanText(rawContent);
        setSummary(cleanedContent);
        } catch (err) {
        setError(err.message);
        console.error("Error summarizing text:", err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
        <h2>Summarization</h2>
        <button
            onClick={handleSummarize}
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
            {loading ? "Summarizing..." : "Summarize"}
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

        {summary && (
            <div style={{ marginTop: "20px" }}>
            <h3>Summary:</h3>
            <pre
                style={{
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                }}
            >
                {summary}
            </pre>
            </div>
        )}
        </div>
    );
    }