'use client';
import React, { useMemo, useEffect, useState } from 'react';
import {
    Box, Button, Typography, Stack, Grid, IconButton, Divider, Collapse, Paper, Popper
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
    open,            // parent controls visibility of the mini/presets UI
    onClose,         // optional, not used for outside clicks in this pattern
    onHide,          // NEW: called when the user hides the mini via icon
    onChange,        // (mins) => void
    seconds = 0,
    running = false,
    onPause,
    onResume,
    onReset,
    }) {
    const [expanded, setExpanded] = useState(false);

    // Collapse when parent closes the UI
    useEffect(() => { if (!open) setExpanded(false); }, [open]);


    const setTimer = (mins) => {
        onChange?.(mins);
        if (mins > 0) onResume?.(); else { onReset?.(); onPause?.(); }
        setExpanded(false);
    };
    const isSelected = (m) => Math.round(seconds / 60) === m && seconds > 0;

    // Hide handler: collapse if open, then ask parent to hide the UI entirely.
    const handleHide = () => {
        setExpanded(false);
        // Prefer onHide (non-pausing close). Fall back to onClose if not provided.
        (onHide || onClose)?.();
    };

    return (
        <Popper
        open={open}
        anchorEl={anchorEl}
        placement="top-end"
        // Positioning of the Popper
        modifiers={[
            { name: 'offset', options: { offset: [0, -50] } }, // removes gap
            { name: 'preventOverflow', options: { padding: 8 } },
            { name: 'flip', options: { padding: 8 } },
        ]}
        // Let the page remain interactive; only the timer surface catches clicks
        sx={{ zIndex: (t) => t.zIndex.modal + 1, pointerEvents: 'none' }}
        >
        <Paper
            elevation={8}
            sx={{ pointerEvents: 'auto', borderRadius: 3, p: 1.25, width: expanded ? 420 : 'auto' }}
        >
            <Stack spacing={expanded ? 1.5 : 0.5}>
            {/* MINI BAR */}
            <Box
                sx={{
                display: 'grid',
                gridTemplateColumns: expanded ? '44px 1fr auto auto' : '28px auto auto auto',
                alignItems: 'center',
                gap: 0.75,
                p: expanded ? 1 : 0.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#f6f0fa',
                minHeight: expanded ? 64 : 40,
                }}
            >
                {/* DARK ICON — now hides the widget (but timer keeps running) */}
                <Box
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onClick={handleHide}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleHide(); }
                }}
                sx={{
                    width: expanded ? 44 : 28,
                    height: expanded ? 44 : 28,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#522A70',
                    cursor: 'pointer',
                    outline: 'none',
                    '&:focus-visible': { boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}33` },
                }}
                title="Hide timer"
                >
                <img src="/icons/timerDark.svg" alt="Timer" width={expanded ? 28 : 18} height={expanded ? 28 : 18} />
                </Box>

                {/* READOUT — expands presets (won’t collapse) */}
                <Box
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                aria-controls="timer-presets"
                onClick={() => { if (!expanded) setExpanded(true); }}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !expanded) { e.preventDefault(); setExpanded(true); }
                }}
                sx={{
                    height: expanded ? 40 : 28,
                    display: 'grid',
                    placeItems: 'center',
                    px: expanded ? 1.5 : 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'white',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: expanded ? 140 : 96,
                    '&:focus-visible': { boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}33` },
                }}
                title="Set timer"
                >
                <Typography variant={expanded ? 'body1' : 'body2'} sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    {fmt(seconds)}
                </Typography>
                </Box>

                <IconButton
                size="small"
                onClick={running ? onPause : onResume}
                title={running ? 'Pause' : 'Play'}
                sx={{
                    border: '1px solid', borderColor: 'divider', bgcolor: 'white',
                    width: expanded ? 40 : 28, height: expanded ? 40 : 28,
                }}
                >
                {running ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                </IconButton>

                <IconButton
                size="small"
                onClick={() => { onReset?.(); setExpanded(false); }}
                title="Reset"
                sx={{
                    border: '1px solid', borderColor: 'divider', bgcolor: 'white',
                    width: expanded ? 40 : 28, height: expanded ? 40 : 28,
                }}
                >
                <ReplayIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* PRESETS */}
            <Collapse in={expanded} timeout={160} mountOnEnter unmountOnExit>
                <Divider sx={{ my: 1 }} />
                <Grid id="timer-presets" container spacing={1} columns={12} sx={{ mb: 1 }}>
                {[0, 1, 5, 10, 15, 20, 30].map((m) => (
                    <Grid item xs={4} key={`m-${m}`}>
                    <Button
                        fullWidth size="small"
                        variant={isSelected(m) ? 'contained' : 'outlined'}
                        onClick={() => setTimer(m)}
                        sx={{
                        textTransform: 'none', fontWeight: 700, borderRadius: 2,
                        borderColor: '#5E35B1',
                        color: isSelected(m) && m !== 0 ? 'white' : '#5E35B1',
                        bgcolor: isSelected(m) && m !== 0 ? '#5E35B1' : 'transparent',
                        '&:hover': { borderColor: '#5E35B1', bgcolor: isSelected(m) ? '#5E35B1' : 'rgba(94,53,177,0.06)' },
                        }}
                    >
                        {minsLabel(m)}
                    </Button>
                    </Grid>
                ))}
                </Grid>

                <Grid container spacing={1} columns={12}>
                {[60, 90, 120, 150, 180].map((m) => (
                    <Grid item xs={4} key={`h-${m}`}>
                    <Button
                        fullWidth size="small"
                        variant={isSelected(m) ? 'contained' : 'outlined'}
                        onClick={() => setTimer(m)}
                        sx={{
                        textTransform: 'none', fontWeight: 700, borderRadius: 2,
                        borderColor: '#B3261E',
                        color: isSelected(m) ? 'white' : '#B3261E',
                        bgcolor: isSelected(m) ? '#B3261E' : 'transparent',
                        '&:hover': { borderColor: '#B3261E', bgcolor: isSelected(m) ? '#B3261E' : 'rgba(179,38,30,0.06)' },
                        }}
                    >
                        {minsLabel(m)}
                    </Button>
                    </Grid>
                ))}
                </Grid>
            </Collapse>
            </Stack>
        </Paper>
        </Popper>
    );
}
