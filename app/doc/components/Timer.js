"use client";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import TimerPopover from "./TimerPopover";
import TimerCompletionDialog from "./TimerCompletionDialog";

const Timer = forwardRef(function Timer({ buttonRef }, ref) {
  const [timerOpen, setTimerOpen] = useState(false); // UI visibility (mini/presets)
  const [timerSeconds, setTimerSeconds] = useState(0); // remaining seconds
  const [timerRunning, setTimerRunning] = useState(false); // ticking state
  const [originalTimerMinutes, setOriginalTimerMinutes] = useState(0); // original duration in minutes
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false); // completion popup

  // Expose ref methods to parent
  useImperativeHandle(ref, () => ({
    openTimer: () => setTimerOpen(true),
  }));

  // Show the mini timer UI
  const openTimer = () => setTimerOpen(true);
  // Hide UI only (do not pause)
  const handleTimerHide = () => setTimerOpen(false);

  // Start/pause/reset
  const pauseTimer = () => setTimerRunning(false);
  const resumeTimer = () => {
    if (timerSeconds > 0) setTimerRunning(true);
  };
  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(false);
    setOriginalTimerMinutes(0);
    setCompletionDialogOpen(false); // close dialog if open
  };

  // Choosing a time from presets
  const handleTimerChange = (mins) => {
    const secs = Math.max(0, mins * 60);
    setTimerSeconds(secs);
    setOriginalTimerMinutes(mins); // store original duration
    setTimerRunning(secs > 0); // auto-start if > 0
    setTimerOpen(true); // keep UI visible right after selection (mini collapses inside)
  };

  // Tick every second while running — independent of visibility
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const id = setInterval(() => {
      setTimerSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  // Stop at 0 and show completion popup
  useEffect(() => {
    if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Show completion popup if timer was actually set (not just reset)
      if (originalTimerMinutes > 0) {
        setCompletionDialogOpen(true);
      }
    }
  }, [timerSeconds, timerRunning, originalTimerMinutes]);

  return (
    <>
      <TimerPopover
        anchorEl={buttonRef?.current}
        open={timerOpen}
        onHide={handleTimerHide} // hides visually, keeps ticking
        seconds={timerSeconds}
        running={timerRunning}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onChange={handleTimerChange}
      />

      <TimerCompletionDialog
        open={completionDialogOpen}
        onClose={() => setCompletionDialogOpen(false)}
        minutes={originalTimerMinutes}
      />
    </>
  );
});

export default Timer;

