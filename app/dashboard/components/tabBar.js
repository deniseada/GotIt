"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "../dashboard.module.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UploadButton from "./uploadButton";
import DocCard from "../components/DocCard"; 

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabBar() {
  const [value, setValue] = useState(0); // 0 All, 1 Recent, 2 Bookmarked, 3 Course Books, 4 Uploaded
  const [filterOpen, setFilterOpen] = useState(false);
  const [emotion, setEmotion] = useState("none"); // "none" | "confident" | "needs" | "neutral"
  const filterRef = useRef(null);

  const handleChange = (_e, newValue) => setValue(newValue);

  // --- Sample data (replace with real data later)
  const cards = [
    {
      id: "1",
      title: "Electrical Codes and Regulations",
      category: "Course Books",
      bookmarked: true,
      updatedAt: "2025-10-20T18:12:00.000Z",
      emotion: "confident",
    },
    {
      id: "2",
      title: "Lecture Slides - Chp 3 to 6",
      category: "Uploaded",
      bookmarked: false,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "confident",
    },
        {
      id: "3",
      title: "Electrical Codes and Regulations",
      category: "Course Books",
      bookmarked: false,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "needs",
    },
        {
      id: "4",
      title: "Lecture Slides - Chp 1 to 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "neutral",
    },
  ];

  const renderGrid = () => (
    <div className={styles.cardsGrid}>
      {filteredCards.length === 0 ? (
        <p className={styles.emptyState}>No items match this filter.</p>
      ) : (
        filteredCards.map((c) => (
          <DocCard
            key={c.id}
            {...c}
            onToggleBookmark={() =>
              setCardList((prev) =>
                prev.map((card) =>
                  card.id === c.id
                    ? { ...card, bookmarked: !card.bookmarked }
                    : card
                )
              )
            }
          />
        ))
      )}
    </div>
  );

  // Bookmark states
const [cardList, setCardList] = useState(cards);

  // Close filter menu on outside click or Escape key
  useEffect(() => {
    function onDocClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setFilterOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleFilter = (e) => {
    e.stopPropagation();
    setFilterOpen((s) => !s);
  };

  // Card Filtering
  const filteredCards = useMemo(() => {
    let base = cardList;

    switch (value) {
      case 1: // Recent
        base = [...cardList].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        break;
      case 2: // Bookmarked
        base = cardList.filter((c) => c.bookmarked);
        break;
      case 3: // Course Books
        base = cardList.filter((c) => c.category === "Course Books");
        break;
      case 4: // Uploaded
        base = cardList.filter((c) => c.category === "Uploaded");
        break;
      default: // All
        base = cardList;
    }
    if (emotion !== "none") {
      base = base.filter((c) => (c.emotion || "neutral") === emotion);
    }
    return base;
  }, [cardList, value, emotion]);

  // Render once; content changes with filters
  const Content = (
    <div className={styles.contentWrap}>
      {filteredCards.length === 0 ? (
        <p className={styles.emptyState}>No items match this filter.</p>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredCards.map((c) => (
            <DocCard 
              key={c.id} 
              {...c}
              onToggleBookmark={() =>
                setCardList((prev) =>
                  prev.map((card) =>
                    card.id === c.id ? { ...card, bookmarked: !card.bookmarked } : card
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <div className={styles.tabRow}>
        <div className={styles.tabsWrapper}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="dashboard tabs"
            className={styles.TabBar}
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Recent" {...a11yProps(1)} />
            <Tab label="Bookmarked" {...a11yProps(2)} />
            <Tab label="Course Books" {...a11yProps(3)} />
            <Tab label="Uploaded" {...a11yProps(4)} />
          </Tabs>
        </div>

        {/* FILTER */}
        <div className={styles.filterContainer} ref={filterRef}>
          <button
            className={styles.filterPill}
            onClick={toggleFilter}
            aria-haspopup="true"
            aria-expanded={filterOpen}
            type="button"
          >
            <span className={styles.filterText}>
              {emotion === "none"
                ? "No Filter"
                : emotion === "confident"
                ? "Confident"
                : emotion === "needs"
                ? "Needs Review"
                : "Neutral"}
            </span>
          </button>

          <button
            type="button"
            className={styles.filterIconContainer}
            onClick={toggleFilter}
            aria-label="Open filters"
          >
            <img src="/icons/filterIcon.svg" className={styles.filterIcon} alt="" />
          </button>

          {filterOpen && (
            <div className={styles.filterMenu} role="menu">
              <div className={styles.filterInner}>
                <button
                  className={styles.filterOption}
                  role="menuitem"
                  onClick={() => {
                    setEmotion("confident");
                    setFilterOpen(false);
                  }}
                >
                  <span className={styles.optionPill}>Confident</span>
                  <span className={styles.optionIcon} aria-hidden>
                    <img
                      src="/icons/happyFilter.svg"
                      alt="Confident"
                      className={styles.filterEmotionIcons}
                    />
                  </span>
                </button>

                <div className={styles.separator} />

                <button
                  className={styles.filterOption}
                  role="menuitem"
                  onClick={() => {
                    setEmotion("needs");
                    setFilterOpen(false);
                  }}
                >
                  <span className={styles.optionPillNeeds}>Needs Review</span>
                  <span className={styles.optionIcon} aria-hidden>
                    <img
                      src="/icons/sadFilter.svg"
                      alt="Needs review"
                      className={styles.filterEmotionIcons}
                    />
                  </span>
                </button>

                <div className={styles.separator} />

                <button
                  className={styles.filterOption}
                  role="menuitem"
                  onClick={() => {
                    setEmotion("neutral");
                    setFilterOpen(false);
                  }}
                >
                  <span className={styles.optionPillNeutral}>Neutral</span>
                  <span className={styles.optionIcon} aria-hidden>
                    <img
                      src="/icons/neutralFilter.svg"
                      alt="Neutral"
                      className={styles.filterEmotionIcons}
                    />
                  </span>
                </button>

                <div className={styles.separator} />

                <div className={styles.filterFooter}>
                  <button
                    className={styles.clearFilterBtn}
                    onClick={() => {
                      setEmotion("none");
                      setFilterOpen(false);
                    }}
                  >
                    No Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Rendering Cards */}
      <CustomTabPanel value={value} index={0}>
        <div className={styles.contentWrap}>
          <UploadButton />
            {renderGrid()}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <div className={styles.contentWrap}>
          <UploadButton />
          {renderGrid()}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <div className={styles.contentWrap}>
          <UploadButton />
          {renderGrid()}
        </div>
      </CustomTabPanel>

<CustomTabPanel value={value} index={3}>
        <div className={styles.contentWrap}>
          <UploadButton />
          {renderGrid()}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <div className={styles.contentWrap}>
          <UploadButton />
          {renderGrid()}
        </div>
      </CustomTabPanel>

    </Box>
  );
}
