"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";

export default function UploadButton({ onUpload }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleUploadClick = () => {
    if (onUpload) onUpload();
    closeModal();
  };

  return (
    <>
      <div className={styles.uploadButtonContainer} onClick={openModal}>
        <button className={styles.uploadButton}>+</button>
        <p className={styles.uploadButtonText}>Upload Document</p>
      </div>

      {open && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Upload dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              aria-label="Close dialog"
              onClick={closeModal}
            >
              ×
            </button>

            <h2 className={styles.modalTitle}>
              Get started with accessible trade learning
            </h2>
            <p className={styles.modalSubtitle}>
              Upload your study materials such as your notes, study cards, and
              other learning materials
            </p>

            <div className={styles.uploadBox}>
              <div className={styles.uploadIconCircle}>
                <img src="/icons/downloadIcon.svg" alt="upload" />
              </div>

              <h3 className={styles.uploadHeading}>Drag or tap to upload</h3>
              <p className={styles.uploadSupport}>
                Supports PDF, Word documents, images, and text files
              </p>

              <button
                className={styles.modalUploadBtn}
                type="button"
                onClick={handleUploadClick}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
