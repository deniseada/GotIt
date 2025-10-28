"use client";
import SideBar from "./sideBar";
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import styles from "../mvp.module.css";
import NavBar from "./NavBar";
import Link from "next/link";

// Components
import SplitView from "./SplitView";
import ModeTabs from "./ModeTabs";
import ToolBar from "./ToolBar";

// Right side modals and their buttons
import RightDockButtons from "./rightSideModals/RightDockButtons";
import useModal from "./useModal";
import TimerPopover from "./TimerPopover";
import AIModal from "./AIModal";
import VocabModal from "./VocabModal";

export default function DocScreen() {
  const [split, setSplit] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("simplified");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Split view + zoom
  const toggleSplit = () => setSplit((s) => !s);
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const zoomReset = () => setZoom(1);

  // Press 'S' to toggle split view
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "s") setSplit((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Right Side Buttons (AI/Vocab)
  const ai = useModal(false);
  const vocab = useModal(false);

  // ===== TIMER (single source of truth) =====
  const timerBtnRef = useRef(null); // anchor for Popper
  const [timerOpen, setTimerOpen] = useState(false); // UI visibility (mini/presets)
  const [timerSeconds, setTimerSeconds] = useState(0); // remaining seconds
  const [timerRunning, setTimerRunning] = useState(false); // ticking state

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
  };

  // Choosing a time from presets
  const handleTimerChange = (mins) => {
    const secs = Math.max(0, mins * 60);
    setTimerSeconds(secs);
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

  // Stop at 0
  useEffect(() => {
    if (timerSeconds === 0 && timerRunning) setTimerRunning(false);
  }, [timerSeconds, timerRunning]);

  // ===== MOCK CONTENT (unchanged) =====
  function MockOriginalPage({ page, zoom }) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          p: 2,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: `${Math.min(900, 700 * zoom)}px`,
            height: "100%",
            bgcolor: "common.white",
            borderRadius: 2,
            boxShadow: 4,
            p: 3,
            overflow: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {page}. Atomic Structure
          </Typography>
          <Typography variant="body3" paragraph>
            Understanding electricity necessitates starting with the study of
            atoms. The atom is the basic building block of the universe. All
            matter is made from a combination of atoms. Matter is any substance
            that has mass and occupies space. Matter can exist in any of three
            states: solid, liquid, or gas. Water, for example, can exist as a
            solid in the form of ice, as a liquid, or as a gas in the form of
            steam (Figure 1–3). An element is a substance that cannot be
            chemically divided into two or more simpler substances. A table
            listing both natural and artificial elements is shown in Figure 1–4.
            An atom is the smallest part of an element. The three principal
            parts of an atom are the electron, the neutron, and the proton.
            Although most atoms contain these three principal parts, the
            smallest atom, hydrogen, does not contain a neutron (Figure 1–5).
            Hydrogen contains one proton and one electron. The smallest atom
            that contains neutrons is helium (Figure 1–6). Helium contains two
            protons, two neutrons, and two electrons. It is theorized that
            protons and neutrons are actually made of smaller particles called
            quarks. Notice that the proton has a positive charge, the electron a
            negative charge, and the neutron no charge. The neutrons and the
            protons combine to form the nucleus of the atom. Since the neutron
            has no charge, the nucleus has a net positive charge. The number of
            protons in the nucleus determines what kind of element an atom is.
            Oxygen, for example, contains 8 protons in its nucleus, and gold
            contains 79. The atomic number of an element is the same as the
            number of protons in the nucleus. The lines of force produced by the
            positive charge of the proton extend outward in all directions
            (Figure 1–7). The nucleus may or may not contain as many neutrons as
            protons. For example, an atom of helium contains 2 protons and 2
            neutrons in its nucleus, while an atom of copper contains 29 protons
            and 35 neutrons (Figure 1–8).
          </Typography>
          <Typography variant="body3" paragraph>
            The electron orbits the outside of the nucleus. Notice in Figure 1–5
            that the electron is shown to be larger than the proton. Actually,
            an electron is about three times as large as a proton. The estimated
            size of a proton is 0.07 trillionth of an inch in diameter, and the
            estimated size of an electron is 0.22 trillionth of an inch in
            diameter. Although the electron is larger in size, the proton weighs
            about 1840 times more. Imagine comparing a soap bubble with a piece
            of buckshot. Compared with the electron, the proton is a very
            massive particle. Since the electron exhibits a negative charge, the
            lines of force come in from all directions.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Law of Charges
          </Typography>
          <Typography variant="body3" paragraph>
            Understanding atoms necessitates first understanding a basic law of
            physics that states that opposite charges attract and like charges
            repel. In Figure 1–10, which illustrates this principle, charged
            balls are suspended from strings. Notice that the two balls that
            contain opposite charges are attracted to each other. The two
            positively charged balls and the two negatively charged balls repel
            each other. The reason for this is that lines of force can never
            cross each other. The outward-going lines of force of a positively
            charged object combine with the inward-going lines of force of a
            negatively charged object (Figure 1–11). This combining produces an
            attraction between the two objects. If two objects with like charges
            come close to each other, the lines of force repel (Figure 1–12).
          </Typography>
          <Typography variant="body3" paragraph>
            Since the nucleus has a net positive charge and the electron has a
            negative charge, the electron is attracted to the nucleus. Because
            the nucleus of an atom is formed from the combination of protons and
            neutrons, one may ask why the protons of the nucleus do not repel
            each other since they all have the same charge. Two theories attempt
            to explain this. The first theory asserted that the force of gravity
            held the nucleus together. Neutrons, like protons, are extremely
            massive particles. It was first theorized that the gravitational
            attraction caused by their mass overcame the repelling force of the
            positive charges. By the mid 1930s, however, it was known that the
            force of gravity could not hold the nucleus together. According to
            Coulomb’s law, the electromagnetic force in helium is about 1.1 1036
            times greater than the gravitational force as determined by Newton’s
            law. In 1947, the Japanese physicist Hideki Yukawa identified a
            subatomic particle that acts as a mediator to hold the nucleus
            together. The particle is a quark known as a gluon. The force of the
            gluon is about 102 times stronger than the electromagnetic force.
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Zoom: {(zoom * 100).toFixed(0)}%
          </Typography>
        </Box>
      </Box>
    );
  }

  function MockRightPane({ mode, page, zoom }) {
    return (
      <Box
        sx={{
          height: "100%",
          p: 2,
          bgcolor: "background.paper",
          borderRadius: { xs: 0, md: 2 },
          boxShadow: 1,
          overflow: "auto",
        }}
      >
        {mode === "simplified" && (
          <>
            <Typography variant="h5" gutterBottom>
              {page}. Atoms
            </Typography>
            <ul style={{ marginTop: 0 }}>
              <li>Everything is made of atoms.</li>
              <li>
                Atoms have protons (+), neutrons (no charge), and electrons (–).
              </li>
              <li>Protons + Neutrons = Nucleus (center of atom).</li>
              <li>Electrons move around the nucleus.</li>
              <li>The number of protons = the element (e.g., oxygen has 8).</li>
            </ul>
            <ul>
              <Typography variant="h5" gutterBottom>
                Law of Charges
              </Typography>
              <li>Opposites attract ( + & – ).</li>
              <li>Likes repel ( + & + or – & – ).</li>
              <li>
                The nucleus stays together because of a strong force called the
                gluon force.
              </li>
            </ul>
            <Typography variant="caption" color="text.secondary">
              Zoom: {(zoom * 100).toFixed(0)}%
            </Typography>
          </>
        )}
        {mode === "summarized" && (
          <Typography variant="body6" gutterBottom>
            Summary
            <br></br>
            This text explains that everything in the universe is made of atoms,
            which are tiny particles containing protons, neutrons, and
            electrons. Protons and neutrons form the nucleus at the center of
            the atom, while electrons move around it. The number of protons
            determines what element the atom is. Protons have a positive charge,
            electrons a negative charge, and neutrons no charge. Because
            opposite charges attract and like charges repel, electrons stay near
            the positively charged nucleus. The nucleus itself stays together
            because of a powerful force called the strong nuclear force, carried
            by particles known as gluons.
          </Typography>
        )}
        {mode === "mindmap" && (
          <img
            src="/icons/Mind_Map_Example.png"
            alt="mind-map"
            height="700px"
            width="700px"
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <NavBar title={"Delmar's Standard Textbook of Electricity"} />
      {/* Toolbar */}
      <ToolBar
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        split={split}
        onToggleSplit={toggleSplit}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      {/* Main content */}
      <Box
        className={styles.contentUnderToolbar}
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: sidebarOpen ? "280px 1fr" : "1fr",
          columnGap: 0,
          pl: sidebarOpen ? 0 : { xs: 1, md: 2 },
          pr: { xs: 1, md: 2 },
          pb: { xs: 1, md: 2 },
          pt: 0, // keep content flush to toolbar
        }}
      >
        {sidebarOpen && <SideBar />}
        {split ? (
          <SplitView
            left={<MockOriginalPage page={page} zoom={zoom} />}
            right={
              <Box
                sx={{
                  height: "100%",
                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                }}
              >
                <ModeTabs value={mode} onChange={setMode} />
                <MockRightPane mode={mode} page={page} zoom={zoom} />
              </Box>
            }
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              borderRadius: 0,
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "auto",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              p: 2,
            }}
          >
            <MockOriginalPage page={page} zoom={zoom} />
          </Box>
        )}
      </Box>

      {/* RIGHT-SIDE BUTTONS */}
      <RightDockButtons
        timerBtnRef={timerBtnRef}
        onOpenTimer={openTimer}
        onOpenB={() => (ai.open ? ai.onClose() : ai.onOpen())}
        onOpenC={vocab.onOpen}
      />

      {/* TIMER (persistent; hiding doesn't pause) */}
      <TimerPopover
        anchorEl={timerBtnRef.current}
        open={timerOpen}
        onHide={handleTimerHide} // hides visually, keeps ticking
        seconds={timerSeconds}
        running={timerRunning}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onChange={handleTimerChange}
      />

      {/* Other modals */}
      <AIModal open={ai.open} onClose={ai.onClose} />
      <VocabModal open={vocab.open} onClose={vocab.onClose} />
    </Box>
  );
}
