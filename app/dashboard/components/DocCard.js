"use client";
import PropTypes from "prop-types";
import styles from "./DocCard.module.css";

// Page Linking
import Link from "next/link";

const EMOJI = {
    confident: { icon: "/icons/happyFilter.svg", label: "Confident" },
    needs:     { icon: "/icons/sadFilter.svg",   label: "Needs Review" },
    neutral:   { icon: "/icons/neutralFilter.svg", label: "Neutral" },
};

export default function DocCard({
    kind = "Section",
    title,
    lastOpened,              // ISO string or display string
    emotion = "neutral",     // "confident" | "needs" | "neutral"
    onMenu,
    bookmarked = false,
    onToggleBookmark,
}) {
    // Select emoji filtering
    const e = EMOJI[emotion] ?? EMOJI.neutral;

    // Format date
    const dateText = lastOpened
        ? (new Date(lastOpened).toLocaleDateString())
        : "—";

    return (
        <Link href="/doc" className={styles.cardLink}>
        <article className={styles.card}>
        
        {/* Top purple bar */}
        <div className={styles.topBar}>
            <span className={styles.kind}>{kind}</span>

            {/* Bookmark Ribbon */}
            <button
                type="button"
                className={`${styles.ribbonBtn} ${
                    bookmarked ? styles.ribbonActive : ""
                }`}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                onClick={(e) => {
                    // Prevent card link navigation
                    e.preventDefault(); 
                    e.stopPropagation();
                    // Toggle bookmark
                    onToggleBookmark?.();
                }}
            />        
        </div>

      {/* Upper row: emoji + menu button */}
        <div className={styles.row}>
            <div className={`${styles.emoji} ${styles[emotion]}`}>
            <img src={e.icon} alt={e.label} />
            </div>
            <button
                type = "button"
                className={styles.kebab}
                aria-label="Card menu"
                onClick={(e) => {
                    // Prevent card link navigation
                    e.preventDefault();
                    e.stopPropagation();
                    onMenu?.();
                }}
            >
            <img src="/icons/kebab.svg" alt="menu" />
            </button>
        </div>

      {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Footer meta */}
        <div className={styles.meta}>Last Opened: {dateText}</div>
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
