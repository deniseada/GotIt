'use client';
import React from 'react';
import Link from 'next/link';
import styles from '../mvp.module.css';

export default function ToolBar({
        page,
        onPrev,
        onNext,
        split,
        onToggleSplit
    }) {
    return (
            // {/* Secondary toolbar row */}
                <div className={`${styles.toolBar} ${styles.toolBarNoOffset}`}>
                <div className={styles.toolbarInner}>
                    <div className={styles.toolbarLeft}>
                        <button className={styles.toolButton}><img src="/icons/sideBarIcon.svg" className={styles.toolbarIcon} /></button>
                        <button
                            className={`${styles.toolButton} ${split ? styles.toolButtonActive : ''}`}
                            onClick={onToggleSplit}
                            aria-pressed={split}
                            title={split ? 'Single View' : 'Split View'}
                        >
                        <img src="/icons/sideCompareIcon.svg" className={styles.toolbarIcon} alt="" aria-hidden="true" />
                        </button>
                        <button className={styles.toolButton}><img src="/icons/searchIcon.svg" className={styles.toolbarIcon} /></button>
                    </div>

                    {/* Center: page controls (optional) */}
                    <div className={styles.toolbarCenter}>
                        <button className={styles.iconBtn} onClick={onPrev} aria-label="Previous page">‹</button>
                        <span className={styles.pageText}>{page} / 99</span>
                        <button className={styles.iconBtn} onClick={onNext} aria-label="Next page">›</button>
                    </div>

                    <div className={styles.toolbarRight}>
                        {/* your existing icons */}
                        <button className={styles.toolButton}><img src="/icons/highlightIcon.svg" className={styles.toolbarIcon} /></button>
                        <button className={styles.toolButton}><img src="/icons/textIcon.svg" className={styles.toolbarIcon} /></button>
                        <button className={styles.toolButton}><img src="/icons/addPicIcon.svg" className={styles.toolbarIcon} /></button>
                        <button className={styles.toolButton}><img src="/icons/printIcon.svg" className={styles.toolbarIcon} /></button>
                        <button className={styles.toolButton}><img src="/icons/downloadIcon.svg" className={styles.toolbarIcon} /></button>
                        <button className={styles.toolButton}><img src="/icons/moreIcon.svg" className={styles.toolbarIcon} /></button>
                    </div>
                </div>
            </div>
    );
}
