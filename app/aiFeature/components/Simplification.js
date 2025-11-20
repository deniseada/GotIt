"use client";
import React from "react";

export default function Simplification({ text, loading, error }) {
    return (
        <div style={{ padding: "20px" }}>
        <h2>Simplification</h2>

        {loading && (
            <div style={{ marginTop: "20px", padding: "10px" }}>
                Simplifying...
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
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                }}
            >
                {text}
            </pre>
            </div>
        )}
        </div>
    );
}
