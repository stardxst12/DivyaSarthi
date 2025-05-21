import React, { useState, useEffect, useRef } from "react";
import "./ParkinsonsDetection.css";

const ParkinsonsDetection = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [severity, setSeverity] = useState(null);
    const isEnabledRef = useRef(false); // Reference to track isEnabled inside intervals

    useEffect(() => {
        // Fetch initial detection status
        fetch("http://127.0.0.1:5001/detection_status")
            .then((res) => res.json())
            .then((data) => {
                setIsEnabled(data.status);
                isEnabledRef.current = data.status;
            })
            .catch((err) => console.error("Error fetching status:", err));
    }, []);

    const toggleDetection = async () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        isEnabledRef.current = newState;

        // Send status update to backend
        await fetch("http://127.0.0.1:5001/detection_status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: newState }),
        });

        if (newState) trackUserMovements();
    };

    const trackUserMovements = () => {
        let tremorCount = 0, misclickCount = 0, typoCount = 0;
        let tremorFrequency = 0, lastTime = Date.now();

        // Mouse Movement Tracking
        const handleMouseMove = (event) => {
            let currentTime = Date.now();
            let timeDiff = currentTime - lastTime;

            if (timeDiff < 50) tremorCount++; // Rapid movements
            tremorFrequency = tremorCount / (timeDiff / 1000);
            lastTime = currentTime;
        };

        // Click Tracking
        const handleClick = () => { misclickCount++; };

        // Typing Errors (Backspace)
        const handleKeyDown = (event) => {
            if (event.key === "Backspace") typoCount++;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("click", handleClick);
        document.addEventListener("keydown", handleKeyDown);

        // Send Data to Backend Every 5 Seconds
        const interval = setInterval(async () => {
            if (!isEnabledRef.current) return; // Use ref to check state inside interval

            const movementData = { tremorCount, misclickCount, typoCount, tremorFrequency };
            console.log("Sending movement data:", movementData);

            try {
                const response = await fetch("http://127.0.0.1:5001/predict", {
                    method: "POST",  
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tremorCount, misclickCount, typoCount, tremorFrequency }),
                });

                const data = await response.json();
                if (data.severity !== undefined) {
                    setSeverity(data.severity);
                    adjustFontAndButtonSize(data.severity);
                }
            } catch (error) {
                console.error("Error fetching prediction:", error);
            }

            // Reset Counts
            tremorCount = 0;
            misclickCount = 0;
            typoCount = 0;
        }, 5000);

        return () => clearInterval(interval);
    };

    const adjustFontAndButtonSize = (severity) => {
        console.log("Adjusting font and button size for:", severity);
        const root = document.documentElement;

        // Set CSS Variables Based on Severity
        if (severity === "Non-Parkinson's") {
            root.style.setProperty("--font-size", "16px");
            root.style.setProperty("--button-padding", "12px 24px");
        }
        else if (severity === "Mild Parkinson's") {
            root.style.setProperty("--font-size", "18px");
            root.style.setProperty("--button-padding", "14px 28px");
        }
        else if (severity === "Moderate Parkinson's") {
            root.style.setProperty("--font-size", "20px");
            root.style.setProperty("--button-padding", "16px 32px");
        }
        else if (severity === "Severe Parkinson's") {
            root.style.setProperty("--font-size", "22px");
            root.style.setProperty("--button-padding", "18px 36px");
        }
    };

    return (
        <div className="parkinsons-container">
            <h2>Parkinson's Movement Analysis</h2>
            
            <button onClick={toggleDetection} className="toggle-btn">
                {isEnabled ? "Disable Detection" : "Enable Detection"}
            </button>
    
            {isEnabled && (
                <div className="analysis-status">
                    <p>Analyzing your mouse and keyboard activity...</p>
                    <div className="dots-loader">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            )}
    
            {severity && (
                <div className="severity-result">
                    <p>Detected Severity: <strong>{severity}</strong></p>
                </div>
            )}
        </div>
    );
};

export default ParkinsonsDetection;
