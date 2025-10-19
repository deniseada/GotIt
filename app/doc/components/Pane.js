'use client';
import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


export default function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', px: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>{Math.round(zoom * 100)}%</Typography>
        <Tooltip title="Zoom out"><IconButton onClick={onZoomOut}><ZoomOutIcon /></IconButton></Tooltip>
        <Tooltip title="Reset zoom"><IconButton onClick={onReset}><RestartAltIcon /></IconButton></Tooltip>
        <Tooltip title="Zoom in"><IconButton onClick={onZoomIn}><ZoomInIcon /></IconButton></Tooltip>
        </Box>
    );
}
