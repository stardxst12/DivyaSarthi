import { useState, useEffect } from "react";

const ParkinsonsDetection = () => {
  const [severity, setSeverity] = useState("");
  const [tremorCount, setTremorCount] = useState(0);
  const [misclickCount, setMisclickCount] = useState(0);
  const [typoCount, setTypoCount] = useState(0);
  let lastMouseX = 0, lastMouseY = 0, tremorThreshold = 5; // Threshold for detecting tremors

  // Detects tremors based on small mouse movements
  const trackTremors = (event) => {
    let dx = Math.abs(event.clientX - lastMouseX);
    let dy = Math.abs(event.clientY - lastMouseY);
    if (dx < tremorThreshold && dy < tremorThreshold) {
      setTremorCount(prev => prev + 1);
    }
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  };

  // Tracks misclicks (clicks outside specific interactive elements)
  const trackMisclicks = (event) => {
    if (!event.target.closest("button, input, textarea")) {
      setMisclickCount(prev => prev + 1);
    }
  };

  // Tracks typos (fast backspaces)
  const trackTypos = (event) => {
    if (event.key === "Backspace") {
      setTypoCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", trackTremors);
    document.addEventListener("click", trackMisclicks);
    document.addEventListener("keydown", trackTypos);

    return () => {
      document.removeEventListener("mousemove", trackTremors);
      document.removeEventListener("click", trackMisclicks);
      document.removeEventListener("keydown", trackTypos);
    };
  }, []);

  // Sends movement data to Flask backend
  const handleDetect = async () => {
    const data = { tremorCount, misclickCount, typoCount };

    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setSeverity(result.severity);
  };

  return (
    <div style={{ padding: "100px 20px", minHeight: "100vh" }}>
      <h1>Detect Parkinson's</h1>
      <p>Tracking user movements...</p>
      <button onClick={handleDetect}>Analyze Movements</button>
      {severity && <h2>Predicted Severity: {severity}</h2>}
    </div>
  );
};

export default ParkinsonsDetection;



/*import React, { useState, useEffect } from "react";
import "../styles/ParkinsonsDetection.scss";

const ParkinsonsDetection = () => {
  const [tremorCount, setTremorCount] = useState(0);
  const [misclickCount, setMisclickCount] = useState(0);
  const [typoCount, setTypoCount] = useState(0);
  const [parkinsonsLevel, setParkinsonsLevel] = useState("Detecting...");
  const [detectionEnabled, setDetectionEnabled] = useState(true);

  let lastX = 0, lastY = 0, lastClickTime = 0, lastKeyTime = 0;

  useEffect(() => {
    if (!detectionEnabled) return;

    const trackMouseMovement = (event) => {
      let dx = Math.abs(event.clientX - lastX);
      let dy = Math.abs(event.clientY - lastY);
      
      if (dx > 5 && dx < 15 && dy > 5 && dy < 15) {
        setTremorCount(prev => prev + 1);
      }
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const trackClicks = () => {
      let currentTime = new Date().getTime();
      if (currentTime - lastClickTime < 250) {
        setMisclickCount(prev => prev + 1);
      }
      lastClickTime = currentTime;
    };

    const trackTyping = (event) => {
      let currentTime = new Date().getTime();
      if (event.key === "Backspace") {
        setTypoCount(prev => prev + 1);
      }
      lastKeyTime = currentTime;
    };

    document.addEventListener("mousemove", trackMouseMovement);
    document.addEventListener("click", trackClicks);
    document.addEventListener("keydown", trackTyping);

    return () => {
      document.removeEventListener("mousemove", trackMouseMovement);
      document.removeEventListener("click", trackClicks);
      document.removeEventListener("keydown", trackTyping);
    };
  }, [detectionEnabled]);

  useEffect(() => {
    if (!detectionEnabled) return;
    
    const determineParkinsonsLevel = () => {
      let level = "Normal";
      if (tremorCount > 50 || misclickCount > 20 || typoCount > 15) {
        level = "Severe";
        document.body.classList.add("parkinsons-severe");
        document.body.classList.remove("parkinsons-moderate", "parkinsons-mild", "parkinsons-normal");
      } else if (tremorCount > 25 || misclickCount > 10 || typoCount > 7) {
        level = "Moderate";
        document.body.classList.add("parkinsons-moderate");
        document.body.classList.remove("parkinsons-severe", "parkinsons-mild", "parkinsons-normal");
      } else {
        level = "Mild";
        document.body.classList.add("parkinsons-mild");
        document.body.classList.remove("parkinsons-severe", "parkinsons-moderate", "parkinsons-normal");
      }
      setParkinsonsLevel(level);
    };
    
    const interval = setInterval(determineParkinsonsLevel, 5000);
    return () => clearInterval(interval);
  }, [tremorCount, misclickCount, typoCount, detectionEnabled]);

  return (
    <div className="parkinsons-badge">
      <button onClick={() => setDetectionEnabled(!detectionEnabled)}>
        {detectionEnabled ? "Disable Detection" : "Enable Detection"}
      </button>
      <p>Parkinson’s Level: {parkinsonsLevel}</p>
    </div>
  );
};

export default ParkinsonsDetection;*/