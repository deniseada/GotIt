"use client";

import React, { useState } from "react";
import styles from "./StudyGuideModal.module.css";
import sharedStyles from "../dashboard.module.css";

export default function StudyGuideModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  
  // Step 1 data
  const [studyGuideName, setStudyGuideName] = useState("Midterm Exam");
  const [searchQuery, setSearchQuery] = useState("");
  const [chosenTopics, setChosenTopics] = useState([
    "Delmar's Standard Textbook for Electricity",
  ]);
  const [recentTopics] = useState([
    "Delmar's Standard Textbook for Electricity",
    "Basic Motor Controls",
  ]);
  
  // Step 2 data
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Step 3 data
  const [dailyCommitment, setDailyCommitment] = useState(null);

  // Helper function to convert date string to yyyy-mm-dd format for date input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    // If already in yyyy-mm-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return "";
  };

  const handleStartDateChange = (e) => {
    const dateStr = e.target.value;
    setStartDate(dateStr);
    
    // If end date exists and is before new start date, reset it
    if (endDate && dateStr && dateStr > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Calculate days between start and end date
  const calculateDays = () => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate difference in milliseconds
    const diffTime = end - start;
    
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays : null;
  };

  const handleAddTopic = (topic) => {
    if (!chosenTopics.includes(topic)) {
      setChosenTopics([...chosenTopics, topic]);
    }
  };

  const handleRemoveTopic = (topic) => {
    setChosenTopics(chosenTopics.filter((t) => t !== topic));
  };

  const handleNext = () => {
    if (step === 1) {
      if (chosenTopics.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      // Validate that end date is not before start date
      if (startDate && endDate && startDate > endDate) {
        alert("End date cannot be before start date. Please select a valid date range.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // TODO: Handle final step or submission
      console.log("All data:", {
        studyGuideName,
        chosenTopics,
        startDate,
        startTime,
        endDate,
        endTime,
        dailyCommitment,
      });
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleClose = () => {
    // Reset all states when closing
    setStep(1);
    setStudyGuideName("Midterm Exam");
    setSearchQuery("");
    setChosenTopics(["Delmar's Standard Textbook for Electricity"]);
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setDailyCommitment(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Create Study Guide dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.modalClose}
          aria-label="Close dialog"
          onClick={handleClose}
        >
          ×
        </button>

        <div className={styles.studyGuideContent}>
          {/* Header */}
          <div className={styles.studyGuideHeader}>
            <h2 className={styles.studyGuideTitle}>Create Study Guide</h2>
            <div className={styles.progressLine}>
              <div 
                className={styles.progressLineActive}
                style={{ 
                  width: step === 1 ? "33%" : step === 2 ? "66%" : step === 3 ? "100%" : "0%" 
                }}
              ></div>
              <div className={styles.progressLineInactive}></div>
            </div>
          </div>

          {step === 1 && (
            <>
              {/* Name your study guide */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Name your study guide</label>
                <input
                  type="text"
                  className={styles.studyGuideInput}
                  value={studyGuideName}
                  onChange={(e) => setStudyGuideName(e.target.value)}
                  placeholder="Midterm Exam"
                />
              </div>

              {/* What topics are on your exam? */}
              <div className={styles.formSection}>
                <div className={styles.formRow}>
                  <label className={styles.formLabelInline}>
                    What topics are on your exam?
                  </label>
                  <div className={sharedStyles.searchInputWrapper} style={{ marginTop: 0, width: "100%" }}>
                    <div className={sharedStyles.searchIcon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="9"
                          cy="9"
                          r="6"
                          stroke="#6b7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="m15 15-3.5-3.5"
                          stroke="#6b7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className={sharedStyles.searchInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for your topic"
                    />
                  </div>
                </div>
              </div>

              {/* Recently opened */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>Recently opened</h3>
                <div className={styles.topicsGrid}>
                  {recentTopics.map((topic, index) => (
                    <div key={index} className={styles.topicCard}>
                      <p className={styles.topicCardText}>{topic}</p>
                      <button
                        className={styles.topicCardAddBtn}
                        onClick={() => handleAddTopic(topic)}
                        aria-label="Add topic"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 4V12M4 8H12"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chosen topics */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionHeading}>Chosen topics</h3>
                <div className={styles.topicsGrid}>
                  {chosenTopics.length > 0 ? (
                    chosenTopics.map((topic, index) => (
                      <div key={index} className={styles.topicCard}>
                        <p className={styles.topicCardText}>{topic}</p>
                        <button
                          className={styles.topicCardRemoveBtn}
                          onClick={() => handleRemoveTopic(topic)}
                          aria-label="Remove topic"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 8H12"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyState}>No topics chosen yet</p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Step 2 Content */}
              <div className={styles.step2Content}>
                <h3 className={styles.step2Question}>What study times work best?</h3>
                <p className={styles.step2Subtitle}>
                  Select your date range to see how much study time you have.
                </p>

                <div className={styles.dateTimeGrid}>
                  <div className={styles.dateTimeField}>
                    <label className={styles.dateTimeLabel}>
                      Start date<span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      className={styles.dateTimeInput}
                      value={formatDateForInput(startDate)}
                      onChange={handleStartDateChange}
                    />
                  </div>

                  <div className={styles.dateTimeField}>
                    <label className={styles.dateTimeLabel}>
                      Start time<span className={styles.required}>*</span>
                    </label>
                    <input
                      type="time"
                      className={styles.dateTimeInput}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className={styles.dateTimeField}>
                    <label className={styles.dateTimeLabel}>
                      End date<span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      className={styles.dateTimeInput}
                      value={formatDateForInput(endDate)}
                      onChange={handleEndDateChange}
                      min={startDate ? formatDateForInput(startDate) : undefined}
                    />
                  </div>

                  <div className={styles.dateTimeField}>
                    <label className={styles.dateTimeLabel}>
                      End time<span className={styles.required}>*</span>
                    </label>
                    <input
                      type="time"
                      className={styles.dateTimeInput}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Display days calculation */}
                {startDate && endDate && calculateDays() !== null && (
                  <div className={styles.daysCalculation}>
                    <p className={styles.daysCalculationText}>
                      You have <span className={styles.daysNumber}>{calculateDays()}</span> day{calculateDays() !== 1 ? 's' : ''} to study until <span className={styles.eventName}>{studyGuideName}</span> event
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Step 3 Content */}
              <div className={styles.step2Content}>
                <h3 className={styles.step2Question}>How much time can you commit daily?</h3>
                <p className={styles.step2Subtitle}>
                  Choose a realistic study duration you can maintain.
                </p>

                <div className={styles.commitmentGrid}>
                  <button
                    type="button"
                    className={`${styles.commitmentCard} ${
                      dailyCommitment === "light" ? styles.commitmentCardSelected : ""
                    }`}
                    onClick={() => setDailyCommitment("light")}
                  >
                    <div className={styles.commitmentCheckbox}>
                      {dailyCommitment === "light" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 4L6 11L3 8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className={styles.commitmentIcon}>
                      {/* Placeholder for beaker icon - user will replace later */}
                      <div className={styles.iconPlaceholder}>⚗️</div>
                    </div>
                    <div className={styles.commitmentTitle}>Light</div>
                    <div className={styles.commitmentDuration}>1 hour/day</div>
                  </button>

                  <button
                    type="button"
                    className={`${styles.commitmentCard} ${
                      dailyCommitment === "balanced" ? styles.commitmentCardSelected : ""
                    }`}
                    onClick={() => setDailyCommitment("balanced")}
                  >
                    <div className={styles.commitmentCheckbox}>
                      {dailyCommitment === "balanced" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 4L6 11L3 8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className={styles.commitmentIcon}>
                      {/* Placeholder for clock icon - user will replace later */}
                      <div className={styles.iconPlaceholder}>🕐</div>
                    </div>
                    <div className={styles.commitmentTitle}>Balanced</div>
                    <div className={styles.commitmentDuration}>2 hour/day</div>
                  </button>

                  <button
                    type="button"
                    className={`${styles.commitmentCard} ${
                      dailyCommitment === "focused" ? styles.commitmentCardSelected : ""
                    }`}
                    onClick={() => setDailyCommitment("focused")}
                  >
                    <div className={styles.commitmentCheckbox}>
                      {dailyCommitment === "focused" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 4L6 11L3 8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className={styles.commitmentIcon}>
                      {/* Placeholder for lightning icon - user will replace later */}
                      <div className={styles.iconPlaceholder}>⚡</div>
                    </div>
                    <div className={styles.commitmentTitle}>Focused</div>
                    <div className={styles.commitmentDuration}>3 hour/day</div>
                  </button>

                  <button
                    type="button"
                    className={`${styles.commitmentCard} ${
                      dailyCommitment === "intensive" ? styles.commitmentCardSelected : ""
                    }`}
                    onClick={() => setDailyCommitment("intensive")}
                  >
                    <div className={styles.commitmentCheckbox}>
                      {dailyCommitment === "intensive" && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 4L6 11L3 8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className={styles.commitmentIcon}>
                      {/* Placeholder for flame icon - user will replace later */}
                      <div className={styles.iconPlaceholder}>🔥</div>
                    </div>
                    <div className={styles.commitmentTitle}>Intensive</div>
                    <div className={styles.commitmentDuration}>4+ hour/day</div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.studyGuideActions}>
          {step === 1 ? (
            <>
              <button
                className={styles.exitBtn}
                onClick={handleClose}
                type="button"
              >
                Exit
              </button>
              <button
                className={styles.nextBtn}
                onClick={handleNext}
                type="button"
                disabled={chosenTopics.length === 0}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.backBtn}
                onClick={handleBack}
                type="button"
              >
                Back
              </button>
              <button
                className={styles.nextBtn}
                onClick={handleNext}
                type="button"
                disabled={
                  step === 2
                    ? !startDate ||
                      !startTime ||
                      !endDate ||
                      !endTime ||
                      (startDate && endDate && startDate > endDate)
                    : !dailyCommitment
                }
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
