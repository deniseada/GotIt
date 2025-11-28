"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../dashboard.module.css";
import Link from "next/link";

const STORAGE_KEY = "gotit-study-guide-task-completion";
const STUDY_GUIDES_STORAGE_KEY = "gotit-study-guides";

const DAY_LABELS = {
  today: "Today's Tasks",
  tomorrow: "Tomorrow",
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

const DAY_ORDER = [
  "today",
  "tomorrow",
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const normalizeDayKey = (day) => {
  if (!day) return "today";
  return day.trim().toLowerCase();
};

const getDayLabel = (dayKey) =>
  DAY_LABELS[dayKey] ||
  `${dayKey.charAt(0).toUpperCase()}${dayKey.slice(1)}`;

const getInitialCompletionState = () => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to parse stored study guide tasks", error);
    return {};
  }
};

const getStoredStudyGuides = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STUDY_GUIDES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading study guides from localStorage:", error);
    return [];
  }
};

const deleteStudyGuideFromStorage = (guideId) => {
  if (typeof window === "undefined") return;
  try {
    const stored = getStoredStudyGuides();
    const updated = stored.filter((guide) => guide.id !== guideId);
    window.localStorage.setItem(STUDY_GUIDES_STORAGE_KEY, JSON.stringify(updated));
    // Trigger custom event to notify component
    window.dispatchEvent(new CustomEvent("studyGuidesUpdated"));
  } catch (error) {
    console.error("Error deleting study guide from localStorage:", error);
  }
};

const DEFAULT_STUDY_GUIDES = [];

const buildTasksByDay = (guides, completionMap = {}) => {
  const base = DAY_ORDER.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  const tasksByDay = { ...base };

  guides.forEach((guide) => {
    guide.tasks.forEach((task, index) => {
      const dayKey = normalizeDayKey(task.day);
      if (!tasksByDay[dayKey]) {
        tasksByDay[dayKey] = [];
      }

      const taskKey = `${guide.id}-${index}`;
      tasksByDay[dayKey].push({
        id: taskKey,
        text: task.title,
        completed: !!completionMap[taskKey],
      });
    });
  });

  return tasksByDay;
};

