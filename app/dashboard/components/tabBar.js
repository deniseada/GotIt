"use client";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "../dashboard.module.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UploadButton from "./uploadButton";
import DocCard from "../components/DocCard";
import StudyGuide from "./StudyGuide";

// Helper Components
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

// Constants
const EMOTION_LABELS = {
  none: "No Filter",
  confident: "Confident",
  needs: "Needs Review",
  neutral: "Neutral",
};

const EMOTION_FILTERS = [
  { value: "confident", label: "Confident", icon: "/icons/happyFilter.svg", pillClass: "optionPill" },
  { value: "needs", label: "Needs Review", icon: "/icons/sadFilter.svg", pillClass: "optionPillNeeds" },
  { value: "neutral", label: "Neutral", icon: "/icons/neutralFilter.svg", pillClass: "optionPillNeutral" },
];

const TAB_STORAGE_KEY = "gotit-dashboard-active-tab";
const MAX_TAB_INDEX = 5;

const getStoredTabValue = () => {
  if (typeof window === "undefined") return 0;
  try {
    const storedValue = window.localStorage.getItem(TAB_STORAGE_KEY);
    const parsed = storedValue !== null ? Number(storedValue) : NaN;
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= MAX_TAB_INDEX) {
      return parsed;
    }
  } catch (error) {
    console.error("Error reading dashboard tab from localStorage:", error);
  }
  return 0;
};

