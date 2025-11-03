"use client";

import React, { useState } from "react";
import styles from "../settings.module.css";

export default function SettingsOverlay({ open, onClose }) {
  const [activeSection, setActiveSection] = useState("Profile");
  const [editingField, setEditingField] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: "Apprentice Name",
    username: "apprenticeuser",
    email: "apprentice101@gmail.com",
    birthday: "January 11, 2001",
  });

  // Personalization state
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic"
  ];

  if (!open) return null;

  const navigationItems = [
    "Profile",
    "Personalization",
    "Account Settings",
    "About Us",
  ];

  const handleFieldEdit = (field) => {
    setEditingField(field);
  };

  const handleFieldSave = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.settingsContainer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        {/* Close button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close settings"
        >
          ×
        </button>

        <div className={styles.settingsContent}>
          {/* Left Sidebar */}
          <aside className={styles.sidebar}>
            <nav className={styles.navMenu}>
              {navigationItems.map((item) => (
                <button
                  key={item}
                  className={`${styles.navItem} ${
                    activeSection === item ? styles.navItemActive : ""
                  }`}
                  onClick={() => setActiveSection(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className={styles.contentArea}>
            {activeSection === "Profile" && (
              <div className={styles.profileSection}>
                {/* Avatar and Greeting */}
                <div className={styles.profileHeader}>
                  <div className={styles.avatarContainer}>
                    <div className={styles.avatar}>
                      <div className={styles.avatarPlaceholder}>
                        <span className={styles.avatarInitial}>AN</span>
                      </div>
                    </div>
                    <button className={styles.avatarEditButton} aria-label="Change profile picture">
                      +
                    </button>
                  </div>
                  <div className={styles.greeting}>
                    <h2 className={styles.greetingText}>Hello</h2>
                    <p className={styles.userName}>{formData.name}</p>
                  </div>
                </div>

                {/* User Information Fields */}
                <div className={styles.infoFields}>
                  <InfoField
                    label="Name:"
                    value={formData.name}
                    field="name"
                    editing={editingField === "name"}
                    onEdit={() => handleFieldEdit("name")}
                    onChange={(value) => handleFieldChange("name", value)}
                    onSave={(value) => handleFieldSave("name", value)}
                    onCancel={() => setEditingField(null)}
                  />
                  <InfoField
                    label="Username:"
                    value={formData.username}
                    field="username"
                    editing={editingField === "username"}
                    onEdit={() => handleFieldEdit("username")}
                    onChange={(value) => handleFieldChange("username", value)}
                    onSave={(value) => handleFieldSave("username", value)}
                    onCancel={() => setEditingField(null)}
                  />
                  <InfoField
                    label="E-mail:"
                    value={formData.email}
                    field="email"
                    editing={editingField === "email"}
                    onEdit={() => handleFieldEdit("email")}
                    onChange={(value) => handleFieldChange("email", value)}
                    onSave={(value) => handleFieldSave("email", value)}
                    onCancel={() => setEditingField(null)}
                  />
                  <InfoField
                    label="Birthday:"
                    value={formData.birthday}
                    field="birthday"
                    editing={editingField === "birthday"}
                    onEdit={() => handleFieldEdit("birthday")}
                    onChange={(value) => handleFieldChange("birthday", value)}
                    onSave={(value) => handleFieldSave("birthday", value)}
                    onCancel={() => setEditingField(null)}
                  />
                </div>
              </div>
            )}

            {activeSection === "Personalization" && (
              <div className={styles.personalizationSection}>
                <h2 className={styles.sectionTitle}>Personalization</h2>
                <div className={styles.settingsList}>
                  {/* Dark Mode Toggle */}
                  <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Dark Mode</span>
                    <ToggleSwitch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  </div>

                  {/* Push Notification Toggle */}
                  <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Push Notification</span>
                    <ToggleSwitch
                      checked={pushNotification}
                      onChange={() => setPushNotification(!pushNotification)}
                    />
                  </div>

                  {/* Language Dropdown */}
                  <div className={styles.settingItem}>
                    <span className={styles.settingLabel}>Language</span>
                    <div className={styles.languageDropdownContainer}>
                      <button
                        className={styles.languageDropdown}
                        onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                        aria-label="Select language"
                      >
                        <span>{selectedLanguage}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${styles.dropdownArrow} ${
                            languageDropdownOpen ? styles.dropdownArrowOpen : ""
                          }`}
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {languageDropdownOpen && (
                        <>
                          <div
                            className={styles.dropdownBackdrop}
                            onClick={() => setLanguageDropdownOpen(false)}
                          />
                          <div className={styles.languageDropdownMenu}>
                            {languages.map((lang) => (
                              <button
                                key={lang}
                                className={`${styles.languageOption} ${
                                  selectedLanguage === lang ? styles.languageOptionActive : ""
                                }`}
                                onClick={() => {
                                  setSelectedLanguage(lang);
                                  setLanguageDropdownOpen(false);
                                }}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Account Settings" && (
              <div className={styles.personalizationSection}>
                <h2 className={styles.sectionTitle}>Account Settings</h2>
                <div className={styles.settingsList}>
                  {/* Change E-mail */}
                  <button className={styles.accountSettingItem}>
                    <span className={styles.settingLabel}>Change E-mail</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.settingArrow}
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#522a70"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Change Password */}
                  <button className={styles.accountSettingItem}>
                    <span className={styles.settingLabel}>Change Password</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.settingArrow}
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#522a70"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Two-Factor Authenticator */}
                  <button className={styles.accountSettingItem}>
                    <span className={styles.settingLabel}>Two-Factor Authenticator</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.settingArrow}
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#522a70"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Delete Account Button */}
                <div className={styles.deleteAccountContainer}>
                  <button className={styles.deleteAccountButton}>
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeSection === "About Us" && (
              <div className={styles.aboutUsSection}>
                <h2 className={styles.sectionTitle}>About Us</h2>
                <div className={styles.aboutUsContent}>
                  <p className={styles.aboutUsParagraph}>
                    Got It is a dedicated website designed to simplify complex documents and create effective study guides specifically for Level 1 BCIT Electrical Apprentices. Understanding the unique challenges faced by apprentices in mastering technical materials, Got It provides a user-friendly platform rich with features tailored to support their learning journey.
                  </p>
                  <p className={styles.aboutUsParagraph}>
                    Our platform addresses key challenges such as study planning difficulties, learning disabilities including ADHD and dyslexia, and the complexity of math and code books filled with jargon and small print. Through extensive user research, we identified critical pain points like lack of real-world examples, limited practice exams, and insufficient instructor support for accommodations.
                  </p>
                  <p className={styles.aboutUsParagraph}>
                    To tackle these issues, Got It offers powerful features including text simplification, adjustable font sizing and spacing, highlighting, quizzes, mind maps, work status tracking, printable notes, exam date setting, and a focus timer. Our platform prioritizes accessibility by enabling dyslexia-friendly fonts, contrast adjustments, and screen reader compatibility. Visual aids like detailed diagrams and diverse learning modes (text, audio, mind maps) help bridge the gap between theory and real-world application.
                  </p>
                  <p className={styles.aboutUsParagraph}>
                    At Got It, our mission is to empower Level 1 electrical apprentices to overcome learning barriers, build confidence, and succeed in their apprenticeship through a supportive, accessible, and motivating study environment.
                  </p>
                </div>
                <a
                  href="https://dwong429.wixsite.com/gotit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.learnMoreButton}
                >
                  <span>Learn more about our Blogs...</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.learnMoreArrow}
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            )}

            {activeSection !== "Profile" && activeSection !== "Personalization" && activeSection !== "Account Settings" && activeSection !== "About Us" && (
              <div className={styles.sectionPlaceholder}>
                <h2>{activeSection}</h2>
                <p>This section is coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Toggle Switch Component (visual only, no functionality)
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      className={`${styles.toggleSwitch} ${checked ? styles.toggleSwitchOn : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Enabled" : "Disabled"}
      type="button"
    >
      <span className={styles.toggleSwitchThumb} />
    </button>
  );
}

// Reusable InfoField component
function InfoField({
  label,
  value,
  field,
  editing,
  onEdit,
  onChange,
  onSave,
  onCancel,
}) {
  const [tempValue, setTempValue] = useState(value);

  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
  };

  const handleCancel = () => {
    setTempValue(value);
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={styles.infoField}>
      <div className={styles.infoFieldContent}>
        <span className={styles.infoLabel}>{label}</span>
        {editing ? (
          <input
            type="text"
            className={styles.infoInput}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span className={styles.infoValue}>{value}</span>
        )}
      </div>
      <button
        className={styles.editButton}
        onClick={editing ? handleSave : onEdit}
        aria-label={`Edit ${label.toLowerCase()}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.333 2.00001C11.5084 1.82464 11.7163 1.68602 11.9444 1.59232C12.1726 1.49863 12.4164 1.45178 12.6622 1.45441C12.908 1.45704 13.1505 1.50909 13.376 1.60747C13.6015 1.70585 13.8054 1.84852 13.9763 2.02752C14.1471 2.20651 14.2815 2.41815 14.3718 2.64987C14.4621 2.8816 14.5063 3.12881 14.5017 3.37741C14.4971 3.62601 14.4437 3.87106 14.3448 4.09863C14.2459 4.3262 14.1036 4.53181 13.9259 4.70334L6.44392 12.1853L2.33325 13.3333L3.48125 9.22268L11.333 2.00001Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

