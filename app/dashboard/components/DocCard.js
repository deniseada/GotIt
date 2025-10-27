"use client";
import PropTypes from "prop-types";
import styles from "./DocCard.module.css";
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
}) {
    const e = EMOJI[emotion] ?? EMOJI.neutral;
    const dateText = lastOpened
        ? (new Date(lastOpened).toLocaleDateString())
        : "—";

    return (
        <Link href="/doc" className={styles.cardLink}>
        <article className={styles.card}>
        {/* Top purple bar */}
        <div className={styles.topBar}>
            <span className={styles.kind}>{kind}</span>
            <span aria-hidden className={styles.ribbon} />
        </div>

      {/* Upper row: emoji + menu button */}
        <div className={styles.row}>
            <div className={`${styles.emoji} ${styles[emotion]}`}>
            <img src={e.icon} alt={e.label} />
            </div>
            <button
            className={styles.kebab}
            aria-label="Card menu"
            onClick={onMenu}
            type="button"
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
};
