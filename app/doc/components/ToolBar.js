"use client";
import React from "react";
import Link from "next/link";
import styles from "../mvp.module.css";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ZoomControls from "./ZoomControls";

export default function ToolBar({
  page,
  onPrev,
  onNext,
  split,
  onToggleSplit,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleSidebar,
}) {
  return (
    // {/* Secondary toolbar row */}
    <div className={`${styles.toolBar} ${styles.toolBarNoOffset}`}>
      <div className={styles.toolbarInner}>
        {/* Left Side */}
        <div className={styles.toolbarLeft}>
          <button
            className={styles.toolButton}
            onClick={onToggleSidebar}
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
          <button className={styles.toolButton}>
            <img src="/icons/searchIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={onPrev}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className={styles.pageText}>{page} / 99</span>
          <button
            className={styles.iconBtn}
            onClick={onNext}
            aria-label="Next page"
          >
            ›
          </button>
        </div>

        {/* Center: zoom controls */}
        <div className={styles.toolbarCenter}>
          {/* Zoom group */}
          <div
            className={styles.zoomGroup}
            role="group"
            aria-label="Zoom controls"
          >
            <span className={styles.zoomText}>{Math.round(zoom * 100)}%</span>
            <button
              className={styles.toolButton}
              onClick={onZoomOut}
              title="Zoom out"
            >
              <ZoomOutIcon className={styles.toolbarSvg} />
              <span className={styles.srOnly}>Zoom out</span>
            </button>
            <button
              className={styles.toolButton}
              onClick={onZoomReset}
              title="Reset zoom"
            >
              <RestartAltIcon className={styles.toolbarSvg} />
              <span className={styles.srOnly}>Reset zoom</span>
            </button>
            <button
              className={styles.toolButton}
              onClick={onZoomIn}
              title="Zoom in"
            >
              <ZoomInIcon className={styles.toolbarSvg} />
              <span className={styles.srOnly}>Zoom in</span>
            </button>
          </div>
        </div>
        {/* Right Side */}
        <div className={styles.toolbarRight}>
          {/* your existing icons */}
          <button className={styles.toolButton}>
            <img
              src="/icons/highlightIcon.svg"
              className={styles.toolbarIcon}
            />
          </button>
          <button className={styles.toolButton}>
            <img src="/icons/textIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button className={styles.toolButton}>
            <img src="/icons/addPicIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button className={styles.toolButton}>
            <img src="/icons/printIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button className={styles.toolButton}>
            <img src="/icons/downloadIcon.svg" className={styles.toolbarIcon} />
          </button>
          <button className={styles.toolButton}>
            <img src="/icons/moreIcon.svg" className={styles.toolbarIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
