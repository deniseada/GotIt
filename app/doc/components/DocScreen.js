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
            <Typography variant="h5" gutterBottom>
              {page}. Atoms
            </Typography>
            <ul style={{ marginTop: 0 }}>
              <li>Everything is made of atoms.</li>
              <li>
                Atoms have protons (+), neutrons (no charge), and electrons (–).
              </li>
              <li>Protons + Neutrons = Nucleus (center of atom).</li>
              <li>Electrons move around the nucleus.</li>
              <li>The number of protons = the element (e.g., oxygen has 8).</li>
            </ul>
            <ul>
              <Typography variant="h5" gutterBottom>
                Law of Charges
              </Typography>
              <li>Opposites attract ( + & – ).</li>
              <li>Likes repel ( + & + or – & – ).</li>
              <li>
                The nucleus stays together because of a strong force called the
                gluon force.
              </li>
            </ul>
            <Typography variant="caption" color="text.secondary">
              Zoom: {(zoom * 100).toFixed(0)}%
            </Typography>
          </>
        )}
        {mode === "summarized" && (
          <Typography variant="body6" gutterBottom>
            Summary
            <br></br>
            This text explains that everything in the universe is made of atoms,
            which are tiny particles containing protons, neutrons, and
            electrons. Protons and neutrons form the nucleus at the center of
            the atom, while electrons move around it. The number of protons
            determines what element the atom is. Protons have a positive charge,
            electrons a negative charge, and neutrons no charge. Because
            opposite charges attract and like charges repel, electrons stay near
            the positively charged nucleus. The nucleus itself stays together
            because of a powerful force called the strong nuclear force, carried
            by particles known as gluons.
          </Typography>
        )}
        {mode === "mindmap" && (
          <img
            src="/icons/Mind_Map_Example.png"
            alt="mind-map"
            height="700px"
            width="700px"
          />
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
