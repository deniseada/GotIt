'use client';
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';



export default function DraggableDivider({ axis = 'x', onDrag }) {
    const dragging = useRef(false);
    const last = useRef(null);

    const currentAxis = () => (typeof axis === 'string' ? axis : (window.innerWidth < 900 ? axis.xs : axis.md));

    useEffect(() => {
        const onMove = (e) => {
        if (!dragging.current) return;
        const a = currentAxis();
        const cur = a === 'x' ? e.clientX : e.clientY;
        if (last.current != null) onDrag(cur - last.current);
        last.current = cur;
        };
        const onUp = () => {
        dragging.current = false;
        last.current = null;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        };
    }, [onDrag, axis]);

    const start = (e) => {
        dragging.current = true;
        last.current = currentAxis() === 'x' ? e.clientX : e.clientY;
        document.body.style.cursor = currentAxis() === 'x' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
  };

    return (
        <Box
        onMouseDown={start}
        role="separator"
        tabIndex={0}
        sx={{
            bgcolor: 'divider',
            cursor: { xs: 'row-resize', md: 'col-resize' },
            '&:hover': { bgcolor: 'text.disabled' },
        }}
        />
    );
}
