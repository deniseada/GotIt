'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function VocabModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Vocabulary</DialogTitle>
        <DialogContent dividers>Vocabulary list / definitions…</DialogContent>
        <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
        </Dialog>
    );
}
