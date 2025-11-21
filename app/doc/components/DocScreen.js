"use client";
import SideBar from "./sideBar";
import React, { useState, useEffect, useRef, useMemo } from "react";
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

import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  createStore,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/search/lib/styles/index.css";
import { printPlugin } from "@react-pdf-viewer/print";
import "@react-pdf-viewer/print/lib/styles/index.css";
import { getFilePlugin } from "@react-pdf-viewer/get-file";

export default function DocScreen() {
  // create plugin instances once so Viewer and ToolBar share them

  const [split, setSplit] = useState(false);

  // Replace the old zoom plugin with a small custom plugin that exposes
  // a `zoomTo(scale)` method so we can programmatically zoom from outside
  // the Viewer (matches the react-pdf-viewer example).
  const createCustomZoomPlugin = () => {
    const store = createStore();

    // lightweight event emitter for scale changes
    // Start at 1.4 (which displays as 100%)
    let currentScale = 1.4;
    const listeners = new Set();
    const notify = (s) => {
      currentScale = s;
      listeners.forEach((l) => l(s));
    };

    const subscribe = (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    };

    // history stack to allow resetting to previous zoom level
    const history = [];

    return {
      install: (pluginFunctions) => {
        // store original functions but wrap them so we can capture scale
        const originalZoom = pluginFunctions.zoom;
        store.update("zoom", (scale) => {
          try {
            // push previous scale so reset can restore it
            if (typeof pluginFunctions.getCurrentScale === "function") {
              const prev = pluginFunctions.getCurrentScale();
              if (prev !== null && prev !== undefined) history.push(prev);
            } else {
              history.push(currentScale);
            }
          } catch (e) {
            history.push(currentScale);
          }

          originalZoom(scale);

          // Update immediately with the scale we're setting (for responsive UI)
          notify(scale);

          // Then try to read the actual numeric scale from the viewer
          // Use setTimeout to allow PDF viewer to update scale first
          setTimeout(() => {
            const s =
              typeof pluginFunctions.getCurrentScale === "function"
                ? pluginFunctions.getCurrentScale()
                : null;
            if (s !== null && s !== undefined && s !== scale) {
              notify(s);
            }
          }, 50);
        });

        if (typeof pluginFunctions.zoomIn === "function") {
          store.update("zoomIn", () => {
            try {
              const prev =
                typeof pluginFunctions.getCurrentScale === "function"
                  ? pluginFunctions.getCurrentScale()
                  : currentScale;
              history.push(prev);
            } catch (e) {
              history.push(currentScale);
            }
            pluginFunctions.zoomIn();
            setTimeout(() => {
              const s =
                typeof pluginFunctions.getCurrentScale === "function"
                  ? pluginFunctions.getCurrentScale()
                  : null;
              if (s !== null && s !== undefined) {
                notify(s);
              }
            }, 0);
          });
        }

        if (typeof pluginFunctions.zoomOut === "function") {
          store.update("zoomOut", () => {
            try {
              const prev =
                typeof pluginFunctions.getCurrentScale === "function"
                  ? pluginFunctions.getCurrentScale()
                  : currentScale;
              history.push(prev);
            } catch (e) {
              history.push(currentScale);
            }
            pluginFunctions.zoomOut();
            setTimeout(() => {
              const s =
                typeof pluginFunctions.getCurrentScale === "function"
                  ? pluginFunctions.getCurrentScale()
                  : null;
              if (s !== null && s !== undefined) {
                notify(s);
              }
            }, 0);
          });
        }

        // initialize scale if available
        if (typeof pluginFunctions.getCurrentScale === "function") {
          try {
            const s = pluginFunctions.getCurrentScale();
            if (s !== null && s !== undefined) notify(s);
          } catch (e) {
            // ignore
          }
        }
      },

      zoomTo: (scaleOrFn) => {
        const fn = store.get("zoom");
        if (!fn) return;
        
        // If a function is passed, get current scale and compute new scale
        if (typeof scaleOrFn === "function") {
          const current = currentScale;
          const newScale = scaleOrFn(current);
          fn(newScale);
        } else {
          fn(scaleOrFn);
        }
      },
      zoomIn: () => {
        const fn = store.get("zoomIn");
        if (fn) fn();
      },
      zoomOut: () => {
        const fn = store.get("zoomOut");
        if (fn) fn();
      },

      // return current numeric zoom level (e.g. 1 = 100%)
      getZoomLevel: () => currentScale,

      // reset to 100% (scale of 1.4, which displays as 100%)
      resetZoom: () => {
        // Use zoomTo to reset to 1.4, which will handle all the updates
        const fn = store.get("zoom");
        if (fn) {
          fn(1.4);
        }
      },

      // React component matching the zoom plugin API so ToolBar can render it
      CurrentScale: ({ children }) => {
        const [scale, setScale] = React.useState(currentScale || 1.4);
        React.useEffect(() => {
          const unsub = subscribe(setScale);
          return () => unsub();
        }, []);
        return children({ scale });
      },
    };
  };

  const zoomPluginInstance = useMemo(() => createCustomZoomPlugin(), []);
  // Call pageNavigationPlugin at top level - if it uses hooks internally,
  // this is required. We'll memoize the components we extract from it instead.
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const searchPluginInstance = searchPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin();
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("simplified");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSplit = () => setSplit((s) => !s);

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

  const aiBtnRef = useRef(null);
  const vocabBtnRef = useRef(null);
  const [textToSpeechPlaying, setTextToSpeechPlaying] = useState(false);
  const [totalPages, setTotalPages] = useState(99);

  // ===== MOCK CONTENT =====
  function MockOriginalPage({ page }) {
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
            maxWidth: "800px",
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
              defaultScale={1.4}
              plugins={[zoomPluginInstance, pageNavigationPluginInstance, searchPluginInstance, printPluginInstance, getFilePluginInstance].filter(Boolean)}
            />
          </Worker>
        </Box>
      </Box>
    );
  }

  function MockRightPane({ mode, page }) {
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
        split={split}
        onToggleSplit={toggleSplit}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        zoomPlugin={zoomPluginInstance}
        pageNavigationPlugin={pageNavigationPluginInstance}
        searchPlugin={searchPluginInstance}
        printPlugin={printPluginInstance}
        getFilePlugin={getFilePluginInstance}
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
            left={
              <MockOriginalPage
                page={page}
                onDocumentLoad={(e) => setTotalPages(e.doc.numPages)}
                onPageChange={(newPage) => setPage(newPage)}
              />
            }
            right={
              <Box
                sx={{
                  height: "100%",
                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                }}
              >
                <ModeTabs value={mode} onChange={setMode} />
                <MockRightPane mode={mode} page={page} />
              </Box>
            }
          />
        ) : (
          <Box>
            <MockOriginalPage
              page={page}
              onDocumentLoad={(e) => setTotalPages(e.doc.numPages)}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </Box>
        )}
      </Box>

      {/* RIGHT-SIDE BUTTONS */}
      <RightDockButtons
        timerBtnRef={timerBtnRef}
        onOpenTimer={openTimer}
        aiBtnRef={aiBtnRef}
        aiOpen={ai.open}
        onOpenB={() => (ai.open ? ai.onClose() : ai.onOpen())}
        vocabBtnRef={vocabBtnRef}
        onOpenC={() => (vocab.open ? vocab.onClose() : vocab.onOpen())}
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
      <VocabModal
        anchorEl={vocabBtnRef.current}
        open={vocab.open}
        onClose={vocab.onClose}
        onHide={vocab.onClose}
      />
      
      <AIModal
        anchorEl={aiBtnRef.current}
        open={ai.open}
        onClose={ai.onClose}
        onHide={ai.onClose}
      />

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
              <img
                src="/icons/speaking-head.svg"
                alt="Text to Speech"
                width="35"
                height="35"
              />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
