"use client";
import React from "react";

export default function Summarization({ text, loading, error, fontSize = 16, letterSpacing = 0 }) {
    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ 
            fontFamily: "Amiri", 
            fontSize: "24px", 
            fontWeight: "bold" 
            }}>
                Summary
            </h2>

            {loading && (
                <div style={{ marginTop: "20px", padding: "10px" }}>
                    Summarizing...
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
                        fontFamily: "Amiri",
                        fontSize: `${fontSize}px`,
                        letterSpacing: `${letterSpacing}px`,
                        padding: "15px",
                        backgroundColor: "white",
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