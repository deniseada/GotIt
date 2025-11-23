"use client";
import PropTypes from "prop-types";
import styles from "./DocCard.module.css";
import { useState } from "react";
import Link from "next/link";

// Constants
const EMOJI = {
  confident: { icon: "/icons/happyFilter.svg", label: "Confident" },
  needs: { icon: "/icons/sadFilter.svg", label: "In Review" },
  neutral: { icon: "/icons/neutralFilter.svg", label: "Neutral" },
};

// SVG Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 5H4.16667H17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66602 5.00033V3.33366C6.66602 2.89163 6.84161 2.46771 7.15417 2.15515C7.46673 1.84259 7.89065 1.66699 8.33268 1.66699H11.666C12.108 1.66699 12.532 1.84259 12.8445 2.15515C13.1571 2.46771 13.3327 2.89163 13.3327 3.33366V5.00033M15.8327 5.00033V16.667C15.8327 17.109 15.6571 17.5329 15.3445 17.8455C15.032 18.1581 14.608 18.3337 14.166 18.3337H5.83268C5.39065 18.3337 4.96673 18.1581 4.65417 17.8455C4.34161 17.5329 4.16602 17.109 4.16602 16.667V5.00033H15.8327Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function DocCard({
  kind = "Section 1",
  title,
  lastOpened,
  emotion = "neutral",
  bookmarked = false,
  onToggleBookmark,
  onEditTitle,
  onDelete,
  onEmotionChange,
  category,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEmotionModal, setShowEmotionModal] = useState(false);

  const isCourseBook = category === "Course Books";
  const emotionData = EMOJI[emotion] ?? EMOJI.neutral;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Event handlers
  const handleEvent = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.();
  };

  const handleMenuToggle = (e) => {
    handleEvent(e, () => setShowMenu(!showMenu));
  };

  const handleEditClick = (e) => {
    handleEvent(e, () => {
      setShowMenu(false);
      onEditTitle?.();
    });
  };

  const handleDeleteClick = (e) => {
    handleEvent(e, () => {
      setShowMenu(false);
      onDelete?.();
    });
  };

  const handleEmotionClick = (newEmotion) => {
    setShowEmotionModal(false);
    onEmotionChange?.(newEmotion);
  };

  const handleBookmarkClick = (e) => {
    handleEvent(e, onToggleBookmark);
  };

  const handleEmotionBadgeClick = (e) => {
    handleEvent(e, () => setShowEmotionModal(!showEmotionModal));
  };

  const handleCloseModal = (e) => {
    handleEvent(e, () => setShowMenu(false));
  };

  const handleCloseEmotionModal = (e) => {
    handleEvent(e, () => setShowEmotionModal(false));
  };

  return (
    <Link href="/doc" className={styles.cardLink}>
      {/* Course book background pages */}
      {isCourseBook && (
        <>
          <div className={styles.courseBookPage1}></div>
          <div className={styles.courseBookPage2}></div>
        </>
      )}

      <article className={isCourseBook ? styles.courseBookCard : styles.card}>
        {/* Bookmark Ribbon */}
        <button
          type="button"
          className={`${styles.ribbonBtn} ${
            bookmarked ? styles.ribbonActive : ""
          }`}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          onClick={handleBookmarkClick}
        />

        {/* Kebab Menu - hidden for course book cards */}
        {!isCourseBook && (
          <button
            type="button"
            className={styles.kebab}
            aria-label="Card menu"
            onClick={handleMenuToggle}
          >
            <span className={styles.kebabDot}></span>
            <span className={styles.kebabDot}></span>
            <span className={styles.kebabDot}></span>
          </button>
        )}

        {/* Dropdown Menu Modal */}
        {showMenu && (
          <>
            <div className={styles.backdrop} onClick={handleCloseModal} />
            <div className={styles.menuModal}>
              {kind === "Uploaded" && (
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={handleEditClick}
                >
                  <span>Edit title</span>
                  <EditIcon />
                </button>
              )}
              <button
                type="button"
                className={`${styles.menuItem} ${styles.deleteItem}`}
                onClick={handleDeleteClick}
              >
                <span>Remove</span>
                <DeleteIcon />
              </button>
            </div>
          </>
        )}

        {/* Emotion Badge */}
        <button
          type="button"
          className={`${styles.emotionBadge} ${styles[emotion]}`}
          onClick={handleEmotionBadgeClick}
        >
          <img src={emotionData.icon} alt={emotionData.label} />
          <span>{emotionData.label}</span>
        </button>

        {/* Emotion Selection Modal */}
        {showEmotionModal && (
          <>
            <div className={styles.backdrop} onClick={handleCloseEmotionModal} />
            <div className={styles.emotionModal}>
              {Object.entries(EMOJI).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.emotionOption} ${styles[key]}`}
                  onClick={(e) => {
                    handleEvent(e, () => handleEmotionClick(key));
                  }}
                >
                  <img src={data.icon} alt={data.label} />
                  <span>{data.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Card Content */}
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.section}>{kind}</div>
        <div className={styles.meta}>Last opened: {formatDate(lastOpened)}</div>
      </article>
    </Link>
  );
}

DocCard.propTypes = {
  kind: PropTypes.string,
  title: PropTypes.string.isRequired,
  lastOpened: PropTypes.string,
  emotion: PropTypes.oneOf(["confident", "needs", "neutral"]),
  bookmarked: PropTypes.bool,
  onToggleBookmark: PropTypes.func,
  onEditTitle: PropTypes.func,
  onDelete: PropTypes.func,
  onEmotionChange: PropTypes.func,
  category: PropTypes.string,
};
