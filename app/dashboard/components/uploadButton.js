"use client";

import React, { useState, useRef } from "react";
import styles from "../dashboard.module.css";

export default function UploadButton({ onUpload, onNext }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
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

    // Validate that the file is a PDF
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      e.target.value = null;
      return;
    }

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
    if (onNext)
      onNext(
        selectedFile,
        // preserve backward-compat for single selection by sending a string when only one selected
        selectedOptions.length === 1 ? selectedOptions[0] : selectedOptions
      );
    else if (selectedFile && onUpload) onUpload(selectedFile);
    setSelectedFile(null);
    setSelectedOptions([]);
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
            setSelectedOptions([]);
            setStep("upload");
            closeModal();
          }}
        >
          <div
            className={
              selectedFile
                ? `${styles.modal} ${styles.modalHasFile}`
                : styles.modal
            }
            role="dialog"
            aria-modal="true"
            aria-label="Upload dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              aria-label="Close dialog"
              onClick={() => {
                setSelectedFile(null);
                setSelectedOptions([]);
                setStep("upload");
                closeModal();
              }}
            >
              ×
            </button>

            {step === "upload" && (
              <>
                <div className={styles.uploadContent}>
                  <h2 className={styles.modalTitle}>
                    Get started with accessible trade learning
                  </h2>
                  <p className={styles.modalSubtitle}>
                    Upload your study materials such as your notes, study cards,
                    and other learning materials
                  </p>

                  <div className={styles.uploadBox}>
                    {selectedFile && (
                      <div className={styles.selectedFileRow}>
                        <button
                          className={styles.selectedFileRemove}
                          aria-label="Remove file"
                          onClick={removeSelectedFile}
                        >
                          −
                        </button>
                        <span className={styles.selectedFileIcon}>
                          <img src="/icons/document.svg" alt="File" />
                        </span>
                        <a
                          className={styles.selectedFileName}
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          {selectedFile.name}
                        </a>
                        <span className={styles.selectedFileSize}>
                          ({formatBytes(selectedFile.size)})
                        </span>
                      </div>
                    )}

                    <div className={styles.uploadIconCircle}>
                      <img src="/icons/uploadIcon.svg" alt="upload" />
                    </div>

                    <h3 className={styles.uploadHeading}>
                      Drag or tap to upload
                    </h3>
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className={styles.nextStepContainer}>
                  <button
                    className={styles.nextStepBtn}
                    type="button"
                    onClick={goToOptions}
                    disabled={!selectedFile}
                  >
                    Next Step
                  </button>
                </div>
              </>
            )}

            {step === "options" && (
              <>
                <div className={styles.optionsContent}>
                  <h2 className={styles.modalTitle}>
                    Choose how you'd like Got It to process your upload
                  </h2>
                  {selectedFile && (
                    <div className={styles.selectedFileRowOptions}>
                      <span className={styles.selectedFileIcon}>
                        <img src="/icons/document.svg" alt="File" />
                      </span>
                      <a
                        className={styles.selectedFileName}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        {selectedFile.name}
                      </a>
                      <span className={styles.selectedFileSize}>
                        ({formatBytes(selectedFile.size)})
                      </span>
                    </div>
                  )}

                  <div className={styles.optionsGrid}>
                    {[
                      {
                        id: "simplify",
                        title: "Text Simplification",
                        desc: "Simplifies complex language and clarifies jargon without losing any important information.",
                        icon: (
                          <img src="/icons/Simplification.svg" alt="Simplify" />
                        ),
                      },
                      {
                        id: "summary",
                        title: "Create Summary",
                        desc: "Summarizes the document to help you understand key concepts in less time.",
                        icon: <img src="/icons/Summary.svg" alt="Summary" />,
                      },
                      {
                        id: "mindmap",
                        title: "Mind-map",
                        desc: "Visualizes the structure of your document to help you organize and see how everything connects.",
                        icon: <img src="/icons/Mindmap.svg" alt="Mind-map" />,
                      },
                      {
                        id: "all",
                        title: "Apply All Features",
                        desc: "Generates all features and organizes them into separate tabs",
                        icon: (
                          <img src="/icons/sparkles.svg" alt="All Features" />
                        ),
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`${styles.optionCard} ${
                          selectedOptions.includes(opt.id)
                            ? styles.optionSelected
                            : ""
                        }`}
                        onClick={() => {
                          // If 'all' is clicked, make it exclusive
                          if (opt.id === "all") {
                            setSelectedOptions(["all"]);
                            return;
                          }

                          // If 'all' is currently selected and user selects another option,
                          // remove 'all' and add the selected option
                          if (selectedOptions.includes("all")) {
                            setSelectedOptions([opt.id]);
                            return;
                          }

                          // Toggle regular option
                          if (selectedOptions.includes(opt.id)) {
                            setSelectedOptions((prev) =>
                              prev.filter((id) => id !== opt.id)
                            );
                          } else {
                            setSelectedOptions((prev) => [...prev, opt.id]);
                          }
                        }}
                      >
                        <div className={styles.optionCheckbox}>
                          <div
                            className={`${styles.checkbox} ${
                              selectedOptions.includes(opt.id)
                                ? styles.checkboxChecked
                                : ""
                            }`}
                          >
                            {selectedOptions.includes(opt.id) && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 3L4.5 8.5L2 6"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className={styles.optionIcon}>{opt.icon}</div>
                        <div className={styles.optionTitle}>{opt.title}</div>
                        <div className={styles.optionDesc}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.bottomActions}>
                  <button
                    className={styles.backBtnSmall}
                    onClick={() => setStep("upload")}
                  >
                    Back to Upload
                  </button>
                  <button
                    className={styles.beginBtn}
                    onClick={handleBegin}
                    disabled={selectedOptions.length === 0}
                  >
                    Begin Studying
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
