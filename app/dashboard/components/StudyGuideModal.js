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
  
  // Step 4 - Edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingTopics, setIsEditingTopics] = useState(false);
  const [isEditingDateRange, setIsEditingDateRange] = useState(false);
  const [isEditingCommitment, setIsEditingCommitment] = useState(false);
  
  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Format date for display (mm/dd format)
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  };

  // Format commitment for display
  const formatCommitment = () => {
    if (!dailyCommitment) return "";
    const commitmentMap = {
      light: "Light — 1 hour/day",
      balanced: "Balanced — 2 hour/day",
      focused: "Focused — 3 hour/day",
      intensive: "Intensive — 4+ hour/day",
    };
    return commitmentMap[dailyCommitment] || "";
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
      if (!dailyCommitment) return;
      setStep(4);
    } else if (step === 4) {
      // Handle Generate
      setIsGenerating(true);
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
      
      // Simulate API call or processing (4-5 seconds)
      setTimeout(() => {
        setIsGenerating(false);
        setStep(5);
      }, 4500);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    } else if (step === 5) {
      setStep(4);
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
    setIsEditingTitle(false);
    setIsEditingTopics(false);
    setIsEditingDateRange(false);
    setIsEditingCommitment(false);
    setIsGenerating(false);
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
                  width: step === 1 ? "20%" : step === 2 ? "40%" : step === 3 ? "60%" : step === 4 ? "80%" : step === 5 ? "100%" : "0%" 
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

          {step === 4 && (
            <>
              {/* Step 4 - Overview/Review */}
              <div className={styles.step2Content}>
                <h3 className={styles.step2Question}>Overview</h3>
                <p className={styles.step2Subtitle}>
                  Double-check your study guide information for accuracy.
                </p>

                <div className={styles.reviewGrid}>
                  {/* Title Field */}
                  <div className={styles.reviewField}>
                    <div className={styles.reviewFieldHeader}>
                      <label className={styles.reviewLabel}>Title</label>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => setIsEditingTitle(!isEditingTitle)}
                        aria-label="Edit title"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68626 11.9441 1.59331C12.1719 1.50037 12.4151 1.45459 12.6607 1.45868C12.9062 1.46277 13.1473 1.51664 13.3711 1.61689C13.5949 1.71714 13.797 1.86182 13.9657 2.04234C14.1344 2.22286 14.2662 2.43562 14.3534 2.66791C14.4406 2.9002 14.4813 3.14744 14.4733 3.39534C14.4652 3.64324 14.4085 3.88706 14.3067 4.11334C14.2049 4.33962 14.0601 4.54384 13.88 4.71334L13.333 5.26001L10.74 2.66668L11.287 2.12001C11.3784 2.02876 11.4837 1.95262 11.5989 1.89468C11.7141 1.83674 11.8376 1.79775 11.965 1.77934C12.0924 1.76093 12.222 1.76333 12.3485 1.78645C12.475 1.80957 12.5967 1.85315 12.7087 1.91545C12.8207 1.97775 12.9214 2.05791 13.0067 2.15268C13.092 2.24745 13.1607 2.35556 13.21 2.47334L13.21 2.47334Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.333 4.00001L11.926 6.59334L6.926 11.5933L4.333 9.00001L9.333 4.00001Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.666 13.3333L4.333 11.6667L6.926 14.26L5.26 15.9267C5.18614 16.0005 5.09697 16.0574 4.99833 16.0937C4.89969 16.13 4.79375 16.1448 4.68733 16.1373C4.58092 16.1299 4.47645 16.1003 4.38067 16.0503C4.28489 15.9999 4.19975 15.9301 4.13 15.8467L2.153 13.8667C2.06964 13.797 1.99985 13.7118 1.94933 13.6161C1.89881 13.5203 1.86924 13.4158 1.8618 13.3093C1.85436 13.2029 1.86919 13.097 1.90548 12.9984C1.94177 12.8997 1.99872 12.8106 2.07267 12.7367L3.739 11.07L6.333 13.6667L4.666 15.3333"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {isEditingTitle ? (
                      <input
                        type="text"
                        className={styles.reviewInput}
                        value={studyGuideName}
                        onChange={(e) => setStudyGuideName(e.target.value)}
                        onBlur={() => setIsEditingTitle(false)}
                        autoFocus
                      />
                    ) : (
                      <div className={styles.reviewValue}>{studyGuideName || "Midterm Exam"}</div>
                    )}
                  </div>

                  {/* Topics Field */}
                  <div className={styles.reviewField}>
                    <div className={styles.reviewFieldHeader}>
                      <label className={styles.reviewLabel}>Topics</label>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => setIsEditingTopics(!isEditingTopics)}
                        aria-label="Edit topics"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68626 11.9441 1.59331C12.1719 1.50037 12.4151 1.45459 12.6607 1.45868C12.9062 1.46277 13.1473 1.51664 13.3711 1.61689C13.5949 1.71714 13.797 1.86182 13.9657 2.04234C14.1344 2.22286 14.2662 2.43562 14.3534 2.66791C14.4406 2.9002 14.4813 3.14744 14.4733 3.39534C14.4652 3.64324 14.4085 3.88706 14.3067 4.11334C14.2049 4.33962 14.0601 4.54384 13.88 4.71334L13.333 5.26001L10.74 2.66668L11.287 2.12001C11.3784 2.02876 11.4837 1.95262 11.5989 1.89468C11.7141 1.83674 11.8376 1.79775 11.965 1.77934C12.0924 1.76093 12.222 1.76333 12.3485 1.78645C12.475 1.80957 12.5967 1.85315 12.7087 1.91545C12.8207 1.97775 12.9214 2.05791 13.0067 2.15268C13.092 2.24745 13.1607 2.35556 13.21 2.47334L13.21 2.47334Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.333 4.00001L11.926 6.59334L6.926 11.5933L4.333 9.00001L9.333 4.00001Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.666 13.3333L4.333 11.6667L6.926 14.26L5.26 15.9267C5.18614 16.0005 5.09697 16.0574 4.99833 16.0937C4.89969 16.13 4.79375 16.1448 4.68733 16.1373C4.58092 16.1299 4.47645 16.1003 4.38067 16.0503C4.28489 15.9999 4.19975 15.9301 4.13 15.8467L2.153 13.8667C2.06964 13.797 1.99985 13.7118 1.94933 13.6161C1.89881 13.5203 1.86924 13.4158 1.8618 13.3093C1.85436 13.2029 1.86919 13.097 1.90548 12.9984C1.94177 12.8997 1.99872 12.8106 2.07267 12.7367L3.739 11.07L6.333 13.6667L4.666 15.3333"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {isEditingTopics ? (
                      <div className={styles.topicsEditContainer}>
                        {chosenTopics.map((topic, index) => (
                          <div key={index} className={styles.topicTag}>
                            {topic}
                            <button
                              type="button"
                              className={styles.topicTagRemove}
                              onClick={() => handleRemoveTopic(topic)}
                              aria-label="Remove topic"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className={styles.addTopicBtn}
                          onClick={() => setIsEditingTopics(false)}
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <div className={styles.reviewValue}>
                        {chosenTopics.length > 0
                          ? chosenTopics.join(", ") + (chosenTopics.length > 3 ? " ..." : "")
                          : "No topics selected"}
                      </div>
                    )}
                  </div>

                  {/* Date Range Field */}
                  <div className={styles.reviewField}>
                    <div className={styles.reviewFieldHeader}>
                      <label className={styles.reviewLabel}>Date Range</label>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => setIsEditingDateRange(!isEditingDateRange)}
                        aria-label="Edit date range"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68626 11.9441 1.59331C12.1719 1.50037 12.4151 1.45459 12.6607 1.45868C12.9062 1.46277 13.1473 1.51664 13.3711 1.61689C13.5949 1.71714 13.797 1.86182 13.9657 2.04234C14.1344 2.22286 14.2662 2.43562 14.3534 2.66791C14.4406 2.9002 14.4813 3.14744 14.4733 3.39534C14.4652 3.64324 14.4085 3.88706 14.3067 4.11334C14.2049 4.33962 14.0601 4.54384 13.88 4.71334L13.333 5.26001L10.74 2.66668L11.287 2.12001C11.3784 2.02876 11.4837 1.95262 11.5989 1.89468C11.7141 1.83674 11.8376 1.79775 11.965 1.77934C12.0924 1.76093 12.222 1.76333 12.3485 1.78645C12.475 1.80957 12.5967 1.85315 12.7087 1.91545C12.8207 1.97775 12.9214 2.05791 13.0067 2.15268C13.092 2.24745 13.1607 2.35556 13.21 2.47334L13.21 2.47334Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.333 4.00001L11.926 6.59334L6.926 11.5933L4.333 9.00001L9.333 4.00001Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.666 13.3333L4.333 11.6667L6.926 14.26L5.26 15.9267C5.18614 16.0005 5.09697 16.0574 4.99833 16.0937C4.89969 16.13 4.79375 16.1448 4.68733 16.1373C4.58092 16.1299 4.47645 16.1003 4.38067 16.0503C4.28489 15.9999 4.19975 15.9301 4.13 15.8467L2.153 13.8667C2.06964 13.797 1.99985 13.7118 1.94933 13.6161C1.89881 13.5203 1.86924 13.4158 1.8618 13.3093C1.85436 13.2029 1.86919 13.097 1.90548 12.9984C1.94177 12.8997 1.99872 12.8106 2.07267 12.7367L3.739 11.07L6.333 13.6667L4.666 15.3333"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {isEditingDateRange ? (
                      <div className={styles.dateRangeEditContainer}>
                        <div className={styles.dateRangeEditRow}>
                          <div className={styles.dateRangeEditField}>
                            <label className={styles.dateTimeLabel}>Start date</label>
                            <input
                              type="date"
                              className={styles.dateTimeInput}
                              value={formatDateForInput(startDate)}
                              onChange={handleStartDateChange}
                            />
                          </div>
                          <div className={styles.dateRangeEditField}>
                            <label className={styles.dateTimeLabel}>End date</label>
                            <input
                              type="date"
                              className={styles.dateTimeInput}
                              value={formatDateForInput(endDate)}
                              onChange={handleEndDateChange}
                              min={startDate ? formatDateForInput(startDate) : undefined}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.addTopicBtn}
                          onClick={() => setIsEditingDateRange(false)}
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <div className={styles.reviewValue}>
                        {startDate && endDate
                          ? `${formatDateForDisplay(startDate)} — ${formatDateForDisplay(endDate)}`
                          : "No date range selected"}
                      </div>
                    )}
                  </div>

                  {/* Commitment Field */}
                  <div className={styles.reviewField}>
                    <div className={styles.reviewFieldHeader}>
                      <label className={styles.reviewLabel}>Commitment</label>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => setIsEditingCommitment(!isEditingCommitment)}
                        aria-label="Edit commitment"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68626 11.9441 1.59331C12.1719 1.50037 12.4151 1.45459 12.6607 1.45868C12.9062 1.46277 13.1473 1.51664 13.3711 1.61689C13.5949 1.71714 13.797 1.86182 13.9657 2.04234C14.1344 2.22286 14.2662 2.43562 14.3534 2.66791C14.4406 2.9002 14.4813 3.14744 14.4733 3.39534C14.4652 3.64324 14.4085 3.88706 14.3067 4.11334C14.2049 4.33962 14.0601 4.54384 13.88 4.71334L13.333 5.26001L10.74 2.66668L11.287 2.12001C11.3784 2.02876 11.4837 1.95262 11.5989 1.89468C11.7141 1.83674 11.8376 1.79775 11.965 1.77934C12.0924 1.76093 12.222 1.76333 12.3485 1.78645C12.475 1.80957 12.5967 1.85315 12.7087 1.91545C12.8207 1.97775 12.9214 2.05791 13.0067 2.15268C13.092 2.24745 13.1607 2.35556 13.21 2.47334L13.21 2.47334Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.333 4.00001L11.926 6.59334L6.926 11.5933L4.333 9.00001L9.333 4.00001Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.666 13.3333L4.333 11.6667L6.926 14.26L5.26 15.9267C5.18614 16.0005 5.09697 16.0574 4.99833 16.0937C4.89969 16.13 4.79375 16.1448 4.68733 16.1373C4.58092 16.1299 4.47645 16.1003 4.38067 16.0503C4.28489 15.9999 4.19975 15.9301 4.13 15.8467L2.153 13.8667C2.06964 13.797 1.99985 13.7118 1.94933 13.6161C1.89881 13.5203 1.86924 13.4158 1.8618 13.3093C1.85436 13.2029 1.86919 13.097 1.90548 12.9984C1.94177 12.8997 1.99872 12.8106 2.07267 12.7367L3.739 11.07L6.333 13.6667L4.666 15.3333"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {isEditingCommitment ? (
                      <div className={styles.commitmentEditContainer}>
                        <div className={styles.commitmentGrid}>
                          <button
                            type="button"
                            className={`${styles.commitmentCard} ${
                              dailyCommitment === "light" ? styles.commitmentCardSelected : ""
                            }`}
                            onClick={() => {
                              setDailyCommitment("light");
                              setIsEditingCommitment(false);
                            }}
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
                            onClick={() => {
                              setDailyCommitment("balanced");
                              setIsEditingCommitment(false);
                            }}
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
                            onClick={() => {
                              setDailyCommitment("focused");
                              setIsEditingCommitment(false);
                            }}
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
                            onClick={() => {
                              setDailyCommitment("intensive");
                              setIsEditingCommitment(false);
                            }}
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
                              <div className={styles.iconPlaceholder}>🔥</div>
                            </div>
                            <div className={styles.commitmentTitle}>Intensive</div>
                            <div className={styles.commitmentDuration}>4+ hour/day</div>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.reviewValue}>
                        {formatCommitment() || "No commitment selected"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Loading Dialog */}
                {isGenerating && (
                  <div className={styles.daysCalculation}>
                    <p className={styles.daysCalculationText}>
                      Hold on tight! Got It AI is now generating the best plan for you.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              {/* Step 5 - Complete */}
              <div className={styles.step2Content}>
                <h3 className={styles.completeTitle}>Complete!</h3>
                
                <div className={styles.completeIcon}>
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="40" cy="40" r="40" fill="#10b981" />
                    <path
                      d="M25 40L35 50L55 30"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className={styles.completeMessage}>
                  Your plan is ready. You can now view it on the Study Guide page.
                </p>
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
          ) : step === 5 ? (
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
                onClick={() => {
                  // TODO: Navigate to Study Guide page
                  console.log("Navigate to Study Guide page");
                  handleClose();
                }}
                type="button"
              >
                View Study Guide
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
                    : step === 3
                    ? !dailyCommitment
                    : step === 4
                    ? isGenerating
                    : false
                }
              >
                {step === 4 ? (
                  <>
                    Generate
                    {isGenerating && (
                      <span className={styles.loadingSpinner}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="7"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="43.98"
                            strokeDashoffset="10.99"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              values="0 8 8;360 8 8"
                              dur="1s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      </span>
                    )}
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
