"use client";

import React from "react";
import SettingsOverlay from "./components/SettingsOverlay";
import useModal from "../doc/components/useModal";

export default function SettingsPage() {
  const settingsModal = useModal(true); // Open by default when navigating to settings

  return (
    <SettingsOverlay open={settingsModal.open} onClose={settingsModal.onClose} />
  );
}

