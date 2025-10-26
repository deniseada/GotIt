"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../dashboard.module.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UploadButton from "./uploadButton";

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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabBar() {
  const [value, setValue] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

        <div className={styles.filterContainer} ref={filterRef}>
          <button
            className={styles.filterPill}
            onClick={toggleFilter}
            aria-haspopup="true"
            aria-expanded={filterOpen}
            type="button"
          >
            <span className={styles.filterText}>No Filter</span>
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
                <div className={styles.filterOption} role="menuitem">
                  <span className={styles.optionPill}>Confident</span>
                  <span className={styles.optionIcon} aria-hidden>
                    <img
                      src="/icons/happyFilter.svg"
                      alt="Confident"
                      className={styles.filterEmotionIcons}
                    />
                  </span>
                </div>

                <div className={styles.separator} />

                <div className={styles.filterOption} role="menuitem">
                  <span className={styles.optionPillNeeds}>Needs Review</span>
                  <span className={styles.optionIcon} aria-hidden>
                    <img
                      src="/icons/sadFilter.svg"
                      alt="sad"
                      className={styles.filterEmotionIcons}
                    />
                  </span>
                </div>

                <div className={styles.separator} />

                <div className={styles.filterOption} role="menuitem">
                  <span className={styles.optionPillNeutral}>Neutral</span>
                  <span className={styles.optionIcon} aria-hidden>
                    <img
                      src="/icons/neutralFilter.svg"
                      alt="neutral"
                      className={styles.filterEmotionIcons}
                    />
                  </span>
                </div>

                <div className={styles.separator} />

                <div className={styles.filterFooter}>
                  <button className={styles.clearFilterBtn}>No Filter</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD CONTENT HERE: folders and sections */}
      <CustomTabPanel value={value} index={0}>
        <div className={styles.contentWrap}>
          <UploadButton />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className={styles.contentWrap}>
          <UploadButton />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className={styles.contentWrap}>
          <UploadButton />
        </div>
      </CustomTabPanel>
    </Box>
  );
}
