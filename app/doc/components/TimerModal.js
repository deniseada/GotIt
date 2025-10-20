'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function TimerModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Timer</DialogTitle>
        <DialogContent dividers>
            <Button variant="contained" color="primary">Start Timer</Button>
        </DialogContent>
        <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
        </Dialog>
    );
}