"use client";
import React from "react";
import styles from "../homepage.module.css";

/**
 * HoverSwap
 * - Static magenta background rectangle (690x905px, rotated -2.12°)
 * - Two stacked SVGs that swap on hover.
 */
export default function HoverSwap() {
  return (
    <div
      className={styles.swap}
      tabIndex={0}
      aria-label="Preview document (hover or focus to switch)"
    >
      {/* static background rectangle */}
      <div className={styles.swapBackground}></div>

      {/* front and back SVG images */}
      <img
        src="/icons/paper-front.svg"
        alt="Paper Front"
        className={`${styles.img} ${styles.front}`}
      />
      <img
        src="/icons/paper-back.svg"
        alt="Paper Back"
        className={`${styles.img} ${styles.back}`}
      />
    </div>
  );
}
