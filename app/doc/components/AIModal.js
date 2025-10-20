'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function AIModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>AI Assistant</DialogTitle>
        <DialogContent dividers>AI tools go here…</DialogContent>
        <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
        </Dialog>
    );
}
