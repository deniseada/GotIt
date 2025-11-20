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
  const [value, setValue] = useState(0); // 0 All, 1 Recent, 2 Uploaded, 3 Bookmarked, 4 Course Books
  const [filterOpen, setFilterOpen] = useState(false);
  const [emotion, setEmotion] = useState("none"); // "none" | "confident" | "needs" | "neutral"
  const filterRef = useRef(null);

  const handleChange = (_e, newValue) => setValue(newValue);

  // --- Sample data (replace with real data later)
  const initialCards = [
    // Recent section cards
    {
      id: "recent-1",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 1",
      category: "",
      bookmarked: false,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "confident",
    },
    {
      id: "recent-2",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 3",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "needs",
    },
    {
      id: "recent-3",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 4",
      category: "",
      bookmarked: false,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "neutral",
    },
    // Uploaded section cards
    {
      id: "uploaded-1",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Uploaded",
      category: "Uploaded",
      bookmarked: false,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "confident",
    },
    {
      id: "uploaded-2",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Uploaded",
      category: "Uploaded",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "needs",
    },
    {
      id: "uploaded-3",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Uploaded",
      category: "Uploaded",
      bookmarked: false,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "neutral",
    },
    // Bookmarked section cards
    {
      id: "bookmarked-1",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "needs",
    },
    {
      id: "bookmarked-2",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "neutral",
    },
    {
      id: "bookmarked-3",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "confident",
    },
    {
      id: "bookmarked-4",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "confident",
    },
    {
      id: "bookmarked-5",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "needs",
    },
    {
      id: "bookmarked-6",
      title: "Delmar's Standard Textbook for Electricity",
      kind: "Section 2",
      category: "",
      bookmarked: true,
      updatedAt: "2025-10-25T15:00:00.000Z",
      emotion: "neutral",
    },
    // Course Books section cards
    {
      id: "course-1",
      title: "Electrical Codes and Regulations 2024",
      kind: "",
      category: "Course Books",
      bookmarked: false,
      updatedAt: "2025-10-20T18:12:00.000Z",
      emotion: "neutral",
    },
    {
      id: "course-2",
      title: "Electrical Codes and Regulations 2021",
      kind: "",
      category: "Course Books",
      bookmarked: false,
      updatedAt: "2025-10-20T18:12:00.000Z",
      emotion: "neutral",
    },
  ];

  // Load bookmarks from localStorage
  const loadBookmarksFromStorage = () => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("got-it-bookmarks");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading bookmarks from localStorage:", error);
      return {};
    }
  };

  // Save bookmarks to localStorage
  const saveBookmarksToStorage = (bookmarks) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("got-it-bookmarks", JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Error saving bookmarks to localStorage:", error);
    }
  };

  // Load emotions from localStorage
  const loadEmotionsFromStorage = () => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("got-it-emotions");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading emotions from localStorage:", error);
      return {};
    }
  };

  // Save emotions to localStorage
  const saveEmotionsToStorage = (emotions) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("got-it-emotions", JSON.stringify(emotions));
    } catch (error) {
      console.error("Error saving emotions to localStorage:", error);
    }
  };

  // Initialize cards with bookmarks and emotions from localStorage
  const initializeCardsWithBookmarks = () => {
    const storedBookmarks = loadBookmarksFromStorage();
    const storedEmotions = loadEmotionsFromStorage();
    return initialCards.map((card) => ({
      ...card,
      bookmarked: storedBookmarks[card.id] !== undefined 
        ? storedBookmarks[card.id] 
        : card.bookmarked,
      emotion: storedEmotions[card.id] !== undefined
        ? storedEmotions[card.id]
        : card.emotion,
    }));
  };

  const renderGrid = () => (
    <div className={styles.cardsGrid}>
      {filteredCards.length === 0 ? (
        <p className={styles.emptyState}>No items match this filter.</p>
      ) : (
        filteredCards.map((c) => (
          <DocCard
            key={c.id}
            {...c}
            lastOpened={c.updatedAt}
            onToggleBookmark={() =>
              setCardList((prev) =>
                prev.map((card) =>
                  card.id === c.id
                    ? { ...card, bookmarked: !card.bookmarked }
                    : card
                )
              )
            }
            onEmotionChange={(newEmotion) =>
              setCardList((prev) =>
                prev.map((card) =>
                  card.id === c.id
                    ? { ...card, emotion: newEmotion }
                    : card
                )
              )
            }
          />
        ))
      )}
    </div>
  );

  // Render grid wrapped in section container for individual tabs
  const renderGridWithSection = (sectionTitle, gridClass = styles.cardsGrid) => {
    if (filteredCards.length === 0) {
      return (
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
          <p className={styles.emptyState}>No items match this filter.</p>
        </div>
      );
    }

    return (
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
        <div className={gridClass}>
          {filteredCards.map((c) => (
            <DocCard
              key={c.id}
              {...c}
              lastOpened={c.updatedAt}
              onToggleBookmark={() =>
                setCardList((prev) =>
                  prev.map((card) =>
                    card.id === c.id
                      ? { ...card, bookmarked: !card.bookmarked }
                      : card
                  )
                )
              }
              onEmotionChange={(newEmotion) =>
                setCardList((prev) =>
                  prev.map((card) =>
                    card.id === c.id
                      ? { ...card, emotion: newEmotion }
                      : card
                  )
                )
              }
            />
          ))}
        </div>
      </div>
    );
  };

  // Render sections with headers for "All" tab
  const renderSections = () => {
    // Group cards by category
    const recentCards = [...cardList]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .filter((c) => {
        if (emotion !== "none") {
          return (c.emotion || "neutral") === emotion;
        }
        return true;
      })
      .slice(0, 3); // Show only 3 most recent cards

    const uploadedCards = cardList.filter((c) => {
      if (c.category !== "Uploaded") return false;
      if (emotion !== "none") {
        return (c.emotion || "neutral") === emotion;
      }
      return true;
    });

    const bookmarkedCards = cardList.filter((c) => {
      if (!c.bookmarked) return false;
      if (emotion !== "none") {
        return (c.emotion || "neutral") === emotion;
      }
      return true;
    });

    const courseBookCards = cardList.filter((c) => {
      if (c.category !== "Course Books") return false;
      if (emotion !== "none") {
        return (c.emotion || "neutral") === emotion;
      }
      return true;
    });

    const renderCardSection = (cards, sectionTitle, gridClass = styles.cardsGrid) => {
      if (cards.length === 0) return null;

      return (
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
          <div className={gridClass}>
            {cards.map((c) => (
              <DocCard
                key={c.id}
                {...c}
                lastOpened={c.updatedAt}
                onToggleBookmark={() =>
                  setCardList((prev) =>
                    prev.map((card) =>
                      card.id === c.id
                        ? { ...card, bookmarked: !card.bookmarked }
                        : card
                    )
                  )
                }
                onEmotionChange={(newEmotion) =>
                  setCardList((prev) =>
                    prev.map((card) =>
                      card.id === c.id
                        ? { ...card, emotion: newEmotion }
                        : card
                    )
                  )
                }
              />
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className={styles.sectionsWrapper}>
        {renderCardSection(recentCards, "Recent")}
        {renderCardSection(uploadedCards, "Uploaded")}
        {renderCardSection(bookmarkedCards, "Bookmarked")}
        {renderCardSection(courseBookCards, "Course Book", styles.courseBookGrid)}
      </div>
    );
  };

  // Bookmark states - initialize with bookmarks from localStorage
  const [cardList, setCardList] = useState(() => initializeCardsWithBookmarks());

  // Update localStorage whenever bookmarks or emotions change
  useEffect(() => {
    const bookmarksMap = {};
    const emotionsMap = {};
    cardList.forEach((card) => {
      bookmarksMap[card.id] = card.bookmarked;
      emotionsMap[card.id] = card.emotion;
    });
    saveBookmarksToStorage(bookmarksMap);
    saveEmotionsToStorage(emotionsMap);
  }, [cardList]);

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
      case 2: // Uploaded
        base = cardList.filter((c) => c.category === "Uploaded");
        break;
      case 3: // Bookmarked
        base = cardList.filter((c) => c.bookmarked);
        break;
      case 4: // Course Books
        base = cardList.filter((c) => c.category === "Course Books");
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
              lastOpened={c.updatedAt}
              onToggleBookmark={() =>
                setCardList((prev) =>
                  prev.map((card) =>
                    card.id === c.id
                      ? { ...card, bookmarked: !card.bookmarked }
                      : card
                  )
                )
              }
              onEmotionChange={(newEmotion) =>
                setCardList((prev) =>
                  prev.map((card) =>
                    card.id === c.id
                      ? { ...card, emotion: newEmotion }
                      : card
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
            <Tab label="Uploaded" {...a11yProps(2)} />
            <Tab label="Bookmarked" {...a11yProps(3)} />
            <Tab label="Course Books" {...a11yProps(4)} />
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
            <img
              src="/icons/filterIcon.svg"
              className={styles.filterIcon}
              alt=""
            />
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
          <div className={styles.cardsGrid}>
            <UploadButton />
          </div>
          {renderSections()}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <div className={styles.contentWrap}>
          <div className={styles.cardsGrid}>
            <UploadButton />
          </div>
          {renderGridWithSection("Recent")}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <div className={styles.contentWrap}>
          <div className={styles.cardsGrid}>
            <UploadButton />
          </div>
          {renderGridWithSection("Uploaded")}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <div className={styles.contentWrap}>
          <div className={styles.cardsGrid}>
            <UploadButton />
          </div>
          {renderGridWithSection("Bookmarked")}
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <div className={styles.contentWrap}>
          <div className={styles.cardsGrid}>
            <UploadButton />
          </div>
          {renderGridWithSection("Course Book", styles.courseBookGrid)}
        </div>
      </CustomTabPanel>
    </Box>
  );
}
