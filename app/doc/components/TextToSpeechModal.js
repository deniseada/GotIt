"use client";
import React, { useState } from "react";
import {
    Typography, Paper, Popper, Box, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

export default function TextToSpeechModal({
    anchorEl,
    open,
    onClose,
}) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
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
                    width: 320,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid #dcd4e2',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #e6e6e6',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#522a70',
                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, -apple-system, sans-serif',
                        }}
                    >
                        Text to Speech
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: '#666',
                            '&:hover': { backgroundColor: '#f0f0f0' },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '0.9375rem',
                            color: '#333',
                            lineHeight: 1.6,
                        }}
                    >
                        Select text in the document to read it aloud, or click the play button to read the entire page.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            onClick={handleTogglePlay}
                            sx={{
                                bgcolor: '#522A70',
                                color: 'white',
                                width: 48,
                                height: 48,
                                '&:hover': { bgcolor: '#3d1f52' },
                            }}
                        >
                            {isPlaying ? (
                                <PauseIcon sx={{ color: 'white' }} />
                            ) : (
                                <PlayArrowIcon sx={{ color: 'white' }} />
                            )}
                        </IconButton>
                        <Typography
                            sx={{
                                fontSize: '0.875rem',
                                color: '#666',
                            }}
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Popper>
    );
}

