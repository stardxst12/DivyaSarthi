import React, { useState } from 'react';
import allPlates from '../ishihara_plates.json';
import "../styles/IshiharaTest.scss"
import TextToAudio from './TextToAudio.jsx';


const SHORT_TEST_LENGTH = 12;

const IshiharaTest = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isFullTest, setIsFullTest] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [severity, setSeverity] = useState("normal");
  const [colorAdjustment, setColorAdjustment] = useState(false);

  const plates = isFullTest ? allPlates : allPlates.slice(0, SHORT_TEST_LENGTH);

  const startTest = (fullTest) => {
    setShowInstructions(false);
    setTestStarted(true);
    setIsFullTest(fullTest);
  };
  const handleNext = () => {
    const plate = plates[index];
    let diagnosis = "Normal Vision";
  
    // Handle different categories based on the selected answer
    if (plate.category === "vanishing" && answer !== plate.normal_vision) {
      diagnosis = "Possible Color Blindness";
    } else if (plate.category === "transformation" && answer === plate.color_blind_vision) {
      diagnosis = "Red-Green Color Blindness";
    } else if (plate.category === "hidden_digit" && answer === plate.color_blind_vision) {
      diagnosis = "Color Blindness Detected";
    } else if (plate.category === "classification") {
      if (answer === plate.protanopia) diagnosis = "Protanopia (Red-Blind)";
      else if (answer === plate.deuteranopia) diagnosis = "Deuteranopia (Green-Blind)";
      else if (answer === plate.blue_green) diagnosis = "Blue-Green Color Blindness";
      else if (answer === plate.orange) diagnosis = "Orange Line Color Blindness";
      else if (answer === plate.violet) diagnosis = "Violet Line Color Blindness";
      else if (answer === plate.blue_green_yellow_green) diagnosis = "Blue-Green & Yellow-Green Color Blindness";
      else if (answer === plate.red_green_violet) diagnosis = "Red-Green & Violet Line Color Blindness";
      else if (answer === plate.violet_orange) diagnosis = "Violet & Orange Line Color Blindness";
    }
  
    // Save the result for the current plate
    setResults([...results, { plate: plate.id, userAnswer: answer, diagnosis }]);
    setAnswer(""); // Reset answer field
    if (index < plates.length - 1) {
      setIndex(index + 1);
    } else {
      calculateSeverity(); // Calculate severity based on accumulated results
      setTestStarted(false);
      setTestCompleted(true);
    }
  };
  /*const handleNext = () => {
    const plate = plates[index];
    let diagnosis = "Normal Vision";

    if (plate.category === "vanishing" && answer !== plate.normal_vision) {
      diagnosis = "Possible Color Blindness";
    } else if (plate.category === "transformation" && answer === plate.color_blind_vision) {
      diagnosis = "Red-Green Color Blindness";
    } else if (plate.category === "hidden_digit" && answer === plate.color_blind_vision) {
      diagnosis = "Color Blindness Detected";
    } else if (plate.category === "classification") {
      if (answer === plate.protanopia) diagnosis = "Protanopia (Red-Blind)";
      else if (answer === plate.deuteranopia) diagnosis = "Deuteranopia (Green-Blind)";
    }

    setResults([...results, { plate: plate.id, userAnswer: answer, diagnosis }]);
    setAnswer("");

    if (index < plates.length - 1) {
      setIndex(index + 1);
    } else {
      calculateSeverity();
      setTestStarted(false);
      setTestCompleted(true);
    }
  };*/

  const calculateSeverity = () => {
    const issues = results.filter(res => res.diagnosis !== "Normal Vision").length;
    if (issues > 10) setSeverity("severe");
    else if (issues > 5) setSeverity("moderate");
    else if (issues > 2) setSeverity("mild");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleNext();
  };
  const ColorBlindnessRadioButtons = () => (
    <div className="color-blindness-options">
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="purple" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Only the Purple Line
      </label>
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="red-green" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Only the Red-Green Line
      </label>
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="blue-green" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Blue-Green Line
      </label>
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="orange" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Orange Line
      </label>
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="blue-green-yellow-green" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Blue-Green & Yellow-Green Line
      </label>
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="red-green-violet" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Red-Green & Violet Line
      </label>
      <label>
        <input 
          type="radio" 
          name="colorBlindness" 
          value="violet-orange" 
          onChange={(e) => setAnswer(e.target.value)} 
          className="option-radio" 
        />
        Violet & Orange Line
      </label>
    </div>
  );
  
  return (
    <div className={`test-container ${colorAdjustment ? severity : ''}`}>
      {showInstructions && (
        <section className="instructions">
          <h1>Welcome to the Ishihara Color Vision Test</h1>
          <p>
            <TextToAudio text="The Ishihara Test is a widely recognized method to assess color vision deficiencies.
              It consists of a series of plates filled with colored dots, forming numbers or patterns 
              that individuals with normal color vision can distinguish." />
            The Ishihara Test is a widely recognized method to assess color vision deficiencies.
            It consists of a series of plates filled with colored dots, forming numbers or patterns 
            that individuals with normal color vision can distinguish.
          </p>
          <h2>Test Instructions:</h2>
          <ul>
            <li>Sit approximately 75cm (30 inches) from your screen.</li>
            <li>Use a well-lit environment without glare on the screen.</li>
            <li>Identify the number or pattern within 5 seconds and input your answer.</li>
          </ul>
          <h2>Test Options:</h2>
          <p>
            <strong>Short Test:</strong> 12 plates (preliminary screening).<br />
            <strong>Full Test:</strong> 38 plates (detailed analysis).
          </p>
          <button onClick={() => startTest(false)} className="test-button">Short Test</button>
          <button onClick={() => startTest(true)} className="test-button">Full Test</button>
        </section>
      )}
  
      {testStarted && (
        <section className="test-section">
          <h2>Plate {index + 1} of {plates.length}</h2>
          <img src={`src/Ishihara/plate_${plates[index].id}.jpeg`} alt={`Plate ${index + 1}`} className="test-image" />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter number or 'nothing'"
            className="test-input"
          />
  
          {/* Only show radio buttons during the Full Test */}
          {isFullTest && <ColorBlindnessRadioButtons />}
  
          <button onClick={handleNext} className="next-button">Next</button>
        </section>
      )}
  
      {testCompleted && (
        <section className="results-section">
          <h2>Test Completed</h2>
          <p>Your detected color vision deficiency severity: <strong>{severity}</strong></p>
          <p>Would you like to adjust the website's color scheme?</p>
          <button onClick={() => setColorAdjustment(true)} className="adjust-button">Yes, adjust colors</button>
          <button onClick={() => setColorAdjustment(false)} className="reset-button">No, keep default</button>
        </section>
      )}
    </div>
  );
};

export default IshiharaTest;

