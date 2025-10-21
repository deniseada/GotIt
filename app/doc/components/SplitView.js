'use client';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import DraggableDivider from './DraggableDivider';



export default function SplitView({ left, right }) {
    const [ratio, setRatio] = useState(0.52);

    return (
        <Box
        sx={{
            height: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.default',
            boxShadow: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: `${ratio}fr 8px ${1 - ratio}fr` },
            gridTemplateRows: { xs: '1fr 8px 1fr', md: '1fr' },
        }}
        >
        <Box sx={{ height: '100%', overflow: 'hidden' }}>{left}</Box>
        <DraggableDivider
            axis={{ xs: 'y', md: 'x' }}
            onDrag={(delta) => {
            const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
            setRatio(prev => Math.min(0.85, Math.max(0.15, prev + delta / width)));
            }}
        />
        <Box sx={{ height: '100%', overflow: 'hidden' }}>{right}</Box>
        </Box>
  );
}
