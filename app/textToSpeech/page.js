"use client";
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

export default function TextToSpeech() {
    const [text, setText] = useState("");

    const handleSpeak = async () => {
        try {
        const audio = await puter.ai.txt2speech(text);
        audio.play();
        } catch (error) {
        console.error("Error:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <TextField
            id="text-input"
            label="Enter text"
            multiline
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSpeak}>
            <img
                src="/icons/Speaker_Icon.svg" 
                alt="text-to-speech icon"
                height="25em"
                width="25em"
            />
            Speak
        </Button>
        </div>
    );
}
