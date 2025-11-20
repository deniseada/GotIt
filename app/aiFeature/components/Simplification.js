"use client";
import React, { useState } from "react";

export default function Simplification() {
  const [instructions, setInstructions] = useState("Simplify part 1-2 of Delmar - Section 1 into:\n\n- main points\n\n- key concepts\n\n- important definitions");
  const [prompt, setPrompt] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimplify = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

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
          instructions: instructions.trim(),
          prompt: prompt.trim()
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
      const simplifiedContent = result.text || result.content || JSON.stringify(result, null, 2);
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
      <h2>Text Simplification</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="instructions-input">Instructions:</label>
        <textarea
          id="instructions-input"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter instructions for the AI..."
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "10px",
            marginTop: "10px",
            fontSize: "14px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="prompt-input">Prompt:</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt (e.g., '1-5 Electron Orbits')..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "10px",
            marginTop: "10px",
            fontSize: "14px",
          }}
        />
      </div>

      <button
        onClick={handleSimplify}
        disabled={loading || !prompt.trim()}
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
        {loading ? "Simplifying..." : "Simplify Text"}
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
