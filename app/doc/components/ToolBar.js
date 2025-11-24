"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
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
  pageNavigationPlugin,
  searchPlugin,
  printPlugin,
  getFilePlugin,
  onNavigateToPage,
  onTextStyleChange,
  fontSize: externalFontSize,
  letterSpacing: externalLetterSpacing,
}) {
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#fff176");
  const [thickness, setThickness] = useState(2);
  const highlightBtnRef = useRef(null);
  const textBtnRef = useRef(null);
  const searchBtnRef = useRef(null);
  const [textMenuPos, setTextMenuPos] = useState({ left: 0, top: 0 });
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });
  const [zoomDropdownOpen, setZoomDropdownOpen] = useState(false);
  const zoomDropdownRef = useRef(null);
  const [zoomMenuPos, setZoomMenuPos] = useState({ left: 0, top: 0 });

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

  // compute position for zoom dropdown
  useLayoutEffect(() => {
    if (!zoomDropdownOpen) return;
    const btn = zoomDropdownRef.current;
    if (!btn || typeof window === "undefined") return;
    const rect = btn.getBoundingClientRect();
    const left = Math.round(rect.left);
    const top = Math.round(rect.bottom + 4);
    setZoomMenuPos({ left, top });
  }, [zoomDropdownOpen]);

  // Close zoom dropdown when clicking outside
  useLayoutEffect(() => {
    if (!zoomDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (
        zoomDropdownRef.current &&
        !zoomDropdownRef.current.contains(e.target) &&
        !e.target.closest(`.${styles.zoomDropdownMenu}`)
      ) {
        setZoomDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [zoomDropdownOpen]);

  const toggleHighlight = () => setHighlightOpen((v) => !v);

  // visual toggle state for toolbar icon buttons (keep purple when toggled)
  const [activeButtons, setActiveButtons] = useState({});
  const toggleBtn = (name) => {
    setActiveButtons((s) => ({ ...s, [name]: !s[name] }));
  };

  // text menu state (font size + bold/italic) for the text popup
  const [fontSize, setFontSize] = useState(externalFontSize || 16);
  const [letterSpacing, setLetterSpacing] = useState(externalLetterSpacing || 0);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [pillFlash, setPillFlash] = useState(null);
  const pillTimeoutRef = useRef(null);

  // Sync with external props
  useEffect(() => {
    if (externalFontSize !== undefined) setFontSize(externalFontSize);
  }, [externalFontSize]);
  
  useEffect(() => {
    if (externalLetterSpacing !== undefined) setLetterSpacing(externalLetterSpacing);
  }, [externalLetterSpacing]);

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

  // page navigation plugin components (if provided)
  const {
    GoToFirstPage,
    GoToLastPage,
    GoToNextPage,
    GoToPreviousPage,
    CurrentPageLabel,
    CurrentPageInput,
  } = pageNavigationPlugin || {};

  // zoom plugin components (if provided)
  const CurrentScale = zoomPlugin?.CurrentScale;

  // search plugin components (if provided)
  const { ShowSearchPopover } = searchPlugin || {};

  // print plugin components (if provided)
  const { Print } = printPlugin || {};

  // get-file plugin components (if provided)
  const { Download } = getFilePlugin || {};

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
          {ShowSearchPopover ? (
            <ShowSearchPopover>
              {(props) => (
                <button
                  ref={searchBtnRef}
                  className={`${styles.toolButton} ${
                    activeButtons.search ? styles.toolButtonActive : ""
                  }`}
                  onClick={() => {
                    props.onClick();
                    toggleBtn("search");
                  }}
                  aria-haspopup="true"
                  aria-expanded={!!activeButtons.search}
                  title="Search"
                >
                  <img src="/icons/searchIcon.svg" className={styles.toolbarIcon} />
                </button>
              )}
            </ShowSearchPopover>
          ) : (
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
          )}

          {/* PAGE NAVIGATION */}
          {GoToPreviousPage && (
            <GoToPreviousPage>
              {(props) => (
                <button
                  className={`${styles.iconBtn} ${styles.pageNavBtnPrev}`}
                  onClick={props.onClick}
                  disabled={props.isDisabled}
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <img
                    src="/icons/arrowDown.svg"
                    alt="Previous page"
                    width="20"
                    height="20"
                  />
                </button>
              )}
            </GoToPreviousPage>
          )}
         
          {CurrentPageInput ? (
            <>
              <div className={styles.pageInputWrapper}>
                <CurrentPageInput />
              </div>
              {CurrentPageLabel ? (
                <CurrentPageLabel>
                  {({ numberOfPages }) => (
                    <span className={styles.pageText}>of {numberOfPages}</span>
                  )}
                </CurrentPageLabel>
              ) : (
                <span className={styles.pageText}>of {totalPages || ""}</span>
              )}
            </>
          ) : CurrentPageLabel ? (
            <CurrentPageLabel>
              {({ currentPage, numberOfPages }) => (
                <>
                  <input
                    type="text"
                    className={styles.pageInput}
                    value={currentPage + 1}
                    readOnly
                    aria-label="Current page"
                  />
                  <span className={styles.pageText}>of {numberOfPages}</span>
                </>
              )}
            </CurrentPageLabel>
          ) : (
            <>
              <input
                type="text"
                className={styles.pageInput}
                value={page}
                readOnly
                aria-label="Current page"
              />
              <span className={styles.pageText}>of {totalPages || ""}</span>
            </>
          )}
         
          {GoToNextPage && (
            <GoToNextPage>
              {(props) => (
                <button
                  className={`${styles.iconBtn} ${styles.pageNavBtnNext}`}
                  onClick={props.onClick}
                  disabled={props.isDisabled}
                  aria-label="Next page"
                  title="Next page"
                >
                  <img
                    src="/icons/arrowDown.svg"
                    alt="Next page"
                    width="20"
                    height="20"
                    style={{ transform: "rotate(0deg)" }}
                  />
                </button>
              )}
            </GoToNextPage>
          )}
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
            <div className={styles.zoomButtonsContainer}>
              <button
                className={styles.zoomButton}
                onClick={() => {
                  // Decrease by 10% of displayed percentage (0.14 scale units = 10% of 1.4)
                  // Min zoom: 50% displayed = 0.7 scale (0.5 * 1.4)
                  zoomPlugin.zoomTo((z) =>
                    Math.max(0.7, +(z - 0.14).toFixed(2))
                  );
                }}
              >
                -
              </button>
              <div className={styles.zoomSeparator} />
              <button
                className={styles.zoomButton}
                onClick={() => {
                  // Increase by 10% of displayed percentage (0.14 scale units = 10% of 1.4)
                  // Max zoom: 225% displayed = 3.15 scale (2.25 * 1.4)
                  zoomPlugin.zoomTo((z) =>
                    Math.min(3.15, +(z + 0.14).toFixed(2))
                  );
                }}
              >
                +
              </button>
            </div>
            {CurrentScale ? (
              <CurrentScale>
                {({ scale }) => {
                  const displayPercent = Math.round((scale / 1.4) * 100);
                  const currentZoomLabel = displayPercent === 100 ? "Automatic Zoom" : `${displayPercent}%`;
                  
                  return (
                    <>
                      <button
                        ref={zoomDropdownRef}
                        className={styles.zoomDropdown}
                        onClick={() => setZoomDropdownOpen((v) => !v)}
                        aria-expanded={zoomDropdownOpen}
                        aria-haspopup="true"
                      >
                        {currentZoomLabel}
                        <img
                          src="/icons/arrowDown.svg"
                          alt=""
                          style={{ marginLeft: "8px", width: "16px", height: "16px", verticalAlign: "middle" }}
                        />
                      </button>
                      {typeof document !== "undefined" &&
                        zoomDropdownOpen &&
                        createPortal(
                          <div
                            className={styles.zoomDropdownMenu}
                            style={{
                              position: "fixed",
                              left: zoomMenuPos.left + "px",
                              top: zoomMenuPos.top + "px",
                            }}
                            role="menu"
                          >
                            <button
                              className={`${styles.zoomMenuItem} ${
                                displayPercent === 100 ? styles.zoomMenuItemSelected : ""
                              }`}
                              onClick={() => {
                                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                                  zoomPlugin.zoomTo(1.4); // 100%
                                }
                                setZoomDropdownOpen(false);
                              }}
                            >
                              Automatic Zoom
                            </button>
                            <button
                              className={`${styles.zoomMenuItem} ${
                                displayPercent === 50 ? styles.zoomMenuItemSelected : ""
                              }`}
                              onClick={() => {
                                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                                  zoomPlugin.zoomTo(0.7); // 50% (0.7 / 1.4 = 0.5)
                                }
                                setZoomDropdownOpen(false);
                              }}
                            >
                              50%
                            </button>
                            <button
                              className={`${styles.zoomMenuItem} ${
                                displayPercent === 75 ? styles.zoomMenuItemSelected : ""
                              }`}
                              onClick={() => {
                                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                                  zoomPlugin.zoomTo(1.05); // 75% (1.05 / 1.4 = 0.75)
                                }
                                setZoomDropdownOpen(false);
                              }}
                            >
                              75%
                            </button>
                            <button
                              className={styles.zoomMenuItem}
                              onClick={() => {
                                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                                  zoomPlugin.zoomTo(1.4); // 100%
                                }
                                setZoomDropdownOpen(false);
                              }}
                            >
                              100%
                            </button>
                            <button
                              className={`${styles.zoomMenuItem} ${
                                displayPercent === 150 ? styles.zoomMenuItemSelected : ""
                              }`}
                              onClick={() => {
                                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                                  zoomPlugin.zoomTo(2.1); // 150% (2.1 / 1.4 = 1.5)
                                }
                                setZoomDropdownOpen(false);
                              }}
                            >
                              150%
                            </button>
                            <button
                              className={`${styles.zoomMenuItem} ${
                                displayPercent === 200 ? styles.zoomMenuItemSelected : ""
                              }`}
                              onClick={() => {
                                if (zoomPlugin && typeof zoomPlugin.zoomTo === "function") {
                                  zoomPlugin.zoomTo(2.8); // 200% (2.8 / 1.4 = 2.0)
                                }
                                setZoomDropdownOpen(false);
                              }}
                            >
                              200%
                            </button>
                          </div>,
                          document.body
                        )}
                    </>
                  );
                }}
              </CurrentScale>
            ) : (
              <button
                ref={zoomDropdownRef}
                className={styles.zoomDropdown}
                onClick={() => setZoomDropdownOpen((v) => !v)}
                aria-expanded={zoomDropdownOpen}
                aria-haspopup="true"
              >
                Automatic Zoom
                <img
                  src="/icons/arrowDown.svg"
                  alt=""
                  style={{ marginLeft: "8px", width: "16px", height: "16px", verticalAlign: "middle" }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.toolbarRight}>
          
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
                      const newSize = Math.max(8, fontSize - 1);
                      setFontSize(newSize);
                      if (onTextStyleChange) {
                        onTextStyleChange({ fontSize: newSize, letterSpacing });
                      }
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
                      const newSize = Math.min(72, fontSize + 1);
                      setFontSize(newSize);
                      if (onTextStyleChange) {
                        onTextStyleChange({ fontSize: newSize, letterSpacing });
                      }
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
                    min={-4}
                    max={4}
                    step={0.1}
                    value={letterSpacing}
                    onChange={(e) => {
                      const newSpacing = Number(e.target.value);
                      setLetterSpacing(newSpacing);
                      if (onTextStyleChange) {
                        onTextStyleChange({ fontSize, letterSpacing: newSpacing });
                      }
                    }}
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
                  <button
                    className={styles.resetButton}
                    onClick={() => {
                      const defaultFontSize = 16;
                      const defaultLetterSpacing = 0;
                      setFontSize(defaultFontSize);
                      setLetterSpacing(defaultLetterSpacing);
                      if (onTextStyleChange) {
                        onTextStyleChange({ fontSize: defaultFontSize, letterSpacing: defaultLetterSpacing });
                      }
                    }}
                    title="Reset to defaults"
                  >
                    Reset
                  </button>
                </div>
              </div>,
              document.body
            )}
          {Download ? (
            <Download>
              {(props) => (
                <button
                  className={styles.toolButton}
                  onClick={props.onClick}
                  title="Download"
                >
                  <img src="/icons/downloadIcon.svg" className={styles.toolbarIcon} />
                </button>
              )}
            </Download>
          ) : (
            <button className={styles.toolButton} title="Download">
              <img src="/icons/downloadIcon.svg" className={styles.toolbarIcon} />
            </button>
          )}
          {Print ? (
            <Print>
              {(props) => (
                <button
                  className={styles.toolButton}
                  onClick={props.onClick}
                  title="Print"
                >
                  <img src="/icons/printIcon.svg" className={styles.toolbarIcon} />
                </button>
              )}
            </Print>
          ) : (
            <button className={styles.toolButton} title="Print">
              <img src="/icons/printIcon.svg" className={styles.toolbarIcon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
