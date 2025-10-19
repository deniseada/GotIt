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
        <div className={styles.navWrapper}>
            {/* Top brand row */}
            <div className={styles.navBar}>
                <div className={styles.leftGroup}>
                    <div className={styles.brand}>
                        <img src="/icons/Omega.svg" className={styles.icon} alt="Got It Logo" width="200" height="36" />
                        <span className={styles.brandText}>Doc Title</span>
                    </div>
                </div>

                <div className={styles.rightGroup}>
                    <button className={styles.settingsBtn}>
                        <img src="/icons/gear.svg" alt="settings" className={styles.gearImg} width="20" height="20" />
                        <span className={styles.settingsLabel}>Settings</span>
                    </button>
                </div>
            </div>

            {/* Secondary toolbar row */}
            <div className={styles.toolBar}>
                <div className={styles.toolbarInner}>
                    <div className={styles.toolbarLeft}>
                        <button className={styles.toolButton}><img src="/icons/sideBarIcon.svg" className={styles.toolbarIcon} /></button>
                        <button className={styles.toolButton}><img src="/icons/sideCompareIcon.svg" className={styles.toolbarIcon} /></button>
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

                        {/* NEW: Split View toggle */}
                        <button
                            className={styles.splitBtn}
                            onClick={onToggleSplit}
                            aria-pressed={split}
                            >
                            <img src="/icons/split.svg" className={styles.splitIcon} />
                            <span>{split ? 'Single View' : 'Split View'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