export default function StudyGuide() {
  const [date, setDate] = useState(new Date());
  const [expandedGuides, setExpandedGuides] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const menuRefs = useRef({}); // Refs for menu containers
  
  // Load study guides from localStorage and combine with defaults
  const [studyGuides, setStudyGuides] = useState(() => {
    const stored = getStoredStudyGuides();
    return [...DEFAULT_STUDY_GUIDES, ...stored];
  });
  
  // Listen for updates when new study guides are added
  useEffect(() => {
    const handleStudyGuidesUpdate = () => {
      const stored = getStoredStudyGuides();
      setStudyGuides([...DEFAULT_STUDY_GUIDES, ...stored]);
    };
    
    window.addEventListener("studyGuidesUpdated", handleStudyGuidesUpdate);
    
    return () => {
      window.removeEventListener("studyGuidesUpdated", handleStudyGuidesUpdate);
    };
  }, []);

  const [taskCompletion, setTaskCompletion] = useState(getInitialCompletionState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(taskCompletion));
  }, [taskCompletion]);

  const tasksByDay = useMemo(
    () => buildTasksByDay(studyGuides, taskCompletion),
    [studyGuides, taskCompletion]
  );

  const dayKeysToRender = useMemo(() => {
    const additionalKeys = Object.keys(tasksByDay).filter(
      (key) => !DAY_ORDER.includes(key)
    );
    return [...DAY_ORDER, ...additionalKeys];
  }, [tasksByDay]);

  // Extract exam dates from study guides
  const examDates = useMemo(() => {
    const dates = studyGuides
      .filter((guide) => guide.endDate)
      .map((guide) => {
        // Parse endDate (format: yyyy-mm-dd)
        const dateParts = guide.endDate.split('-');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-indexed
          const day = parseInt(dateParts[2], 10);
          return { year, month, day };
        }
        return null;
      })
      .filter((date) => date !== null);
    
    return dates;
  }, [studyGuides]);

  // Debug: Log exam dates when they change
  useEffect(() => {
    if (examDates.length > 0) {
      console.log('Exam dates to highlight:', examDates);
    }
  }, [examDates]);

  // Check if a date matches any exam date
  const isExamDate = (date) => {
    if (examDates.length === 0) return false;
    return examDates.some(
      (examDate) =>
        date.getFullYear() === examDate.year &&
        date.getMonth() === examDate.month &&
        date.getDate() === examDate.day
    );
  };

  const toggleGuide = (guideId) => {
    setExpandedGuides((prev) => ({
      ...prev,
      [guideId]: !prev[guideId],
    }));
  };

  const toggleMenu = (e, guideId) => {
    e.stopPropagation(); // Prevent card toggle
    setOpenMenuId((prev) => (prev === guideId ? null : guideId));
  };

  const handleDeleteGuide = (e, guideId) => {
    e.stopPropagation(); // Prevent card toggle
    setOpenMenuId(null); // Close menu
    if (confirm("Are you sure you want to delete this study guide?")) {
      // Only delete user-created guides (positive IDs), not default ones (negative IDs)
      if (guideId > 0) {
        // Clean up task completion for this guide before deleting
        const guide = studyGuides.find((g) => g.id === guideId);
        if (guide) {
          setTaskCompletion((prev) => {
            const updated = { ...prev };
            guide.tasks.forEach((_, index) => {
              const taskKey = `${guideId}-${index}`;
              delete updated[taskKey];
            });
            return updated;
          });
        }
        // Delete from storage - this will trigger the event listener to update the UI
        deleteStudyGuideFromStorage(guideId);
      }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const toggleTask = (taskId) => {
    setTaskCompletion((prev) => {
      const next = { ...prev };
      if (next[taskId]) {
        delete next[taskId];
      } else {
        next[taskId] = true;
      }
      return next;
    });
  };

  // Get day name helper
  const getDayName = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  // Format date helper
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.studyGuideContainer}>
      {/* Top Section: Todo List and Calendar */}
      <div className={styles.studyGuideTop}>
        {/* Todo List */}
        <div className={styles.todoListContainer}>
          {dayKeysToRender.map((dayKey) => {
            const sectionTasks = tasksByDay[dayKey];
            if (!sectionTasks || sectionTasks.length === 0) {
              return null;
            }

            return (
              <div key={dayKey} className={styles.todoSection}>
                <h3 className={styles.todoSectionTitle}>{getDayLabel(dayKey)}</h3>
                {sectionTasks.map((task) => (
                  <label key={task.id} className={styles.todoItem}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className={styles.todoCheckbox}
                    />
                    <span className={task.completed ? styles.todoCompleted : ""}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <div className={styles.calendarContainer}>
          <Calendar
            onChange={setDate}
            value={date}
            className={styles.calendar}
            tileClassName={({ date, view }) => {
              // Style exam dates from study guides
              if (view === 'month' && isExamDate(date)) {
                return 'examDateTile';
              }
              return null;
            }}
          />
        </div>
      </div>

      {/* Bottom Section: Study Guides */}
      <div className={styles.studyGuidesSection}>
        <h2 className={styles.studyGuidesTitle}>Study Guides</h2>
        {studyGuides.map((guide) => (
          <div 
            key={guide.id} 
            className={styles.studyGuideCard}
            onClick={() => toggleGuide(guide.id)}
          >
            <div className={styles.studyGuideHeader}>
              <div className={styles.studyGuideMenuContainer} ref={(el) => (menuRefs.current[guide.id] = el)}>
                <button
                  className={styles.studyGuideDeleteButton}
                  onClick={(e) => toggleMenu(e, guide.id)}
                  aria-label="Open menu"
                  type="button"
                >
                  <img src="/icons/kebab.svg" alt="Menu" width="7" height="28" />
                </button>
                {openMenuId === guide.id && (
                  <div className={styles.studyGuideMenu}>
                    {guide.id > 0 && (
                      <button
                        className={styles.studyGuideMenuItem}
                        onClick={(e) => handleDeleteGuide(e, guide.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
              <h3 className={styles.studyGuideCardTitle}>{guide.title}</h3>
              {guide.examDate && (
                <div className={styles.examDateBadge}>
                  <span className={styles.examDateNumber}>{guide.examDate.day}</span>
                  <span className={styles.examDateText}>{guide.examDate.date}</span>
                </div>
              )}
            </div>

            <div 
              className={`${styles.studyGuideContent} ${
                expandedGuides[guide.id] ? styles.studyGuideContentOpen : styles.studyGuideContentClosed
              }`}
            >
              <div className={styles.studyGuideContentInner}>
                {guide.tasks.map((task, index) => {
                  const isNewDay =
                    index === 0 || task.day !== guide.tasks[index - 1].day;
                  const taskKey = `${guide.id}-${index}`;
                  const isTaskCompleted = !!taskCompletion[taskKey];

                  return (
                    <React.Fragment key={`${guide.id}-task-${index}`}>
                      {isNewDay && task.day && (
                        <div className={styles.studyGuideDayHeader}>
                          <span className={styles.studyGuideDayTitle}>
                            {task.day}
                          </span>
                        </div>
                      )}
                      {!task.day && index > 0 && guide.tasks[index - 1].day && (
                        <div className={styles.studyGuideDayHeader}>
                          <span className={styles.studyGuideDayTitle}></span>
                        </div>
                      )}
                      <Link
                        href="/doc"
                        className={`${styles.studyGuideTask} ${
                          isTaskCompleted ? styles.studyGuideTaskCompleted : ""
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className={styles.studyGuideTaskIcon}>
                          {task.icon.startsWith("/") || task.icon.startsWith("http") ? (
                            <img src={task.icon} alt="" width="24" height="24" />
                          ) : (
                            task.icon
                          )}
                        </span>
                        <span
                          className={`${styles.studyGuideTaskTitle} ${
                            isTaskCompleted ? styles.studyGuideTaskTitleCompleted : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`${styles.studyGuideOpenButton} ${
                            isTaskCompleted ? styles.studyGuideOpenButtonCompleted : ""
                          }`}
                        >
                          Open
                        </span>
                      </Link>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

