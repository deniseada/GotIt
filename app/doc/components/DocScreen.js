"use client";
import SideBar from "./sideBar";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import TimerCompletionDialog from "./TimerCompletionDialog";
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

import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

// Memoized PDF viewer component - moved outside to prevent re-renders
const MockOriginalPage = React.memo(function MockOriginalPage({
  page,
  plugins,
  onDocumentLoad,
  GoToPage,
  navigateToPageRef,
}) {
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
            initialPage={page - 1}
            plugins={plugins}
            onDocumentLoad={onDocumentLoad}
          />
        </Worker>
        {GoToPage && (
          <div style={{ display: "none" }}>
            <GoToPage>
              {(props) => {
                // Store the jumpToPage function in ref when available
                if (
                  props.jumpToPage &&
                  navigateToPageRef.current !== props.jumpToPage
                ) {
                  navigateToPageRef.current = props.jumpToPage;
                }
                return null;
              }}
            </GoToPage>
          </div>
        )}
      </Box>
    </Box>
  );
});

// Memoized right pane component - moved outside to prevent re-renders
const MockRightPane = React.memo(function MockRightPane({
  mode,
  simplifiedText,
  aiLoading,
  aiError,
  textFontSize,
  textLetterSpacing,
  simplifiedFormats,
  setSimplifiedFormats,
  summary,
  summaryFormats,
  setSummaryFormats,
  mindmap,
}) {
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
          <div>
            <b>Main Points:</b>
              <ul>
                <li>The atom is the smallest part of an element.</li> 
                <li>The three principal parts of an atom are the proton, the electron, and the neutron.</li>
                <li>Protons have a positive charge, electrons a negative charge, and neutrons no charge.</li>
                <li>Valence electrons are located in the outer orbit of an atom.</li>
                <li>Conductors are materials that provide an easy path for electron flow.</li>
                <li>Conductors are made from materials that contain from one to three valence electrons.</li>
                <li>Insulators are materials that do not provide an easy path for the flow of electrons.</li>
                <li>Insulators are generally made from materials containing seven or eight valence electrons.</li>
              </ul>
              
              <b>Key Concepts:</b>
                <ul>
                  <li>Atomic structure</li>
                  <li>Protons, electrons, and neutrons</li>
                  <li>Valence electrons</li>
                  <li>Conductors and insulators</li>
                  <li>Electron flow</li>
                </ul>

              <b>Important Definitions:</b>
                <ul>
                  <li>Atom: The smallest part of an element.</li>
                  <li>Proton: A positively charged particle located in the nucleus of an atom.</li>
                  <li>Electron: A negatively charged particle that orbits the nucleus of an atom.</li>
                  <li>Neutron: A particle with no charge that is located in the nucleus of an atom.</li>
                  <li>Valence electrons: Electrons located in the outer orbit of an atom.</li>
                  <li>Conductor: A material that provides an easy path for electron flow.</li>
                  <li>Insulator: A material that does not provide an easy path for the flow of electrons.</li>
                </ul>
          </div>

          <Simplification 
            text={simplifiedText}
            loading={aiLoading.simplify}
            error={aiError.simplify}
            fontSize={textFontSize}
            letterSpacing={textLetterSpacing}
            formats={simplifiedFormats}
            onFormatsChange={setSimplifiedFormats}
            onApplyFormat={(format) => {
              const selection = window.getSelection();
              if (selection.rangeCount === 0) return;

              const range = selection.getRangeAt(0);
              const start = range.startOffset;
              const end = range.endOffset;
              const textNode = range.startContainer;

              if (textNode.nodeType === Node.TEXT_NODE) {
                const newFormat = { start, end, ...format };
                setSimplifiedFormats((prev) => [...prev, newFormat]);
              }
            }}
          />
        </>
      )}
      {mode === "summarized" && (
        <div>
          <b>Summary:</b>
          <p>
            Delmar - Section 1 introduces the concept of electricity, its history, and its importance in modern life. It explains the basic principles of electricity, including voltage, current, and resistance, and how they relate to Ohm's Law. The section also covers different types of circuits, including series and parallel, and the role of components like resistors, capacitors, and inductors. It discusses power in electrical circuits, both in terms of instantaneous and average power, and introduces the concept of electrical energy. The section also touches on electrical safety and the use of circuit breakers and fuses. Lastly, it provides an overview of electrical systems in homes and buildings, including the electrical service entrance, service panel, and branch circuits.
          </p>
          <Summarization 
            text={summary}
            loading={aiLoading.summarize}
            error={aiError.summarize}
            fontSize={textFontSize}
            letterSpacing={textLetterSpacing}
            formats={summaryFormats}
            onFormatsChange={setSummaryFormats}
            onApplyFormat={(format) => {
              const selection = window.getSelection();
              if (selection.rangeCount === 0) return;

              const range = selection.getRangeAt(0);
              const start = range.startOffset;
              const end = range.endOffset;
              const textNode = range.startContainer;

              if (textNode.nodeType === Node.TEXT_NODE) {
                const newFormat = { start, end, ...format };
                setSummaryFormats((prev) => [...prev, newFormat]);
              }
            }}
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
});

