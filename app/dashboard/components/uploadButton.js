"use client";

import React, { useState, useRef } from "react";
import styles from "../dashboard.module.css";

export default function UploadButton({ onUpload, onNext }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const fileInputRef = useRef(null);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  function formatBytes(bytes, decimals = 2) {
    if (!bytes) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + "" + sizes[i];
  }

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = null;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = () => setSelectedFile(null);

  const goToOptions = () => {
    if (!selectedFile) return;
    setStep("options");
  };

  const handleBegin = () => {
    if (onNext) onNext(selectedFile, selectedOption);
    else if (selectedFile && onUpload) onUpload(selectedFile);
    setSelectedFile(null);
    setSelectedOption(null);
    setStep("upload");
    closeModal();
  };

  return (
    <div>
      <div className={styles.uploadButtonContainer} onClick={openModal}>
        <button className={styles.uploadButton}>+</button>
        <p className={styles.uploadButtonText}>Upload Document</p>
      </div>

      {open && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setSelectedFile(null);
            setSelectedOption(null);
            setStep("upload");
            closeModal();
          }}
        >
          <div
            className={selectedFile ? `${styles.modal} ${styles.modalHasFile}` : styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Upload dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} aria-label="Close dialog" onClick={closeModal}>
              ×
            </button>

            {step === "upload" && (
              <>
                <h2 className={styles.modalTitle}>Get started with accessible trade learning</h2>
                <p className={styles.modalSubtitle}>
                  Upload your study materials such as your notes, study cards, and other learning materials
                </p>

                <div className={styles.uploadBox}>
                  {selectedFile && (
                    <div className={styles.selectedFileRow}>
                      <button className={styles.selectedFileRemove} aria-label="Remove file" onClick={removeSelectedFile}>
                        −
                      </button>
                      <span className={styles.selectedFileIcon}>📄</span>
                      <a className={styles.selectedFileName} href="#" onClick={(e) => e.preventDefault()}>
                        {selectedFile.name}
                      </a>
                      <span className={styles.selectedFileSize}>({formatBytes(selectedFile.size)})</span>
                    </div>
                  )}

                  <div className={styles.uploadIconCircle}>
                    <img src="/icons/downloadIcon.svg" alt="upload" />
                  </div>

                  <h3 className={styles.uploadHeading}>Drag or tap to upload</h3>
                  <p className={styles.uploadSupport}>Supports PDF, Word documents, images, and text files</p>

                  <button className={styles.modalUploadBtn} type="button" onClick={handleUploadClick}>
                    Upload
                  </button>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                </div>

                <div style={{ marginTop: 24 }}>
                  <button className={styles.nextStepBtn} type="button" onClick={goToOptions} disabled={!selectedFile}>
                    Next Step
                  </button>
                </div>
              </>
            )}

            {step === "options" && (
              <>
                <h2 className={styles.modalTitle}>Choose how you'd like Got It to process your upload</h2>
                {selectedFile && (
                  <div className={styles.selectedFileRow} style={{ margin: "0 auto 24px auto" }}>
                    <span className={styles.selectedFileIcon}>📄</span>
                    <a className={styles.selectedFileName} href="#" onClick={(e) => e.preventDefault()}>
                      {selectedFile.name}
                    </a>
                    <span className={styles.selectedFileSize}>({formatBytes(selectedFile.size)})</span>
                  </div>
                )}

                <div className={styles.optionsGrid}>
                  {[
                    { id: "simplify", title: "Text Simplification", desc: "Simplifies complex language and clarifies jargon without losing any important information." },
                    { id: "summary", title: "Create Summary", desc: "Summarizes the document to help you understand key concepts in less time." },
                    { id: "mindmap", title: "Mind-map", desc: "Visualizes the structure of your document to help you organize and see how everything connects." },
                    { id: "all", title: "Apply All Features", desc: "Generates all features and organizes them into separate tabs" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${styles.optionCard} ${selectedOption === opt.id ? styles.optionSelected : ""}`}
                      onClick={() => setSelectedOption(opt.id)}
                    >
                      <div style={{ minHeight: 36 }}></div>
                      <div style={{ fontWeight: 700, marginTop: 12 }}>{opt.title}</div>
                      <div style={{ marginTop: 12, color: "#6b6b6b", textAlign: "left" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <div className={styles.bottomActions}>
                  <button className={styles.backBtnSmall} onClick={() => setStep("upload")}>Back to Upload</button>
                  <button className={styles.beginBtn} onClick={handleBegin} disabled={!selectedOption}>Begin Studying</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
