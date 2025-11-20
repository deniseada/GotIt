"use client";
import React from "react";

export default function MindMap({ text, loading, error }) {
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
        </div>
    );
}