"use client";
import React, { useMemo } from "react";

export default function Simplification({ 
    text, 
    loading, 
    error, 
    fontSize = 16, 
    letterSpacing = 0,
    formats = [],
    onFormatsChange,
    onApplyFormat
}) {
    const formattedText = useMemo(() => {
        if (!text || formats.length === 0) return text;
        
        // Sort formats by start position
        const sortedFormats = [...formats].sort((a, b) => a.start - b.start);
        const parts = [];
        let lastIndex = 0;
        
        sortedFormats.forEach(format => {
            // Add text before format
            if (format.start > lastIndex) {
                parts.push({ text: text.substring(lastIndex, format.start), bold: false, italic: false });
            }
            
            // Add formatted text
            const formattedPart = text.substring(format.start, format.end);
            parts.push({ 
                text: formattedPart, 
                bold: format.bold || false, 
                italic: format.italic || false 
            });
            
            lastIndex = format.end;
        });
        
        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({ text: text.substring(lastIndex), bold: false, italic: false });
        }
        
        return parts.length > 0 ? parts : [{ text, bold: false, italic: false }];
    }, [text, formats]);
    return (
        <div style={{ 
                padding: "20px"
            }}>
        <h2 style={{ 
            fontFamily: "Amiri", 
            fontSize: "24px", 
            fontWeight: "bold" 
            }}>
                Simplification
        </h2>

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
            <div
                data-ai-output="simplification"
                style={{
                    fontFamily: "Amiri",
                    fontSize: `${fontSize}px`,
                    letterSpacing: `${letterSpacing}px`,
                    padding: "15px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    userSelect: "text",
                }}
            >
                {Array.isArray(formattedText) ? (
                    formattedText.map((part, index) => {
                        const style = {
                            fontWeight: part.bold ? "bold" : "normal",
                            fontStyle: part.italic ? "italic" : "normal",
                        };
                        return (
                            <span key={index} style={style}>
                                {part.text}
                            </span>
                        );
                    })
                ) : (
                    text
                )}
            </div>
            </div>
        )}
        </div>
    );
}