// Color picker component - moved outside to prevent re-renders
const ColorPickerMenu = React.memo(function ColorPickerMenu({ onDone, onCancel, initialColor }) {
  const [localSelectedColor, setLocalSelectedColor] = useState(initialColor);

  // Color options matching the image
  const colorOptions = [
    { color: "#DDC3FE", label: "Purple" }, // Light purple
    { color: "#FEF4C3", label: "Yellow" }, // Light yellow
    { color: "#D0E6C1", label: "Green" }, // Light green
    { color: "#F5C7A9", label: "Orange" }, // Light orange
  ];

  const handleDone = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDone(localSelectedColor);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onCancel();
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
        minWidth: "200px",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#333",
          marginBottom: "12px",
        }}
      >
        Highlight
      </div>

      {/* Color options */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        {colorOptions.map((option) => (
          <button
            key={option.color}
            onClick={(e) => {
              e.stopPropagation();
              setLocalSelectedColor(option.color);
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              border:
                localSelectedColor === option.color
                  ? "2px solid #522A70"
                  : "2px solid rgb(186, 186, 186)",
              background: option.color,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 600,
              color: "#333",
            }}
          ></button>
        ))}
      </div>

      {/* Done and Cancel buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handleCancel}
          style={{
            background: "var(--background)",
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', system-ui, -apple-system, sans-serif",
            color: "#333",
            border: ".5px solid #ddd",
            borderRadius: "6px",
            padding: "6px 16px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDone}
          style={{
            background: "#522A70",
            color: "#fff",
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', system-ui, -apple-system, sans-serif",
            border: "none",
            borderRadius: "6px",
            padding: "6px 16px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3d1f52";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#522A70";
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
});

export default function DocScreen() {
  // ========== ALL HOOKS MUST BE DECLARED AT THE TOP ==========
  // useState hooks
  const [split, setSplit] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("simplified");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [textFontSize, setTextFontSize] = useState(16);
  const [textLetterSpacing, setTextLetterSpacing] = useState(0);
  const [simplifiedFormats, setSimplifiedFormats] = useState([]);
  const [summaryFormats, setSummaryFormats] = useState([]);
  const [simplifiedText, setSimplifiedText] = useState("");
  const [summary, setSummary] = useState("");
  const [mindmap, setMindmap] = useState("");
  const [aiLoading, setAiLoading] = useState({
    simplify: false,
    summarize: false,
    mindmap: false,
  });
  const [aiError, setAiError] = useState({
    simplify: null,
    summarize: null,
    mindmap: null,
  });
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [originalTimerMinutes, setOriginalTimerMinutes] = useState(0);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [textToSpeechPlaying, setTextToSpeechPlaying] = useState(false);
  const [totalPages, setTotalPages] = useState(99);

  // useRef hooks
  const highlightIdRef = useRef(0);
  const currentSelectionColorRef = useRef("#FFF9C4");
  const navigateToPageRef = useRef(null);
  const highlightsRef = useRef(highlights);
  const timerBtnRef = useRef(null);
  const aiBtnRef = useRef(null);
  const vocabBtnRef = useRef(null);

  // Custom hooks
  const ai = useModal(false);
  const vocab = useModal(false);

  // useCallback hooks
  const handleDocumentLoad = useCallback((e) => {
    setTotalPages(e.doc.numPages);
  }, []);

  // Keep highlightsRef in sync with state
  highlightsRef.current = highlights;

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

  // Create plugin instances - these are designed to be created each render
  // The Viewer component handles the actual stability
  const zoomPluginInstance = createCustomZoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const searchPluginInstance = searchPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin();
  const { GoToPage } = pageNavigationPluginInstance || {};

  // Highlight plugin render functions
  const renderHighlightTarget = (props) => {
    const handleDone = (selectedColor) => {
      const newHighlight = {
        id: highlightIdRef.current++,
        highlightAreas: props.highlightAreas,
        selectedText: props.selectedText,
        color: selectedColor,
      };
      setHighlights((prev) => [...prev, newHighlight]);
      props.cancel();
    };

    const handleCancel = () => {
      props.cancel();
    };

    const leftPos = Math.max(0, Math.min(props.selectionRegion.left, 85));
    const topPos = props.selectionRegion.top + props.selectionRegion.height;

    return (
      <div
        style={{
          position: "absolute",
          left: `${leftPos}%`,
          top: `${topPos}%`,
          transform: "translate(0, 8px)",
          zIndex: 99999,
          pointerEvents: "auto",
        }}
      >
        <ColorPickerMenu
          onDone={handleDone}
          onCancel={handleCancel}
          initialColor={currentSelectionColorRef.current}
        />
      </div>
    );
  };

  const renderHighlights = (props) => (
    <div>
      {highlights.map((highlight) => (
        <React.Fragment key={highlight.id}>
          {highlight.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: highlight.color || "#d0ff00",
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation)
                )}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  // Create highlight plugin - designed to be created each render
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlights,
    trigger: Trigger.TextSelection,
  });

  // Create plugins array for the Viewer
  const plugins = [
    highlightPluginInstance,
    zoomPluginInstance,
    pageNavigationPluginInstance,
    searchPluginInstance,
    printPluginInstance,
    getFilePluginInstance,
  ];

  // Navigate to page when page state changes
  useEffect(() => {
    if (navigateToPageRef.current) {
      // jumpToPage expects 0-based index
      navigateToPageRef.current(page - 1);
    } else if (pageNavigationPluginInstance?.jumpToPage) {
      // Fallback: try direct method if available
      pageNavigationPluginInstance.jumpToPage(page - 1);
    }
  }, [page, pageNavigationPluginInstance]);

  const toggleSplit = () => setSplit((s) => !s);

  // Press 'S' to toggle split view
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "s") setSplit((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ===== TIMER (single source of truth) =====
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
    setOriginalTimerMinutes(0);
    setCompletionDialogOpen(false); // close dialog if open
  };

  // Choosing a time from presets
  const handleTimerChange = (mins) => {
    const secs = Math.max(0, mins * 60);
    setTimerSeconds(secs);
    setOriginalTimerMinutes(mins); // store original duration
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

  // Stop at 0 and show completion popup
  useEffect(() => {
    if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Show completion popup if timer was actually set (not just reset)
      if (originalTimerMinutes > 0) {
        setCompletionDialogOpen(true);
      }
    }
  }, [timerSeconds, timerRunning, originalTimerMinutes]);

  // AI Feature Handlers
  const SIMPLIFY_PROMPT =
    "Simplify all parts of Delmar - Section 1 into: main points, key concepts, important definitions. Ignore any figures, images, and page numbers.";
  const SUMMARIZE_PROMPT =
    "Summarize Delmar - Section 1 into a concise summary. Only return the answer.";
  const MINDMAP_PROMPT =
    "topic: atoms, return the json formatted array of nodes and edges";

  // Clean the text to remove unnecessary characters
  const cleanText = (text) => {
    if (!text) return "";
    let cleaned = text;
    // Remove **
    cleaned = cleaned.replace(/\*\*/g, "");
    // Replace * with -
    cleaned = cleaned.replace(/\*/g, "-");
    cleaned = cleaned.replace(/\+/g, "");
    cleaned = cleaned.replace(/\bN\b/g, "");
    cleaned = cleaned.replace(/(\n\s*){3,}/g, "\n\n");
    return cleaned.trim();
  };

  const cleanMindMapText = (text) => {
    if (!text) return "";
    let cleaned = text;
    cleaned = cleaned.replace(/\\/g, "");
    // Commented these out for now
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
    setAiLoading((prev) => ({ ...prev, simplify: true }));
    setAiError((prev) => ({ ...prev, simplify: null }));
    setSimplifiedText("");
    ai.onClose(); // Close the modal
    
    // Open split view and set mode immediately
    setMode("simplified");
    if (!split) setSplit(true);

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
        const errorDetails = errorData.details
          ? `\n\nDetails: ${errorData.details}`
          : "";
        throw new Error(errorMessage + errorDetails);
      }

      const result = await response.json();
      const rawContent =
        result.text || result.content || JSON.stringify(result, null, 2);
      const simplifiedContent = cleanText(rawContent);
      setSimplifiedText(simplifiedContent);
    } catch (err) {
      setAiError((prev) => ({ ...prev, simplify: err.message }));
      console.error("Error simplifying text:", err);
    } finally {
      setAiLoading((prev) => ({ ...prev, simplify: false }));
    }
  };

  const handleSummarize = async () => {
    setAiLoading((prev) => ({ ...prev, summarize: true }));
    setAiError((prev) => ({ ...prev, summarize: null }));
    setSummary("");
    ai.onClose(); // Close the modal
    
    // Open split view and set mode immediately
    setMode("summarized");
    if (!split) setSplit(true);

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
        const errorDetails = errorData.details
          ? `\n\nDetails: ${errorData.details}`
          : "";
        throw new Error(errorMessage + errorDetails);
      }

      const result = await response.json();
      const rawContent =
        result.text || result.content || JSON.stringify(result, null, 2);
      const cleanedContent = cleanText(rawContent);
      setSummary(cleanedContent);
    } catch (err) {
      setAiError((prev) => ({ ...prev, summarize: err.message }));
      console.error("Error summarizing text:", err);
    } finally {
      setAiLoading((prev) => ({ ...prev, summarize: false }));
    }
  };

  const handleMindMap = async () => {
    setAiLoading((prev) => ({ ...prev, mindmap: true }));
    setAiError((prev) => ({ ...prev, mindmap: null }));
    setMindmap("");
    ai.onClose(); // Close the modal
    
    // Open split view and set mode immediately
    setMode("mindmap");
    if (!split) setSplit(true);

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
        const errorDetails = errorData.details
          ? `\n\nDetails: ${errorData.details}`
          : "";
        throw new Error(errorMessage + errorDetails);
      }

      const result = await response.json();
      const rawContent =
        result.text || result.content || JSON.stringify(result, null, 2);
      const cleanedContent = cleanMindMapText(rawContent);
      setMindmap(cleanedContent);
    } catch (err) {
      setAiError((prev) => ({ ...prev, mindmap: err.message }));
      console.error("Error fetching mind map:", err);
    } finally {
      setAiLoading((prev) => ({ ...prev, mindmap: false }));
    }
  };

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
        onNavigateToPage={(pageNum) => {
          setPage(pageNum);
          // Also use the plugin's jumpToPage if available
          if (
            pageNavigationPluginInstance?.jumpToPage &&
            typeof pageNavigationPluginInstance.jumpToPage === "function"
          ) {
            pageNavigationPluginInstance.jumpToPage(pageNum - 1);
          }
        }}
        searchPlugin={searchPluginInstance}
        printPlugin={printPluginInstance}
        getFilePlugin={getFilePluginInstance}
        fontSize={textFontSize}
        letterSpacing={textLetterSpacing}
        onTextStyleChange={({ fontSize, letterSpacing }) => {
          setTextFontSize(fontSize);
          setTextLetterSpacing(letterSpacing);
        }}
        onApplyTextFormat={(format) => {
          // Apply format to the currently active mode
          const selection = window.getSelection();
          if (selection.rangeCount === 0 || selection.toString().trim() === "")
            return;

          const range = selection.getRangeAt(0);
          const selectedText = selection.toString();

          if (mode === "simplified") {
            const simplificationElement = document.querySelector(
              '[data-ai-output="simplification"]'
            );
            if (
              simplificationElement &&
              simplificationElement.contains(range.commonAncestorContainer)
            ) {
              const fullText = simplifiedText;
              // Find the selection in the original text
              const start = fullText.indexOf(selectedText, 0);
              if (start >= 0) {
                const end = start + selectedText.length;
                setSimplifiedFormats((prev) => {
                  // Remove any existing formats that overlap with this range
                  const filtered = prev.filter(
                    (f) => !(f.start < end && f.end > start)
                  );
                  // Add the new format
                  return [...filtered, { start, end, ...format }];
                });
              }
            }
          } else if (mode === "summarized") {
            const summaryElement = document.querySelector(
              '[data-ai-output="summarization"]'
            );
            if (
              summaryElement &&
              summaryElement.contains(range.commonAncestorContainer)
            ) {
              const fullText = summary;
              const start = fullText.indexOf(selectedText, 0);
              if (start >= 0) {
                const end = start + selectedText.length;
                setSummaryFormats((prev) => {
                  // Remove any existing formats that overlap with this range
                  const filtered = prev.filter(
                    (f) => !(f.start < end && f.end > start)
                  );
                  // Add the new format
                  return [...filtered, { start, end, ...format }];
                });
              }
            }
          }
        }}
        onResetFormats={() => {
          setSimplifiedFormats([]);
          setSummaryFormats([]);
        }}
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
        {sidebarOpen && (
          <SideBar
            onNavigateToPage={(pageNum) => {
              setPage(pageNum);
            }}
          />
        )}
        {split ? (
          <SplitView
            left={
              <MockOriginalPage
                page={page}
                plugins={plugins}
                onDocumentLoad={handleDocumentLoad}
                GoToPage={GoToPage}
                navigateToPageRef={navigateToPageRef}
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
                <MockRightPane
                  mode={mode}
                  simplifiedText={simplifiedText}
                  aiLoading={aiLoading}
                  aiError={aiError}
                  textFontSize={textFontSize}
                  textLetterSpacing={textLetterSpacing}
                  simplifiedFormats={simplifiedFormats}
                  setSimplifiedFormats={setSimplifiedFormats}
                  summary={summary}
                  summaryFormats={summaryFormats}
                  setSummaryFormats={setSummaryFormats}
                  mindmap={mindmap}
                />
              </Box>
            }
          />
        ) : (
          <Box>
            <MockOriginalPage
              page={page}
              plugins={plugins}
              onDocumentLoad={handleDocumentLoad}
              GoToPage={GoToPage}
              navigateToPageRef={navigateToPageRef}
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
        onSimplify={handleSimplify}
        onSummarize={handleSummarize}
        onMindMap={handleMindMap}
        loading={aiLoading}
        onHide={ai.onClose}
      />

      {/* Timer Completion Dialog */}
      <TimerCompletionDialog
        open={completionDialogOpen}
        onClose={() => setCompletionDialogOpen(false)}
        minutes={originalTimerMinutes}
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
