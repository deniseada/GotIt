"use client";
import React from "react";
import { Tooltip, IconButton, Box } from "@mui/material";

export default function RightDockButtons({
  timerBtnRef,
  onOpenTimer,
  aiBtnRef,
  onOpenA,
  onOpenB,
  vocabBtnRef,
  onOpenC,
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        right: 16,
        top: "50%",
        transform: "translateY(-50%)",
        display: "grid",
        gap: 1.5,
        zIndex: 1200,
      }}
    >
      <Tooltip title="Timer">
        <IconButton
          ref={timerBtnRef}
          onClick={onOpenTimer}
          sx={{
            bgcolor: "background.paper",
            boxShadow: 2,

            width: 48,
            height: 48,
            borderRadius: "14px",
          }}
        >
          <img src="/icons/timerLight.svg" alt="" width="40" height="40" />
        </IconButton>
      </Tooltip>
      <Tooltip title="AI">
        <IconButton
          ref={aiBtnRef}
          onClick={onOpenB}
          sx={{
            bgcolor: "background.paper",
            boxShadow: 2,

            width: 48,
            height: 48,
            borderRadius: "14px",
          }}
        >
          <img src="/icons/aiLight.svg" alt="ai" width="40" height="40" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Vocab">
        <IconButton
          ref={vocabBtnRef}
          onClick={onOpenC}
          sx={{
            bgcolor: "background.paper",
            boxShadow: 2,

            width: 48,
            height: 48,
            borderRadius: "14px",
          }}
        >
          <img src="/icons/Vocab.svg" alt="vocab" width="40" height="40" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
