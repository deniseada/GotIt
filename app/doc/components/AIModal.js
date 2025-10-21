"use client";
import React from "react";
import styles from "../mvp.module.css";

export default function AIModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className={styles.aiPanel}>
      <div className={styles.aiPanelHeader}>
        <h3 className={styles.aiPanelTitle}>AI Study Tools</h3>
      </div>
      <div className={styles.aiPanelContent}>
        <button className={styles.aiToolButton}>
          <span className={styles.aiToolLabel}>Language Simplification</span>
        </button>
        <button className={styles.aiToolButton}>
          <span className={styles.aiToolLabel}>Create Summary</span>
        </button>
        <button className={styles.aiToolButton}>
          <span className={styles.aiToolLabel}>Mind-map</span>
        </button>
        <button className={styles.aiToolButton}>
          <span className={styles.aiToolLabel}>Citation</span>
        </button>
      </div>
    </div>
  );
}
