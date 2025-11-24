"use client";
import React, { useState } from "react";
import {
    Typography, Paper, Popper, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../mvp.module.css";

const vocabItems = [
    {
        term: "Atom",
        definition: "The basic building block of the universe. All matter is made of atoms."
    },
    {
        term: "Attraction",
        definition: "Opposite electrical charges pull toward each other."
    },
    {
        term: "Conductor",
        definition: "A material that allows electrons to flow easily."
    },
    {
        term: "Electricity",
        definition: "A force known since ancient times; produced whenever charged materials attract or repel each other."
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
                { name: 'offset', options: { offset: [0, -56] } },
                { name: 'preventOverflow', options: { padding: 16 } },
                { name: 'flip', options: { padding: 16 } },
            ]}
            sx={{ zIndex: (t) => t.zIndex.modal + 1, pointerEvents: 'none' }}
        >
            <Paper
                elevation={8}
                sx={{ 
                    pointerEvents: 'auto', 
                    borderRadius: '4px', 
                    width: 280,
                    height: 300,
                    maxHeight: 'calc(100vh - 100px)',
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
                <div 
                    className={styles.vocabPanelContent}
                    style={{
                        overflowY: 'auto',
                        flex: 1,
                        minHeight: 0
                    }}
                >
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
