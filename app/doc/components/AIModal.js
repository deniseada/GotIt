"use client";
import React from "react";
import {
    Typography, Paper, Popper
} from "@mui/material";
import styles from "../mvp.module.css";

export default function AIModal({
    anchorEl,
    open,
    onClose,
    onHide,
}) {
    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="top-end"
            // Positioning of the Popper
            modifiers={[
                { name: 'offset', options: { offset: [0, -50] } }, // positions above the button
                { name: 'preventOverflow', options: { padding: 8 } },
                { name: 'flip', options: { padding: 8 } },
            ]}
            // Let the page remain interactive; only the AI surface catches clicks
            sx={{ zIndex: (t) => t.zIndex.modal + 1, pointerEvents: 'none' }}
        >
            <Paper
                elevation={8}
                sx={{ 
                    pointerEvents: 'auto', 
                    borderRadius: 3, 
                    width: 280,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid #dcd4e2',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                }}
            >
                <div className={styles.aiPanelHeader}>
                    <div 
                        className={styles.aiHeaderIcon}
                        onClick={onClose}
                        style={{ cursor: 'pointer', background: 'transparent', padding: '2px' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onClose();
                            }
                        }}
                    >
                        <img src="/icons/aiDark.svg" alt="AI" width="32" height="32" />
                    </div>
                    <Typography className={styles.aiPanelTitle}>AI Study Tools</Typography>
                </div>
                <div className={styles.aiPanelContent}>
                    <button className={styles.aiToolButton}>
                        <div className={styles.aiIconWithStar}>
                            <img src="/icons/simpllificationIcon.svg" alt="" className={styles.aiToolIcon} />
                            <svg className={styles.iconStar} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 0L4.5 2.5L7 3L4.5 3.5L4 6L3.5 3.5L1 3L3.5 2.5L4 0Z" fill="#522A70"/>
                            </svg>
                        </div>
                        <span className={styles.aiToolLabel}>Text Simplification</span>
                    </button>
                    <button className={styles.aiToolButton}>
                        <div className={styles.aiIconWithStar}>
                            <img src="/icons/summaryIcon.svg" alt="" className={styles.aiToolIcon} />
                            <svg className={styles.iconStar} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 0L4.5 2.5L7 3L4.5 3.5L4 6L3.5 3.5L1 3L3.5 2.5L4 0Z" fill="#522A70"/>
                            </svg>
                        </div>
                        <span className={styles.aiToolLabel}>Create Summary</span>
                    </button>
                    <button className={styles.aiToolButton}>
                        <div className={styles.aiIconWithStar}>
                            <img src="/icons/mindMapIcon.svg" alt="" className={styles.aiToolIcon} />
                            <svg className={styles.iconStar} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 0L4.5 2.5L7 3L4.5 3.5L4 6L3.5 3.5L1 3L3.5 2.5L4 0Z" fill="#522A70"/>
                            </svg>
                        </div>
                        <span className={styles.aiToolLabel}>Mind-map</span>
                    </button>
                </div>
            </Paper>
        </Popper>
    );
}
