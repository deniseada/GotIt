'use client';
import React from 'react';
import { Tooltip, IconButton, Box } from '@mui/material';

export default function RightDockButtons({ onOpenA, onOpenB, onOpenC }) {
    return (
        <Box sx={{ position:'fixed', right:16, top:'50%', transform:'translateY(-50%)', display:'grid', gap:1.5, zIndex:1200 }}>
        <Tooltip title="Timer"><IconButton onClick={onOpenA}><img src="/icons/timerLight.svg" alt="timer" width="40" height="40" /></IconButton></Tooltip>
        <Tooltip title="AI"><IconButton onClick={onOpenB}><img src="/icons/aiLight.svg" alt="ai" width="40" height="40" /></IconButton></Tooltip>
        <Tooltip title="Vocab"><IconButton onClick={onOpenC}><img src="/icons/vocab.svg" alt="vocab" width="40" height="40" /></IconButton></Tooltip>
        </Box>
    );
}