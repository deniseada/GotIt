"use client";
import SideBar from "./sideBar";
import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import styles from "../mvp.module.css";
import NavBar from "./NavBar";
import Link from "next/link";

// Components
import SplitView from "./SplitView";
import ModeTabs from "./ModeTabs";
import ToolBar from "./ToolBar";

// AI Features Components
import Simplification from "../../aiFeature/components/Simplification";
import Summarization from "../../aiFeature/components/Summarization";
import MindMap from "../../aiFeature/components/MindMap";

// Right side modals and their buttons
import RightDockButtons from "./rightSideModals/RightDockButtons";
import useModal from "./useModal";
import TimerPopover from "./TimerPopover";
import AIModal from "./AIModal";
import VocabModal from "./VocabModal";

import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";

export default function DocScreen() {
  const [split, setSplit] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("simplified");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Split view + zoom
  const toggleSplit = () => setSplit((s) => !s);
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const zoomReset = () => setZoom(1);

  // Press 'S' to toggle split view
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "s") setSplit((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Right Side Buttons (AI/Vocab)
  const ai = useModal(false);
  const vocab = useModal(false);
  const [textToSpeechPlaying, setTextToSpeechPlaying] = useState(false);
  const aiBtnRef = useRef(null); // anchor for AI Popper

  // AI Feature States
  const [simplifiedText, setSimplifiedText] = useState("");
  const [summary, setSummary] = useState("");
  const [mindmap, setMindmap] = useState("");
  const [aiLoading, setAiLoading] = useState({ simplify: false, summarize: false, mindmap: false });
  const [aiError, setAiError] = useState({ simplify: null, summarize: null, mindmap: null });

  // ===== TIMER (single source of truth) =====
  const timerBtnRef = useRef(null); // anchor for Popper
  const [timerOpen, setTimerOpen] = useState(false); // UI visibility (mini/presets)
  const [timerSeconds, setTimerSeconds] = useState(0); // remaining seconds
  const [timerRunning, setTimerRunning] = useState(false); // ticking state

  // Show the mini timer UI
  const openTimer = () => setTimerOpen(true);
  // Hide UI only (do not pause)
  const handleTimerHide = () => setTimerOpen(false);

  // Start/pause/reset
  const pauseTimer = () => setTimerRunning(false);
  const resumeTimer = () => {
    if (timerSeconds > 0) setTimerRunning(true);
  };
  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  // Choosing a time from presets
  const handleTimerChange = (mins) => {
    const secs = Math.max(0, mins * 60);
    setTimerSeconds(secs);
    setTimerRunning(secs > 0); // auto-start if > 0
    setTimerOpen(true); // keep UI visible right after selection (mini collapses inside)
  };

  // Tick every second while running — independent of visibility
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const id = setInterval(() => {
      setTimerSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  // Stop at 0
  useEffect(() => {
    if (timerSeconds === 0 && timerRunning) setTimerRunning(false);
  }, [timerSeconds, timerRunning]);

  // AI Feature Handlers
  const SIMPLIFY_PROMPT = "Simplify all parts of Delmar - Section 1 into: main points, key concepts, important definitions. Ignore any figures, images, and page numbers.";
  const SUMMARIZE_PROMPT = "Summarize Delmar - Section 1 into a concise summary. Only return the answer.";
  const MINDMAP_PROMPT = "topic: atoms, return the json formatted array of nodes and edges";

  const cleanText = (text) => {
    if (!text) return "";
    let cleaned = text;
    cleaned = cleaned.replace(/\+/g, "");
    cleaned = cleaned.replace(/\bN\b/g, "");
    cleaned = cleaned.replace(/(\n\s*){3,}/g, "\n\n");
    return cleaned.trim();
  };

  const cleanMindMapText = (text) => {
    if (!text) return "";
    let cleaned = text;
    cleaned = cleaned.replace(/\\/g, "");
    cleaned = cleaned.replace(/"name"\s*:/g, "name:");
    cleaned = cleaned.replace(/"category"\s*:/g, "category:");
    cleaned = cleaned.replace(/"reason"\s*:/g, "reason:");
    cleaned = cleaned.replace(/"relation"\s*:/g, "relation:");
    cleaned = cleaned.replace(/"subtopics"\s*:/g, "subtopics:");
    cleaned = cleaned.replace(/"{/g, "{");
    cleaned = cleaned.replace(/"]}"/g, "]}");
    cleaned = cleaned.replace(/}"/g, "}");
    return cleaned.trim();
  };

  const handleSimplify = async () => {
    setAiLoading(prev => ({ ...prev, simplify: true }));
    setAiError(prev => ({ ...prev, simplify: null }));
    setSimplifiedText("");
    ai.onClose(); // Close the modal

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: SIMPLIFY_PROMPT,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to simplify text";
        const errorDetails = errorData.details ? `\n\nDetails: ${errorData.details}` : "";
        throw new Error(errorMessage + errorDetails);
      }

      const result = await response.json();
      const rawContent = result.text || result.content || JSON.stringify(result, null, 2);
      const simplifiedContent = cleanText(rawContent);
      setSimplifiedText(simplifiedContent);
      setMode("simplified");
      if (!split) toggleSplit(); // Open split view if not already open
    } catch (err) {
      setAiError(prev => ({ ...prev, simplify: err.message }));
      console.error("Error simplifying text:", err);
    } finally {
      setAiLoading(prev => ({ ...prev, simplify: false }));
    }
  };

  const handleSummarize = async () => {
    setAiLoading(prev => ({ ...prev, summarize: true }));
    setAiError(prev => ({ ...prev, summarize: null }));
    setSummary("");
    ai.onClose(); // Close the modal

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
      setMode("summarized");
      if (!split) toggleSplit(); // Open split view if not already open
    } catch (err) {
      setAiError(prev => ({ ...prev, summarize: err.message }));
      console.error("Error summarizing text:", err);
    } finally {
      setAiLoading(prev => ({ ...prev, summarize: false }));
    }
  };

  const handleMindMap = async () => {
    setAiLoading(prev => ({ ...prev, mindmap: true }));
    setAiError(prev => ({ ...prev, mindmap: null }));
    setMindmap("");
    ai.onClose(); // Close the modal

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
      const cleanedContent = cleanMindMapText(rawContent);
      setMindmap(cleanedContent);
      setMode("mindmap");
      if (!split) toggleSplit(); // Open split view if not already open
    } catch (err) {
      setAiError(prev => ({ ...prev, mindmap: err.message }));
      console.error("Error fetching mind map:", err);
    } finally {
      setAiLoading(prev => ({ ...prev, mindmap: false }));
    }
  };

  // ===== MOCK CONTENT (unchanged) =====
  const MockOriginalPage = memo(function MockOriginalPage({ page, zoom }) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          p: 2,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: `${Math.min(1200, 900 * zoom)}px`,
            height: "100vh",
            maxHeight: "100vh",
            bgcolor: "common.white",
            p: 1,
            overflow: "auto",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl="/delmarSection1.pdf"
              defaultScale={SpecialZoomLevel.PageWidth}
            />
          </Worker>
        </Box>
      </Box>
    );
  });

  function MockRightPane({ mode, page, zoom }) {
    return (
      <Box
        sx={{
          height: "100%",
          p: 2,
          bgcolor: "background.paper",
          borderRadius: { xs: 0, md: 2 },
          boxShadow: 1,
          overflow: "auto",
        }}
      >
        {mode === "simplified" && (
          <>
            <Simplification 
              text={simplifiedText}
              loading={aiLoading.simplify}
              error={aiError.simplify}
            />
          </>
        )}
        {mode === "summarized" && (
          <div>
            <Summarization 
              text={summary}
              loading={aiLoading.summarize}
              error={aiError.summarize}
            />
          </div>
        )}
        {mode === "mindmap" && (
          <div>
            <MindMap 
              text={mindmap}
              loading={aiLoading.mindmap}
              error={aiError.mindmap}
            />
          </div>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <NavBar title={"Delmar's Standard Textbook of Electricity"} />
      {/* Toolbar */}
      <ToolBar
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        split={split}
        onToggleSplit={toggleSplit}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      {/* Main content */}
      <Box
        className={styles.contentUnderToolbar}
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: sidebarOpen ? "280px 1fr" : "1fr",
          columnGap: 0,
          pl: sidebarOpen ? 0 : { xs: 1, md: 2 },
          pr: { xs: 1, md: 2 },
          pb: { xs: 1, md: 2 },
          pt: 0, // keep content flush to toolbar
        }}
      >
        {sidebarOpen && <SideBar />}
        {split ? (
          <SplitView
            left={useMemo(() => <MockOriginalPage page={page} zoom={zoom} />, [page, zoom])}
            right={
              <Box
                sx={{
                  height: "100%",
                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                }}
              >
                <ModeTabs value={mode} onChange={setMode} />
                <MockRightPane mode={mode} page={page} zoom={zoom} />
              </Box>
            }
          />
        ) : (
          <Box>
            {useMemo(() => <MockOriginalPage page={page} zoom={zoom} />, [page, zoom])}
          </Box>
        )}
      </Box>

      {/* RIGHT-SIDE BUTTONS */}
      <RightDockButtons
        timerBtnRef={timerBtnRef}
        onOpenTimer={openTimer}
        aiBtnRef={aiBtnRef}
        onOpenB={() => (ai.open ? ai.onClose() : ai.onOpen())}
        onOpenC={vocab.onOpen}
      />

      {/* TIMER (persistent; hiding doesn't pause) */}
      <TimerPopover
        anchorEl={timerBtnRef.current}
        open={timerOpen}
        onHide={handleTimerHide} // hides visually, keeps ticking
        seconds={timerSeconds}
        running={timerRunning}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onChange={handleTimerChange}
      />

      {/* Other modals */}
      <AIModal 
        anchorEl={aiBtnRef.current}
        open={ai.open}
        onClose={ai.onClose}
        onSimplify={handleSimplify}
        onSummarize={handleSummarize}
        onMindMap={handleMindMap}
        loading={aiLoading}
      />
      <VocabModal open={vocab.open} onClose={vocab.onClose} />

      {/* Text-to-Speech Button */}
      <Box
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 1200,
        }}
      >
        <Tooltip title={textToSpeechPlaying ? "Pause" : "Text to Speech"}>
          <IconButton
            onClick={() => setTextToSpeechPlaying(!textToSpeechPlaying)}
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { boxShadow: 2 },
              width: 48,
              height: 48,
              borderRadius: "14px",
              border: "1px solid #dcd4e2",
            }}
          >
            {textToSpeechPlaying ? (
              <PauseIcon sx={{ color: "#522A70", fontSize: 28 }} />
            ) : (
              <img src="/icons/speaking-head.svg" alt="Text to Speech" width="35" height="35" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
