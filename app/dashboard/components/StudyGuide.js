"use client";
import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../dashboard.module.css";
import Link from "next/link";

const STORAGE_KEY = "gotit-study-guide-task-completion";

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
  const studyGuides = useMemo(
    () => [
      {
        id: 1,
        title: "AELX 2GAP - Electrical Apprenticeship Lvl 1 Final",
        examDate: { day: 12, date: "Fri, Dec 12" },
        tasks: [
          { day: "Today", title: "Circuit Concepts", icon: "/icons/bookOutline.svg" },
          { day: "Saturday", title: "Safety-Related Functions", icon: "/icons/bookOutline.svg" },
          { day: "Sunday", title: "Installations and Maintenance", icon: "/icons/bookOutline.svg" },
          { day: "Sunday", title: "Low Voltage Distribution Systems", icon: "/icons/bookOutline.svg" },
        ],
      },
      {
        id: 2,
        title: "AELX 1GAP - Electrical Apprentice Lvl 1 Final",
        examDate: { day: 10, date: "Wed, Dec 10" },
        tasks: [
          { day: "Today", title: "Physics 1 Review", icon: "/icons/bookOutline.svg", hasFire: true },
          { day: "Saturday", title: "Delmar's Section 1", icon: "/icons/bookOutline.svg" },
          { day: "Sunday", title: "Delmar's Section 2", icon: "/icons/bookOutline.svg" },
        ],
      },
    ],
    []
  );

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

  const toggleGuide = (guideId) => {
    setExpandedGuides((prev) => ({
      ...prev,
      [guideId]: !prev[guideId],
    }));
  };

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
              // Style December 12th specifically
              if (view === 'month' && date.getMonth() === 11 && date.getDate() === 12) {
                return styles.examDateTile;
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

