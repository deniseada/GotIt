"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function TimerCompletionDialog({ open, onClose, minutes }) {
  const formatTime = (mins) => {
    if (mins < 60) {
      return `${mins} ${mins === 1 ? "minute" : "minutes"} of studying!`;
    } else if (mins % 60 === 0) {
      const hours = Math.floor(mins / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} of studying!`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours} ${hours === 1 ? "hour" : "hours"} and ${remainingMins} ${remainingMins === 1 ? "minute" : "minutes"} of studying!`;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          textAlign: "center",
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#522A70",
          pb: 1,
        }}
      >
        🎉 Yay! You've finished!
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            mt: 1,
          }}
        >
          {formatTime(minutes)}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#522A70",
            color: "white",
            fontWeight: 600,
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#3d1f52",
            },
          }}
        >
          Awesome!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

