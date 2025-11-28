"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../dashboard.module.css";
import Link from "next/link";

export default function StudyGuide() {
  const [date, setDate] = useState(new Date());
  const [expandedGuides, setExpandedGuides] = useState({});

  // Study guides data
  const studyGuides = [
    {
      id: 1,
      title: "AELX 2GAP - Electrical Apprenticeship Lvl 1 Final",
      examDate: { day: 12, date: "Fri, Dec 12" },
      tasks: [
        { day: "Today", title: "Circuit Concepts", icon: "/icons/bookOutline.svg"},
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
  ];

  // Extract tasks from study guides and group by day
  const extractTasksFromStudyGuides = () => {
    const tasksByDay = {
      today: [],
      tomorrow: [],
      sunday: [],
      monday: [],
      saturday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
    };

    let taskIdCounter = 1;

    studyGuides.forEach((guide) => {
      guide.tasks.forEach((task, taskIndex) => {
        const dayKey = task.day?.toLowerCase() || "today";
        if (tasksByDay[dayKey]) {
          tasksByDay[dayKey].push({
            id: taskIdCounter++,
            text: task.title,
            completed: false,
            guideId: guide.id,
            taskIndex: taskIndex,
          });
        }
      });
    });

    return tasksByDay;
  };

  // Initialize tasks from study guides
  const [tasks, setTasks] = useState(() => extractTasksFromStudyGuides());

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
          {tasks.today && tasks.today.length > 0 && (
            <div className={styles.todoSection}>
              <h3 className={styles.todoSectionTitle}>Today's Tasks</h3>
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
          )}

          {tasks.tomorrow && tasks.tomorrow.length > 0 && (
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
          )}

          {tasks.saturday && tasks.saturday.length > 0 && (
            <div className={styles.todoSection}>
              <h3 className={styles.todoSectionTitle}>Saturday</h3>
              {tasks.saturday.map((task) => (
                <label key={task.id} className={styles.todoItem}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask("saturday", task.id)}
                    className={styles.todoCheckbox}
                  />
                  <span className={task.completed ? styles.todoCompleted : ""}>
                    {task.text}
                  </span>
                </label>
              ))}
            </div>
          )}

          {tasks.sunday && tasks.sunday.length > 0 && (
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
          )}

          {tasks.monday && tasks.monday.length > 0 && (
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
          )}
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
                // Group tasks by day
                const isNewDay = index === 0 || task.day !== guide.tasks[index - 1].day;
                return (
                  <React.Fragment key={`${guide.id}-task-${index}`}>
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
                    <Link 
                      href="/doc" 
                      className={styles.studyGuideTask}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className={styles.studyGuideTaskIcon}>
                        {task.icon.startsWith('/') || task.icon.startsWith('http') ? (
                          <img src={task.icon} alt="" width="24" height="24" />
                        ) : (
                          task.icon
                        )}
                      </span>
                      <span className={styles.studyGuideTaskTitle}>{task.title}</span>
                      <span className={styles.studyGuideOpenButton}>
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

