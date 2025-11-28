"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../dashboard.module.css";
import Link from "next/link";

export default function StudyGuide() {
  const [date, setDate] = useState(new Date());
  const [expandedGuides, setExpandedGuides] = useState({});

  // To-do list state
  const [tasks, setTasks] = useState({
    today: [
      { id: 1, text: "To read Delmar's section 1", completed: false },
      { id: 2, text: "To read Basic Motor Control", completed: false },
    ],
    tomorrow: [
      { id: 3, text: "To read Delmar's section 2", completed: false },
    ],
    sunday: [
      { id: 4, text: "Circuit Control", completed: false },
    ],
    monday: [
      { id: 5, text: "Three Wire Circuit", completed: false },
    ],
  });

  // Study guides data
  const studyGuides = [
    {
      id: 1,
      title: "AELX 2GAP - Electrical Apprenticeship Lvl 1 Final",
      examDate: { day: 17, date: "Fri, Dec 12" },
      tasks: [
        { day: "Today", title: "Circuit Concepts", icon: "📚", hasFire: true },
        { day: "Saturday", title: "Safety-Related Functions", icon: "📚" },
        { day: "Saturday", title: "Installations and Maintenance", icon: "📚" },
        { day: "*Next* Monday", title: "Low Voltage Distribution Systems", icon: "📚" },
      ],
    },
    {
      id: 1,
      title: "AELX 1GAP - Electrical Apprentice Lvl 1 Final",
      examDate: { day: 17, date: "Wed, Dec 10" },
      tasks: [
        { day: "Today", title: "Physics 1 Review", icon: "📚", hasFire: true },
        { day: "Saturday", title: "Delmar's Section 1", icon: "📚" },
        { day: "Saturday", title: "Delmar's Section 2", icon: "📚" },
      ],
    },
  ];

  const toggleGuide = (guideId) => {
    setExpandedGuides((prev) => ({
      ...prev,
      [guideId]: !prev[guideId],
    }));
  };

  const toggleTask = (section, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [section]: prev[section].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
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
          <div className={styles.todoSection}>
            <h3 className={styles.todoSectionTitle}>Today's Task</h3>
            {tasks.today.map((task) => (
              <label key={task.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask("today", task.id)}
                  className={styles.todoCheckbox}
                />
                <span className={task.completed ? styles.todoCompleted : ""}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>

          <div className={styles.todoSection}>
            <h3 className={styles.todoSectionTitle}>Tomorrow</h3>
            {tasks.tomorrow.map((task) => (
              <label key={task.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask("tomorrow", task.id)}
                  className={styles.todoCheckbox}
                />
                <span className={task.completed ? styles.todoCompleted : ""}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>

          <div className={styles.todoSection}>
            <h3 className={styles.todoSectionTitle}>Sunday</h3>
            {tasks.sunday.map((task) => (
              <label key={task.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask("sunday", task.id)}
                  className={styles.todoCheckbox}
                />
                <span className={task.completed ? styles.todoCompleted : ""}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>

          <div className={styles.todoSection}>
            <h3 className={styles.todoSectionTitle}>Monday</h3>
            {tasks.monday.map((task) => (
              <label key={task.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask("monday", task.id)}
                  className={styles.todoCheckbox}
                />
                <span className={task.completed ? styles.todoCompleted : ""}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>
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

            {expandedGuides[guide.id] && (
              <div className={styles.studyGuideContent}>
                {guide.tasks.map((task, index) => {
                  // Group tasks by day
                  const isNewDay = index === 0 || task.day !== guide.tasks[index - 1].day;
                  return (
                    <React.Fragment key={index}>
                      {isNewDay && task.day && (
                        <div className={styles.studyGuideDayHeader}>
                          <span className={styles.studyGuideDayTitle}>{task.day}</span>
                        </div>
                      )}
                      {!task.day && index > 0 && guide.tasks[index - 1].day && (
                        <div className={styles.studyGuideDayHeader}>
                          <span className={styles.studyGuideDayTitle}></span>
                        </div>
                      )}
                      <div className={styles.studyGuideTask}>
                        <span className={styles.studyGuideTaskIcon}>{task.icon}</span>
                        <span className={styles.studyGuideTaskTitle}>{task.title}</span>
                        <Link 
                          href="/doc" 
                          className={styles.studyGuideOpenButton}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open
                        </Link>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

