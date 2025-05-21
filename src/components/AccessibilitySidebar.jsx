import React, { useEffect } from "react";

const AccessibilitySidebar = ({
  fontSize,
  setFontSize,
  isDyslexicFont,
  setIsDyslexicFont,
  closeSidebar
}) => {
  // Toggle dyslexic font
  useEffect(() => {
    if (isDyslexicFont) {
      document.body.classList.add("dyslexic-font");
    } else {
      document.body.classList.remove("dyslexic-font");
    }
  }, [isDyslexicFont]);

  const handleContrast = (mode) => {
    document.body.classList.remove("grayscale", "high-contrast", "negative-contrast");
    if (mode) document.body.classList.add(mode);
  };

  const resetAll = () => {
    setFontSize(16);
    setIsDyslexicFont(false);
    handleContrast(null);
    stopSpeaking();
  };

  const speakPage = () => {
    const content = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    speechSynthesis.cancel(); // stop any ongoing speech
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="accessibility-sidebar">
      <h2>Accessibility Settings</h2>

      {/* Font Size */}
      <div className="section">
        <label>Font Size: {fontSize}px</label>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </div>

      {/* Dyslexic Font */}
      <div className="section toggle-option">
      <label className="dyslexic-label">Dyslexic Font</label>

        <label className="switch">
          <input
            type="checkbox"
            checked={isDyslexicFont}
            onChange={(e) => setIsDyslexicFont(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Contrast Modes */}
      <div className="section">
        <label>Contrast Mode</label>
        <div className="contrast-buttons">
          <button onClick={() => handleContrast("grayscale")}>Grayscale</button>
          <button onClick={() => handleContrast("high-contrast")}>High Contrast</button>
          <button onClick={() => handleContrast("negative-contrast")}>Negative</button>
          <button onClick={() => handleContrast(null)}>None</button>
        </div>
      </div>

      {/* Text-to-Speech */}
      <button className="reset-button tts-button" onClick={speakPage}>
        Read Page
      </button>
      <button className="reset-button stop-button" onClick={stopSpeaking}>
        Stop Reading
      </button>

      {/* Reset */}
      <button className="reset-button" onClick={resetAll}>
        Reset All
      </button>

      {/* Close Sidebar */}
      <button className="reset-button" onClick={closeSidebar} style={{ marginTop: "10px" }}>
        Close
      </button>
    </div>
  );
};

export default AccessibilitySidebar;
