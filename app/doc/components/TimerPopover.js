'use client';
import React, { useMemo } from 'react';
import {
    Popover, Box, Button, Typography, Stack, Grid, IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

function fmt(seconds) {
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} min`;
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}:${String(m).padStart(2, '0')} hr`;
}

function minsLabel(mins) {
    if (mins === 0) return 'No Timer';
    if (mins < 60) return `${String(mins).padStart(2, '0')}:00 min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}:${m === 0 ? '00' : String(m).padStart(2, '0')} hr`;
}

export default function TimerPopover({
    anchorEl,
    open,
    onClose,
    onChange,      // (mins) => void
    seconds = 0,   // remaining seconds (live)
    running = false,
    onPause,
    onResume,
    onReset,
}) {
    const presetsMin = useMemo(() => [0, 10, 15, 20, 30], []);
    const presetsHr  = useMemo(() => [60, 90, 120, 150, 180], []);
    const setTimer = (mins) => {
        onChange?.(mins);   // parent sets seconds + starts
};

    return (
        <Popover
            open={open}
            onClose={onClose}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            PaperProps={{
                elevation: 6,
                sx: {
                borderRadius: 2,
                p: 2,
                bgcolor: 'background.paper',
                minWidth: 260,
                mt: -1, // slightly overlap the button
                },
            }}
        >
        
        <Stack spacing={1}>
            {/* Header: icon + readout + controls */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr auto auto',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: '#f6f0fa'
                }}
            >
            <Box
                sx={{
                width: 40, height: 40, borderRadius: 1.5,
                display: 'grid', placeItems: 'center',
                bgcolor: '#522A70'
                }}
            >
                <img src="/icons/timerDark.svg" alt="" width="30" height="30" />
            </Box>

            <Box
                sx={{
                height: 32, display: 'grid', placeItems: 'center',
                px: 1.25, borderRadius: 1.5,
                border: '1px solid', borderColor: 'divider', bgcolor: 'white'
                }}
            >
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.2 }}>
                {fmt(seconds)}
                </Typography>
            </Box>

            <IconButton
                size="small"
                onClick={running ? onPause : onResume}
                title={running ? 'Pause' : 'Play'}
                sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}
            >
                {running ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>

            <IconButton
                size="small"
                onClick={onReset}
                title="Reset"
                sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}
            >
                <ReplayIcon fontSize="small" />
            </IconButton>
            </Box>

            {/* Minute presets */}
            <Grid container spacing={1} columns={6}>
            {presetsMin.map((m) => (
                <Grid item xs={3} key={`m-${m}`}>
                <Button
                    fullWidth size="small" variant="outlined" onClick={() => setTimer(m)}
                    sx={{
                    textTransform: 'none', fontWeight: 600, borderRadius: 2,
                    borderColor: '#5E35B1', color: '#5E35B1',
                    '&:hover': { borderColor: '#5E35B1', bgcolor: 'rgba(94,53,177,0.06)' }
                    }}
                >
                    {minsLabel(m)}
                </Button>
                </Grid>
            ))}
            </Grid>

            {/* Hour presets */}
            <Grid container spacing={1} columns={6}>
            {presetsHr.map((m) => (
                <Grid item xs={3} key={`h-${m}`}>
                <Button
                    fullWidth size="small" variant="outlined" onClick={() => setTimer(m)}
                    sx={{
                    textTransform: 'none', fontWeight: 600, borderRadius: 2,
                    borderColor: '#B3261E', color: '#B3261E',
                    '&:hover': { borderColor: '#B3261E', bgcolor: 'rgba(179,38,30,0.06)' }
                    }}
                >
                    {minsLabel(m)}
                </Button>
                </Grid>
            ))}
            </Grid>
        </Stack>
        </Popover>
    );
}
