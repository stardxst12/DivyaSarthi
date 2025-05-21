import React from "react";
import { FaAccessibleIcon, FaEye, FaVolumeUp, FaToggleOn, FaFont } from "react-icons/fa";
import "../styles/AccessibilityPage.scss";

const AccessibilityPage = () => {
  return (
    <div className="accessibility-page">
      <div className="accessibility-header">
        <h1><FaAccessibleIcon className="header-icon" /> Accessibility Features</h1>
        <p className="subtitle">Customize your experience with these inclusive tools</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon high-contrast">
            <FaEye />
          </div>
          <h2>High Contrast Mode</h2>
          <p>Enhances color contrast for improved visibility and readability.</p>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="feature-card">
          <div className="feature-icon text-to-speech">
            <FaVolumeUp />
          </div>
          <h2>Text to Speech</h2>
          <p>Converts written content into natural sounding audio.</p>
          <button className="feature-btn">Activate</button>
        </div>

        <div className="feature-card">
          <div className="feature-icon font-size">
            <FaFont />
          </div>
          <h2>Font Adjustments</h2>
          <p>Increase or decrease text size for comfortable reading.</p>
          <div className="font-controls">
            <button className="font-btn">A-</button>
            <div className="font-size-indicator">Medium</div>
            <button className="font-btn">A+</button>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon dark-mode">
            <FaToggleOn />
          </div>
          <h2>Dark Mode</h2>
          <p>Reduces eye strain with a darker color scheme.</p>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="accessibility-footer">
        <p>Need more assistance? <a href="/contact">Contact our support team</a></p>
      </div>
    </div>
  );
};

export default AccessibilityPage;