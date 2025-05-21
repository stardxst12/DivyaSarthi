import React, { useState, useEffect } from "react";
import "../styles/DyslexiaMode.scss";

const DyslexiaMode = () => {
  const [dyslexiaEnabled, setDyslexiaEnabled] = useState(
    localStorage.getItem("dyslexiaMode") === "true"
  );

  useEffect(() => {
    if (dyslexiaEnabled) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }

    // Save preference in localStorage
    localStorage.setItem("dyslexiaMode", dyslexiaEnabled);
  }, [dyslexiaEnabled]);

  return (
    <div className="dyslexia-mode-toggle">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={dyslexiaEnabled}
          onChange={() => setDyslexiaEnabled(!dyslexiaEnabled)}
        />
        <span className="slider"></span>
      </label>
      <span>{dyslexiaEnabled ? "Dyslexia Mode On" : "Dyslexia Mode Off"}</span>
    </div>
  );
};

export default DyslexiaMode;



/*import React, { useState, useEffect } from "react";
import "./DyslexiaMode.scss";

const DyslexiaMode = () => {
  const [dyslexiaEnabled, setDyslexiaEnabled] = useState(false);

  useEffect(() => {
    if (dyslexiaEnabled) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }
  }, [dyslexiaEnabled]);

  return (
    <div className="dyslexia-mode-toggle">
      <button onClick={() => setDyslexiaEnabled(!dyslexiaEnabled)}>
        {dyslexiaEnabled ? "Disable Dyslexia Mode" : "Enable Dyslexia Mode"}
      </button>
    </div>
  );
};



export default DyslexiaMode;*/
