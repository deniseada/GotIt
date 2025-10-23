"use client";
import SideBar from "./sideBar";
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import styles from "../mvp.module.css";
import NavBar from "./NavBar";

// Components
import SplitView from "./SplitView";
import ModeTabs from "./ModeTabs";
import ToolBar from "./ToolBar";

// Right side modals and their buttons
import RightDockButtons from "./rightSideModals/RightDockButtons";
import useModal from "./useModal";
import TimerPopover from "./TimerPopover";
import AIModal from "./AIModal";
import VocabModal from "./VocabModal";

import { Worker, Viewer  } from "@react-pdf-viewer/core";

import { RetrieveResponse } from "roughlyai";

export default function DocScreen() {
  const [split, setSplit] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("simplified");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [summary, setSummary] = useState("");
  const [mm, setMM] = useState("");

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

  const CreateSummary = async (stepnum) => {
    try {
      const _resp = await fetch(
        "https://m3rcwp4vofeta3kqelrykbgosi0rswzn.lambda-url.ca-central-1.on.aws/",
        {
          method: "POST",
          body: JSON.stringify({
            prompt: `Using "Manual Circuits.pdf", create a summary detailing each sections and their learning blocks.`,
            project_name: "gotit",
          }),
        }
      );

      const _json_string = await _resp.json();
      const _json = JSON.parse(_json_string);

      console.log("what is _json", _json.url);
      // console.log("url", _url)
      const _report = await RetrieveResponse(_json.url);
      console.log("what is report", _report)
      const _summ = _report.answer;
      setSummary(_summ);
    } catch (e) {
      console.log("fail parse or retrieve", e.message);
    }
  };

  const CreateMindMap = async () => {
    try {
      const _resp = await fetch(
        "https://m3rcwp4vofeta3kqelrykbgosi0rswzn.lambda-url.ca-central-1.on.aws/",
        {
          method: "POST",
          body: JSON.stringify({
            prompt: `Using "Manual Circuits.pdf", create a mind map detailing how the components of the manual is related.`,
            project_name: "gotit",
          }),
        }
      );

      const _json_string = await _resp.json();
      const _json = JSON.parse(_json_string);

      console.log("what is _json", _json.url);
      // console.log("url", _url)
      const _report = await RetrieveResponse(_json.url);
      console.log("what is report", _report)
      const _mm = _report.answer;
      setMM(_mm);
    } catch (e) {
      console.log("fail parse or retrieve", e.message);
    }
  };

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

  // ===== MOCK CONTENT (unchanged) =====
  function MockOriginalPage({ page, zoom }) {
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
            width: `${Math.min(900, 700 * zoom)}px`,
            height: "600px",
            bgcolor: "common.white",
            borderRadius: 2,
            boxShadow: 4,
            p: 3,
            overflow: "auto",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl="/manual.pdf" />;
          </Worker>
          {/* <Typography variant="h6" gutterBottom>
            {page}. Manual Circuits
          </Typography>
          <Typography variant="body2" paragraph>
            (Original document mock) A manual circuit is started/stopped by a
            person...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Zoom: {(zoom * 100).toFixed(0)}%
          </Typography> */}
        </Box>
      </Box>
    );
  }

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
            <Typography variant="h6" gutterBottom>
              {page}. Manual Circuits — Simplified
            </Typography>
            <ul style={{ marginTop: 0 }}>
              <li>Manual = controlled by a person.</li>
              <li>
                Three-wire: Stop (NC), Start (NO), Motor Starter (with OLR).
              </li>
              <li>OLR protects the motor from overheating.</li>
            </ul>
            <Typography variant="caption" color="text.secondary">
              Zoom: {(zoom * 100).toFixed(0)}%
            </Typography>
          </>
        )}
        {mode === "summarized" && (
          <>
            <button onClick={() => CreateSummary()}>Summarize</button>
            <div style={{ whiteSpace: "pre-wrap", width: "100%" }}>
              {summary}
            </div>
          </>
          // <Typography variant="body2">
          //   Summary: Start/stop energizes a motor via a starter; overloads open
          //   on high current.
          // </Typography>
        )}
        {mode === "mindmap" && (
          <>
            <button onClick={() => CreateMindMap()}>Mind Map</button>
            <div style={{ whiteSpace: "pre-wrap", width: "100%" }}>
              {mm}
            </div>
          </>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <NavBar />
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
            left={<MockOriginalPage page={page} zoom={zoom} />}
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
          <Box
            sx={{
              height: "100%",
              borderRadius: 0,
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "auto",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              p: 2,
            }}
          >
            <MockOriginalPage page={page} zoom={zoom} />
          </Box>
        )}
      </Box>

      {/* RIGHT-SIDE BUTTONS */}
      <RightDockButtons
        timerBtnRef={timerBtnRef}
        onOpenTimer={openTimer}
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
      <AIModal open={ai.open} onClose={ai.onClose} />
      <VocabModal open={vocab.open} onClose={vocab.onClose} />
    </Box>
  );
}
