"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../mvp.module.css";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";

export default function ToolBar({
  page,
  onPrev,
  onNext,
  split,
  onToggleSplit,

  onToggleSidebar,
  totalPages,
  toolbarPlugin,
  zoomPlugin,
}) {
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#fff176");
  const [thickness, setThickness] = useState(2);
  const highlightBtnRef = useRef(null);
  const textBtnRef = useRef(null);
  const searchBtnRef = useRef(null);
  const [textMenuPos, setTextMenuPos] = useState({ left: 0, top: 0 });
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });

  // compute position when opened (center under the highlight button)
  useLayoutEffect(() => {
    if (!highlightOpen) return;
    const btn = highlightBtnRef.current;
    if (!btn || typeof window === "undefined") return;
    const rect = btn.getBoundingClientRect();
    const left = Math.round(rect.left + rect.width / 2);
    const top = Math.round(rect.bottom + 8);
    setMenuPos({ left, top });
  }, [highlightOpen]);

  const toggleHighlight = () => setHighlightOpen((v) => !v);

  // visual toggle state for toolbar icon buttons (keep purple when toggled)
  const [activeButtons, setActiveButtons] = useState({});
  const toggleBtn = (name) => {
    setActiveButtons((s) => ({ ...s, [name]: !s[name] }));
  };

  // text menu state (font size + bold/italic) for the text popup
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [pillFlash, setPillFlash] = useState(null);
  const pillTimeoutRef = useRef(null);

  useLayoutEffect(() => {
    if (!activeButtons.text) return;
    const btn = textBtnRef.current;
    if (!btn || typeof window === "undefined") return;
    const rect = btn.getBoundingClientRect();
    const left = Math.round(rect.left + rect.width / 2);
    const top = Math.round(rect.bottom + 8);
    setTextMenuPos({ left, top });
  }, [activeButtons.text]);

  // compute search menu position when search toggled on
  const [searchMenuPos, setSearchMenuPos] = useState({ left: 0, top: 0 });
  useLayoutEffect(() => {
    if (!activeButtons.search) return;
    const btn = searchBtnRef.current;
    if (!btn || typeof window === "undefined") return;
    const rect = btn.getBoundingClientRect();
    const left = Math.round(rect.left + rect.width / 2);
    const top = Math.round(rect.bottom + 8);
    setSearchMenuPos({ left, top });
  }, [activeButtons.search]);

  // four swatches: purple, yellow, green, red (in that order)
  const colorSwatches = ["#DDC3FE", "#FEF4C3", "#D0E6C1", "#F5C7A9"];

  // toolbar plugin rendering (if provided)
  const { Toolbar } = toolbarPlugin || {};

  return (
    <div className={`${styles.toolBar} ${styles.toolBarNoOffset}`}>
      <div className={styles.toolbarInner}>
        {/* Left Side */}
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.toolButton} ${
              activeButtons.sidebar ? styles.toolButtonActive : ""
            }`}
            onClick={() => {
              onToggleSidebar && onToggleSidebar();
              toggleBtn("sidebar");
            }}
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <img src="/icons/sideBarIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button
            className={`${styles.toolButton} ${
              split ? styles.toolButtonActive : ""
            }`}
            onClick={onToggleSplit}
            aria-pressed={split}
            title={split ? "Single View" : "Split View"}
          >
            <img
              src="/icons/sideCompareIcon.svg"
              className={styles.toolbarIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
          <button
            ref={searchBtnRef}
            className={`${styles.toolButton} ${
              activeButtons.search ? styles.toolButtonActive : ""
            }`}
            onClick={() => toggleBtn("search")}
            aria-haspopup="true"
            aria-expanded={!!activeButtons.search}
            title="Search"
          >
            <img src="/icons/searchIcon.svg" className={styles.toolbarIcon} />
          </button>
          {typeof document !== "undefined" &&
            activeButtons.search &&
            createPortal(
              <div
                className={styles.searchMenu}
                style={{
                  position: "fixed",
                  left: searchMenuPos.left + "px",
                  top: searchMenuPos.top + "px",
                  transform: "translateX(-50%)",
                }}
                role="dialog"
                aria-label="Document search"
              >
                <input
                  className={styles.searchInputSmall}
                  placeholder="Search in document..."
                />
                <button className={styles.searchHighlightBtn}>
                  Highlight All
                </button>
              </div>,
              document.body
            )}
          <button
            className={`${styles.iconBtn} ${styles.pageNavBtnPrev}`}
            onClick={onPrev}
            aria-label="Previous page"
          >
            <img
              src="/icons/arrowDown.svg"
              alt="Previous page"
              width="20"
              height="20"
            />
          </button>
          <input
            type="text"
            className={styles.pageInput}
            value={page}
            readOnly
            aria-label="Current page"
          />
          <span className={styles.pageText}>of {totalPages || ""}</span>
          <button
            className={`${styles.iconBtn} ${styles.pageNavBtnNext}`}
            onClick={onNext}
            aria-label="Next page"
          >
            <img
              src="/icons/arrowDown.svg"
              alt="Next page"
              width="20"
              height="20"
            />
          </button>
          <div className={styles.toolbarDivider} />
        </div>

        {/* Center: zoom controls */}
        <div className={styles.toolbarCenter}>
          {/* Integrated PDF toolbar (if provided) */}
          {Toolbar && (
            <div style={{ marginRight: 8 }}>
              <Toolbar />
            </div>
          )}

          <div
            className={styles.zoomGroup}
            role="group"
            aria-label="Zoom controls"
          >
            <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
              <button
                className={styles.zoomButton}
                onClick={() => {
                  zoomPlugin.zoomTo((z) =>
                    Math.max(0.5, +(z - 0.1).toFixed(2))
                  );
                }}
              >
                -
              </button>
              <div className={styles.zoomSeparator} />
              <button
                className={styles.zoomButton}
                onClick={() => {
                  if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                    zoomPlugin.zoomTo((z) =>
                      Math.min(3, +(z + 0.1).toFixed(2))
                    );
                  }
                }}
              >
                +
              </button>
            </div>
            <button
              className={styles.zoomDropdown}
              onClick={() => {
                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                  // reset to 100%
                  zoomPlugin.zoomTo(1);
                } else if (
                  zoomPlugin &&
                  typeof zoomPlugin.zoomTo === "function"
                ) {
                  zoomPlugin.zoomTo(SpecialZoomLevel.PageWidth);
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.toolbarRight}>
          <button
            ref={highlightBtnRef}
            className={`${styles.toolButton} ${
              activeButtons.highlight ? styles.toolButtonActive : ""
            }`}
            onClick={() => {
              toggleHighlight();
              toggleBtn("highlight");
            }}
            aria-expanded={highlightOpen}
            aria-haspopup="true"
            title="Highlight"
          >
            <img
              src="/icons/highlightIcon.svg"
              className={styles.toolbarIcon}
            />
          </button>
          {typeof document !== "undefined" &&
            highlightOpen &&
            createPortal(
              <div
                className={styles.highlightMenu}
                style={{
                  position: "fixed",
                  left: menuPos.left + "px",
                  top: menuPos.top + "px",
                  transform: "translateX(-50%)",
                }}
                role="menu"
              >
                <div className={styles.highlightTitle}>Highlight</div>
                <div className={styles.swatchesRow}>
                  {colorSwatches.map((c) => (
                    <button
                      key={c}
                      className={`${styles.swatch} ${
                        highlightColor === c ? styles.swatchSelected : ""
                      }`}
                      onClick={() =>
                        setHighlightColor(highlightColor === c ? "" : c)
                      }
                      style={{ background: c }}
                      aria-pressed={highlightColor === c}
                      aria-label={`Select ${c} highlight`}
                    >
                      <span className={styles.swatchLabel}>A</span>
                    </button>
                  ))}
                </div>
              </div>,
              document.body
            )}
          <button
            ref={textBtnRef}
            className={`${styles.toolButton} ${
              activeButtons.text ? styles.toolButtonActive : ""
            }`}
            onClick={() => toggleBtn("text")}
            title="Text"
            aria-haspopup="true"
            aria-expanded={!!activeButtons.text}
          >
            <img src="/icons/textIcon.svg" className={styles.toolbarIcon} />
          </button>
          <div className={styles.toolbarDivider} />
          {typeof document !== "undefined" &&
            activeButtons.text &&
            createPortal(
              <div
                className={styles.textMenu}
                style={{
                  position: "fixed",
                  left: textMenuPos.left + "px",
                  top: textMenuPos.top + "px",
                  transform: "translateX(-50%)",
                }}
                role="menu"
              >
                <div className={styles.textTitle}>Font Size</div>
                <div className={styles.textPillsRow}>
                  <button
                    className={`${styles.textPill} ${
                      pillFlash === "minus" ? styles.textPillActive : ""
                    }`}
                    onClick={() => {
                      setFontSize((s) => Math.max(8, s - 1));
                      setPillFlash("minus");
                      if (pillTimeoutRef.current) {
                        clearTimeout(pillTimeoutRef.current);
                      }
                      pillTimeoutRef.current = setTimeout(() => {
                        setPillFlash(null);
                        pillTimeoutRef.current = null;
                      }, 150);
                    }}
                  >
                    A-
                  </button>
                  <button
                    className={`${styles.textPill} ${
                      pillFlash === "plus" ? styles.textPillActive : ""
                    }`}
                    onClick={() => {
                      setFontSize((s) => Math.min(72, s + 1));
                      setPillFlash("plus");
                      if (pillTimeoutRef.current) {
                        clearTimeout(pillTimeoutRef.current);
                      }
                      pillTimeoutRef.current = setTimeout(() => {
                        setPillFlash(null);
                        pillTimeoutRef.current = null;
                      }, 150);
                    }}
                  >
                    A+
                  </button>
                </div>
                <div className={styles.thicknessTitle}>Letter Spacing</div>
                <div className={styles.thicknessRow}>
                  <div className={styles.smallCircle}>A</div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className={styles.thicknessSlider}
                  />
                  <div className={styles.bigCircle}>A</div>
                </div>

                <div className={styles.textTitle} style={{ marginTop: 12 }}>
                  Bold and Italic
                </div>
                <div className={styles.textControlsRow}>
                  <button
                    className={`${styles.textCircle} ${
                      isBold ? styles.textCircleActive : ""
                    }`}
                    onClick={() => setIsBold((b) => !b)}
                  >
                    B
                  </button>
                  <button
                    className={`${styles.textCircle} ${
                      isItalic ? styles.textCircleActive : ""
                    }`}
                    onClick={() => setIsItalic((i) => !i)}
                  >
                    <em>I</em>
                  </button>
                </div>
              </div>,
              document.body
            )}
          <button className={styles.toolButton}>
            <img src="/icons/downloadIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button className={styles.toolButton}>
            <img src="/icons/printIcon.svg" className={styles.toolbarIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
