"use client";
import PropTypes from "prop-types";
import styles from "./DocCard.module.css";
import { useState } from "react";

// Page Linking
import Link from "next/link";

const EMOJI = {
  confident: { icon: "/icons/happyFilter.svg", label: "Confident" },
  needs: { icon: "/icons/sadFilter.svg", label: "In Review" },
  neutral: { icon: "/icons/neutralFilter.svg", label: "Neutral" },
};

export default function DocCard({
  kind = "Section 1",
  title,
  lastOpened, // ISO string or display string
  emotion = "neutral", // "confident" | "needs" | "neutral"
  onMenu,
  bookmarked = false,
  onToggleBookmark,
  onEditTitle, // Callback for edit
  onDelete, // Callback for delete
  onEmotionChange, // New prop for emotion change callback
  category, // Category to identify course books
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEmotionModal, setShowEmotionModal] = useState(false);

  // Select emoji filtering
  const e = EMOJI[emotion] ?? EMOJI.neutral;

  // Format date
  const dateText = lastOpened
    ? new Date(lastOpened).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

  const handleEditClick = () => {
    setShowMenu(false);
    onEditTitle?.();
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDelete?.();
  };

  const handleEmotionClick = (newEmotion) => {
    setShowEmotionModal(false);
    onEmotionChange?.(newEmotion);
  };

  const isCourseBook = category === "Course Books";
  
  return (
    <Link href="/doc" className={styles.cardLink}>
      {isCourseBook && (
        <>
          <div className={styles.courseBookPage1}></div>
          <div className={styles.courseBookPage2}></div>
        </>
      )}
      <article className={isCourseBook ? styles.courseBookCard : styles.card}>
        {/* Bookmark Ribbon - floating ABOVE the card */}
        <button
          type="button"
          className={`${styles.ribbonBtn} ${
            bookmarked ? styles.ribbonActive : ""
          }`}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleBookmark?.();
          }}
        />

        {/* Kebab menu - top right (three dots) */}
        <button
          type="button"
          className={styles.kebab}
          aria-label="Card menu"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <span className={styles.kebabDot}></span>
          <span className={styles.kebabDot}></span>
          <span className={styles.kebabDot}></span>
        </button>

        {/* Dropdown Menu Modal */}
        {showMenu && (
          <>
            {/* Backdrop to close menu when clicking outside */}
            <div
              className={styles.backdrop}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(false);
              }}
            />

            <div className={styles.menuModal}>
              {kind === "Uploaded" && (
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditClick();
                  }}
                >
                  <span>Edit title</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <button
                type="button"
                className={`${styles.menuItem} ${styles.deleteItem}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick();
                }}
              >
                <span>Delete</span>
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
              </button>
            </div>
          </>
        )}

        {/* Emotion badge with icon and label - clickable */}
        <button
          type="button"
          className={`${styles.emotionBadge} ${styles[emotion]}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowEmotionModal(!showEmotionModal);
          }}
        >
          <img src={e.icon} alt="" />
          <span>{e.label}</span>
        </button>

        {/* Emotion Selection Modal */}
        {showEmotionModal && (
          <>
            {/* Backdrop to close modal when clicking outside */}
            <div
              className={styles.backdrop}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEmotionModal(false);
              }}
            />

            <div className={styles.emotionModal}>
              {/* Confident Option */}
              <button
                type="button"
                className={`${styles.emotionOption} ${styles.confident}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEmotionClick("confident");
                }}
              >
                <img src={EMOJI.confident.icon} alt="" />
                <span>{EMOJI.confident.label}</span>
              </button>

              {/* In Review Option */}
              <button
                type="button"
                className={`${styles.emotionOption} ${styles.needs}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEmotionClick("needs");
                }}
              >
                <img src={EMOJI.needs.icon} alt="" />
                <span>{EMOJI.needs.label}</span>
              </button>

              {/* No Feeling Option */}
              <button
                type="button"
                className={`${styles.emotionOption} ${styles.neutral}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEmotionClick("neutral");
                }}
              >
                <img src={EMOJI.neutral.icon} alt="" />
                <span>Neutral</span>
              </button>
            </div>
          </>
        )}

        {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Section label */}
        <div className={styles.section}>{kind}</div>

        {/* Footer meta */}
        <div className={styles.meta}>Last opened: {dateText}</div>
      </article>
    </Link>
  );
}

DocCard.propTypes = {
  kind: PropTypes.string,
  title: PropTypes.string.isRequired,
  lastOpened: PropTypes.string,
  emotion: PropTypes.oneOf(["confident", "needs", "neutral"]),
  onMenu: PropTypes.func,
  bookmarked: PropTypes.bool,
  onToggleBookmark: PropTypes.func,
  onEditTitle: PropTypes.func,
  onDelete: PropTypes.func,
  onEmotionChange: PropTypes.func,
};
