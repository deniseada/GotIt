'use client';
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';


export default function ModeTabs({ value, onChange }) {
    const handle = (_, v) => onChange(v);
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}>
        <Tabs value={value} onChange={handle} variant="scrollable">
            <Tab value="simplified" label="Simplified" />
            <Tab value="summarized" label="Summarized" />
            <Tab value="mindmap" label="Mind Map" />
        </Tabs>
        </Box>
    );
}
