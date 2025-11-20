"use client";
import React, { useState } from "react";
import {
    Typography, Paper, Popper, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../mvp.module.css";

const vocabItems = [
    {
        term: "Manual Circuit",
        definition: "a system controlled by a person"
    },
    {
        term: "Overload Protection",
        definition: "a safety feature that stops electricity if current is too high"
    },
    {
        term: "Stop-start Three-wire Circuit",
        definition: "a simple control setup using stop and start buttons"
    },
    {
        term: "Schematic Drawing",
        definition: "a device that controls and protects an electric motor"
    }
];

export default function VocabModal({
    anchorEl,
    open,
    onClose,
    onHide,
}) {
    const [items, setItems] = useState(vocabItems);

    const handleRemove = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="top-end"
            modifiers={[
                { name: 'offset', options: { offset: [0, -50] } },
                { name: 'preventOverflow', options: { padding: 8 } },
                { name: 'flip', options: { padding: 8 } },
            ]}
            sx={{ zIndex: (t) => t.zIndex.modal + 1, pointerEvents: 'none' }}
        >
            <Paper
                elevation={8}
                sx={{ 
                    pointerEvents: 'auto', 
                    borderRadius: 3, 
                    width: 280,
                    maxHeight: 400,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid #dcd4e2',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div className={styles.aiPanelHeader}>
                    <div 
                        className={styles.aiHeaderIcon}
                        onClick={onClose}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onClose();
                            }
                        }}
                        style={{ background: 'transparent', padding: '2px' }}
                    >
                        <img src="/icons/Vocab.svg" alt="Vocabulary" width="32" height="32" />
                    </div>
                    <Typography className={styles.aiPanelTitle}>Vocabulary</Typography>
                </div>
                <div className={styles.vocabPanelContent}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.vocabItem}>
                            <div className={styles.vocabItemContent}>
                                <Typography className={styles.vocabTerm} sx={{ fontSize: '0.75rem' }}>
                                    {item.term}
                                </Typography>
                                <Typography className={styles.vocabDefinition} sx={{ fontSize: '0.75rem' }}>
                                    {item.definition}
                                </Typography>
                            </div>
                            <IconButton
                                onClick={() => handleRemove(index)}
                                size="small"
                                className={styles.vocabRemoveBtn}
                            >
                                <CloseIcon sx={{ fontSize: '12px', color: 'white' }} />
                            </IconButton>
                        </div>
                    ))}
                </div>
            </Paper>
        </Popper>
    );
}
