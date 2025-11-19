// ModeTabs are the tabs to switch between different AI modes in the right panel

'use client';
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import styles from '../mvp.module.css';


export default function ModeTabs({ value, onChange }) {
    const handle = (_, v) => onChange(v);
    return (
        <Box className={styles.modeTabsContainer}>
        <Tabs value={value} onChange={handle} variant="scrollable" className={styles.modeTabs}>
            <Tab value="simplified" label="Simplified" />
            <Tab value="summarized" label="Summarized" />
            <Tab value="mindmap" label="Mind-map" />
        </Tabs>
        </Box>
    );
}
