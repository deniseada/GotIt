"use client";
import React, { useState } from "react";
import styles from "./StudyGuideButton.module.css";
import StudyGuideModal from "./StudyGuideModal";

export default function StudyGuideButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className={styles.studyGuideButton} onClick={handleClick}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.plusIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className={styles.buttonText}>Study Guide</span>
      </button>
      <StudyGuideModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
