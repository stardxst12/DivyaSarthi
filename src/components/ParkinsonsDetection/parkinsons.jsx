let isDetectionEnabled = false;

// Toggle Detection Status
function toggleDetection() {
    isDetectionEnabled = !isDetectionEnabled;
    let button = document.getElementById("toggleDetectionBtn");

    // Update Button Text
    button.textContent = isDetectionEnabled ? "Disable Parkinson’s Detection" : "Enable Parkinson’s Detection";

    // Send Status to Backend
    fetch("http://127.0.0.1:5000/detection_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: isDetectionEnabled })
    });

    if (isDetectionEnabled) {
        trackUserMovements();
    }
}

// Tracks User Movement
function trackUserMovements() {
    if (!isDetectionEnabled) return;

    let tremorCount = 0, misclickCount = 0, typoCount = 0;
    let tremorFrequency = 0, lastTime = Date.now();

    // Mouse Tremors (Small, Rapid Mouse Movements)
    document.addEventListener("mousemove", (event) => {
        let currentTime = Date.now();
        let timeDiff = currentTime - lastTime;

        if (timeDiff < 50) { // Small, quick movements
            tremorCount++;
        }

        tremorFrequency = tremorCount / (timeDiff / 1000);
        lastTime = currentTime;
    });

    // Misclicks (Clicks within a short time)
    document.addEventListener("click", (event) => {
        misclickCount++;
    });

    // Typo Count (Detects Backspace Key Presses)
    document.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
            typoCount++;
        }
    });

    // Send Data Every 5 Seconds
    setInterval(() => {
        if (!isDetectionEnabled) return;

        let movementData = {
            tremorCount,
            misclickCount,
            typoCount,
            tremorFrequency
        };

        // Send data to backend
        fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movementData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Predicted Severity:", data.severity);
            adjustFontSize(data.severity);
        })
        .catch(error => console.error("Error:", error));

        // Reset Counters
        tremorCount = 0;
        misclickCount = 0;
        typoCount = 0;

    }, 5000);
}

// Adjust Font Size Based on Severity
function adjustFontSize(severity) {
    let body = document.body;
    
    if (severity === "Non-Parkinson's") {
        body.style.fontSize = "16px";
    } else if (severity === "Mild Parkinson's") {
        body.style.fontSize = "18px";
    } else if (severity === "Moderate Parkinson's") {
        body.style.fontSize = "20px";
    } else if (severity === "Severe Parkinson's") {
        body.style.fontSize = "22px";
    }
}

// Attach Event to Button
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("toggleDetectionBtn").addEventListener("click", toggleDetection);
});
