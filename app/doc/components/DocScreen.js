'use client';
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SplitView from './SplitView';
import ModeTabs from './ModeTabs';
import ZoomControls from './ZoomControls';
import ToolBar from './ToolBar'; 


export default function DocScreen() {
    const [split, setSplit] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState('simplified');

    const toggleSplit = () => setSplit(s => !s);

    function MockOriginalPage({ page, zoom }) {
        return (
            <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
            <Box
                sx={{
                width: `${Math.min(900, 700 * zoom)}px`,
                aspectRatio: '8.5 / 11',
                bgcolor: 'common.white',
                borderRadius: 2,
                boxShadow: 4,
                p: 3,
                overflow: 'auto',
                }}
            >
                <Typography variant="h6" gutterBottom>
                {page}. Manual Circuits
                </Typography>
                <Typography variant="body2" paragraph>
                (Original document mock) A manual circuit is started/stopped by a person...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                Zoom: {(zoom * 100).toFixed(0)}%
                </Typography>
            </Box>
            </Box>
        );
    }

    function MockRightPane({ mode, page, zoom }) {
        return (
            <Box sx={{ height: '100%', p: 2, bgcolor: 'background.paper', borderRadius: { xs: 0, md: 2 }, boxShadow: 1, overflow: 'auto' }}>
            {mode === 'simplified' && (
                <>
                <Typography variant="h6" gutterBottom>
                    {page}. Manual Circuits — Simplified
                </Typography>
                <ul style={{ marginTop: 0 }}>
                    <li>Manual = controlled by a person.</li>
                    <li>Three-wire: Stop (NC), Start (NO), Motor Starter (with OLR).</li>
                    <li>OLR protects the motor from overheating.</li>
                </ul>
                <Typography variant="caption" color="text.secondary">
                    Zoom: {(zoom * 100).toFixed(0)}%
                </Typography>
                </>
            )}
            {mode === 'summarized' && (
                <Typography variant="body2">
                Summary: Start/stop energizes a motor via a starter; overloads open on high current.
                </Typography>
            )}
            {mode === 'mindmap' && (
                <Typography variant="body2">
                Mind map: Manual → Inputs: Stop/Start → Output: Starter → Safety: OLR → Behavior.
                </Typography>
            )}
            </Box>
        );
    }
    
    return (
        <div>
            <ToolBar
            page={page}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => p + 1)}
            split={split}
            onToggleSplit={toggleSplit} /><Box sx={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 1, p: { xs: 1, md: 2 } }}>
                <ZoomControls
                    zoom={zoom}
                    onZoomIn={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}
                    onZoomOut={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                    onReset={() => setZoom(1)} />


                {split ? (
                    <SplitView
                        left={<MockOriginalPage page={page} zoom={zoom} />}
                        right={<Box sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
                            <ModeTabs value={mode} onChange={setMode} />
                            <MockRightPane mode={mode} page={page} zoom={zoom} />
                        </Box>} />
                ) : (
                    <Box sx={{ height: '100%', borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1, overflow: 'hidden', display: 'grid', placeItems: 'center', p: 2 }}>
                        <MockOriginalPage page={page} zoom={zoom} />
                    </Box>
                )}
            </Box>
        </div>
    );
}
