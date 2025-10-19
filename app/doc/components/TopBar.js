'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';



export default function TopBar({ title, split, onToggleSplit, page, onPrev, onNext }) {
    return (
        <AppBar color="default" elevation={0} position="sticky" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" aria-label="Go back"><ArrowBackIcon /></IconButton>

            <Typography variant="h6" sx={{ mr: 'auto' }}>{title}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={onPrev} aria-label="Previous page"><NavigateBeforeIcon /></IconButton>
            <Typography variant="body2">{page} / 99</Typography>
            <IconButton onClick={onNext} aria-label="Next page"><NavigateNextIcon /></IconButton>
            </Box>

            <Tooltip title={split ? 'Exit split view' : 'Open split view'}>
            <Button
                onClick={onToggleSplit}
                startIcon={split ? <CloseFullscreenIcon /> : <SplitscreenIcon />}
                variant="contained"
                sx={{ borderRadius: 999 }}
            >
                {split ? 'Single view' : 'Split view'}
            </Button>
            </Tooltip>
        </Toolbar>
        </AppBar>
    );
}