export default function TabBar() {
  // Initialize tab value from localStorage on client, default to 0 for SSR
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return 0;
    return getStoredTabValue();
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [emotion, setEmotion] = useState("none");
  const [cardList, setCardList] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const filterRef = useRef(null);
  const hasLoadedTab = useRef(false); // Track if we've loaded the initial tab from localStorage

  // Initial card data
  const initialCards = [
    // Recent section cards
    { id: "recent-1", title: "Delmar's Standard Textbook for Electricity", kind: "Section 1", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "confident" },
    { id: "recent-2", title: "Delmar's Standard Textbook for Electricity", kind: "Section 3", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "needs" },
    // Uploaded section cards
    { id: "uploaded-1", title: "Apply Circuit Concepts", kind: "Uploaded", category: "Uploaded", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "neutral" },
    { id: "uploaded-2", title: "Circuit Concept Module", kind: "Uploaded", category: "Uploaded", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "neutral" },
    { id: "uploaded-3", title: "Installation and Maintenance", kind: "Uploaded", category: "Uploaded", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "neutral" },
    { id: "uploaded-4", title: "Perform Safety Related Functions", kind: "Uploaded", category: "Uploaded", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "neutral" },
    // Bookmarked section cards
    { id: "bookmarked-1", title: "Delmar's Standard Textbook for Electricity", kind: "Section 2", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "needs" },
    { id: "bookmarked-2", title: "Delmar's Standard Textbook for Electricity", kind: "Section 2", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "neutral" },
    { id: "bookmarked-3", title: "Delmar's Standard Textbook for Electricity", kind: "Section 2", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "confident" },
    { id: "bookmarked-4", title: "Delmar's Standard Textbook for Electricity", kind: "Section 2", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "confident" },
    { id: "bookmarked-5", title: "Delmar's Standard Textbook for Electricity", kind: "Section 2", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "needs" },
    { id: "bookmarked-6", title: "Delmar's Standard Textbook for Electricity", kind: "Section 2", category: "", bookmarked: false, updatedAt: "2025-10-25T15:00:00.000Z", emotion: "neutral" },
    // Course Books section cards
    { id: "course-1", title: "Electrical Codes and Regulations 2024", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-2", title: "Delmar's standard textbook for Electricity", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-3", title: "MindTap for Herman's Delmar's Standard Textbook of Electricity", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-4", title: "Cengage Learning Electricity 3: Power Generation and Delivery", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-5", title: "Cengage Learning Commercial Wiring", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-6", title: "Cengage Learning Industrial Motor Control", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-7", title: "American Technical Publishers Printreading", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-8", title: "Stallcups Journeyman Electrician's Study Guide", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-9", title: "NFPA NATIONAL FIRE ALARM AND SIGNALING CODE", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
    { id: "course-10", title: "New Jersey Electrician Reference Manual", kind: "", category: "Course Books", bookmarked: false, updatedAt: "2025-10-20T18:12:00.000Z", emotion: "neutral" },
  ];

  // LocalStorage helpers
  const loadBookmarksFromStorage = useCallback(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("got-it-bookmarks");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading bookmarks from localStorage:", error);
      return {};
    }
  }, []);

  const saveBookmarksToStorage = useCallback((bookmarks) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("got-it-bookmarks", JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Error saving bookmarks to localStorage:", error);
    }
  }, []);

  const loadEmotionsFromStorage = useCallback(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("got-it-emotions");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading emotions from localStorage:", error);
      return {};
    }
  }, []);

  const saveEmotionsToStorage = useCallback((emotions) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("got-it-emotions", JSON.stringify(emotions));
    } catch (error) {
      console.error("Error saving emotions to localStorage:", error);
    }
  }, []);

  // Card update handlers - extracted to reduce duplication
  const handleToggleBookmark = useCallback((cardId) => {
    setCardList((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, bookmarked: !card.bookmarked } : card
      )
    );
  }, []);

  const handleEmotionChange = useCallback((cardId, newEmotion) => {
    setCardList((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, emotion: newEmotion } : card
      )
    );
  }, []);

  const handleTitleEdit = useCallback((cardId, newTitle) => {
    setCardList((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, title: newTitle } : card
      )
    );
  }, []);

  const handleDelete = useCallback((cardId) => {
    setCardList((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  // Initialize cards from localStorage
  useEffect(() => {
    setIsClient(true);
    const storedBookmarks = loadBookmarksFromStorage();
    const storedEmotions = loadEmotionsFromStorage();
    
    setCardList(() => {
      const seenIds = new Set();
      const uniqueCards = initialCards.filter((card) => {
        if (seenIds.has(card.id)) return false;
        seenIds.add(card.id);
        return true;
      });
      
      return uniqueCards.map((card) => ({
        ...card,
        bookmarked: storedBookmarks[card.id] ?? card.bookmarked,
        emotion: storedEmotions[card.id] ?? card.emotion,
      }));
    });

  }, [loadBookmarksFromStorage, loadEmotionsFromStorage]);

  // Load tab from localStorage on mount (runs every time component mounts/remounts)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTab = getStoredTabValue();
    setValue(savedTab);
    hasLoadedTab.current = true; // Mark as loaded so we can start saving changes
  }, []); // Empty deps - only run on mount/remount

  // Save to localStorage when cards change
  useEffect(() => {
    if (!isClient) return;
    
    const bookmarksMap = {};
    const emotionsMap = {};
    cardList.forEach((card) => {
      bookmarksMap[card.id] = card.bookmarked;
      emotionsMap[card.id] = card.emotion;
    });
    saveBookmarksToStorage(bookmarksMap);
    saveEmotionsToStorage(emotionsMap);
  }, [cardList, isClient, saveBookmarksToStorage, saveEmotionsToStorage]);

  // Update local tab value if storage changes (other tabs)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event) => {
      if (event.key === TAB_STORAGE_KEY) {
        setValue(getStoredTabValue());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedTab.current) return;
    try {
      window.localStorage.setItem(TAB_STORAGE_KEY, String(value));
    } catch (error) {
      console.error("Error saving dashboard tab to localStorage:", error);
    }
  }, [value]);

  // Close filter menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Card filtering logic
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

  // Filter cards by emotion
  const filterByEmotion = useCallback((cards) => {
    if (emotion === "none") return cards;
    return cards.filter((c) => (c.emotion || "neutral") === emotion);
  }, [emotion]);

  // Render card with handlers
  const renderCard = useCallback((card) => (
    <DocCard
      key={card.id}
      {...card}
      lastOpened={card.updatedAt}
      onToggleBookmark={() => handleToggleBookmark(card.id)}
      onEmotionChange={(newEmotion) => handleEmotionChange(card.id, newEmotion)}
      onEditTitle={(newTitle) => handleTitleEdit(card.id, newTitle)}
      onDelete={() => handleDelete(card.id)}
    />
  ), [handleToggleBookmark, handleEmotionChange, handleTitleEdit, handleDelete]);

  // Render empty state
  const renderEmptyState = (message = "No items match this filter.") => (
    <p className={styles.emptyState}>{message}</p>
  );

  // Render grid
  const renderGrid = (cards, gridClass = styles.cardsGrid) => {
    if (cards.length === 0) return renderEmptyState();
    return (
      <div className={gridClass}>
        {cards.map(renderCard)}
      </div>
    );
  };

  // Render grid with section container
  const renderGridWithSection = (sectionTitle, gridClass = styles.cardsGrid) => {
    if (filteredCards.length === 0) {
      return (
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
          {renderEmptyState()}
        </div>
      );
    }

    return (
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
        {renderGrid(filteredCards, gridClass)}
      </div>
    );
  };

  // Render sections for "All" tab
  const renderSections = () => {
    const recentCards = filterByEmotion(
      [...cardList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    ).slice(0, 6);

    const uploadedCards = filterByEmotion(
      cardList.filter((c) => c.category === "Uploaded")
    );

    const bookmarkedCards = filterByEmotion(
      cardList.filter((c) => c.bookmarked)
    );

    const courseBookCards = filterByEmotion(
      cardList.filter((c) => c.category === "Course Books")
    );

    const renderCardSection = (cards, sectionTitle, gridClass = styles.cardsGrid) => (
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
        {cards.length > 0 && renderGrid(cards, gridClass)}
      </div>
    );

    return (
      <div className={styles.sectionsWrapper}>
        {renderCardSection(recentCards, "Recent")}
        {recentCards.length > 0 && uploadedCards.length > 0 && (
          <div className={styles.sectionDivider}></div>
        )}
        {renderCardSection(uploadedCards, "Uploaded")}
        <div className={styles.sectionDivider}></div>
        {renderCardSection(bookmarkedCards, "Bookmarked")}
        <div className={styles.sectionDivider}></div>
        {renderCardSection(courseBookCards, "Course Book", styles.courseBookGrid)}
      </div>
    );
  };

  // Filter handlers
  const handleFilterChange = (newEmotion) => {
    setEmotion(newEmotion);
    setFilterOpen(false);
  };

  const toggleFilter = (e) => {
    e.stopPropagation();
    setFilterOpen((s) => !s);
  };

  const handleTabChange = (_e, newValue) => setValue(newValue);

  // Render tab content wrapper
  const renderTabContent = (children) => (
    <div className={styles.contentWrap}>
      <UploadButton />
      <div className={styles.sectionDivider}></div>
      {children}
    </div>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <div className={styles.tabRow}>
        <div className={styles.tabsWrapper}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            className={styles.TabBar}
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Recent" {...a11yProps(1)} />
            <Tab label="Uploaded" {...a11yProps(2)} />
            <Tab label="Bookmarked" {...a11yProps(3)} />
            <Tab label="Course Books" {...a11yProps(4)} />
            <Tab label="Study Guide" {...a11yProps(5)} />
          </Tabs>
        </div>

        {/* Filter */}
        <div className={styles.filterContainer} ref={filterRef}>
          <button
            className={`${styles.filterPill} ${
              emotion !== "none" ? styles.filterPillSelected : ""
            }`}
            onClick={toggleFilter}
            aria-haspopup="true"
            aria-expanded={filterOpen}
            type="button"
          >
            <span className={styles.filterText}>
              {EMOTION_LABELS[emotion]}
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
                {EMOTION_FILTERS.map((filter, index) => (
                  <React.Fragment key={filter.value}>
                    {index > 0 && <div className={styles.separator} />}
                    <button
                      className={styles.filterOption}
                      role="menuitem"
                      onClick={() => handleFilterChange(filter.value)}
                    >
                      <span className={styles[filter.pillClass]}>{filter.label}</span>
                      <span className={styles.optionIcon} aria-hidden>
                        <img
                          src={filter.icon}
                          alt={filter.label}
                          className={styles.filterEmotionIcons}
                        />
                      </span>
                    </button>
                  </React.Fragment>
                ))}

                <div className={styles.separator} />
                <div className={styles.filterFooter}>
                  <button
                    className={styles.clearFilterBtn}
                    onClick={() => handleFilterChange("none")}
                  >
                    No Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      <CustomTabPanel value={value} index={0}>
        {renderTabContent(renderSections())}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {renderTabContent(renderGridWithSection("Recent"))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        {renderTabContent(renderGridWithSection("Uploaded"))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        {renderTabContent(renderGridWithSection("Bookmarked"))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        {renderTabContent(renderGridWithSection("Course Book", styles.courseBookGrid))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={5}>
        <StudyGuide />
      </CustomTabPanel>
    </Box>
  );
}
