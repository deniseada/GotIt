"use client";
import PropTypes from "prop-types";
import styles from "./DocCard.module.css";

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
}) {
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

  return (
    <Link href="/doc" className={styles.cardLink}>
      <article className={styles.card}>
        {/* Bookmark Ribbon - top left */}
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
            onMenu?.();
          }}
        >
          <span className={styles.kebabDot}></span>
          <span className={styles.kebabDot}></span>
          <span className={styles.kebabDot}></span>
        </button>

        {/* Emotion badge with icon and label */}
        <div className={`${styles.emotionBadge} ${styles[emotion]}`}>
          <img src={e.icon} alt="" />
          <span>{e.label}</span>
        </div>

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
};
