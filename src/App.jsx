import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import Navbar from "./Navbar";
import Home from "./Home";
import Scheme from "./Scheme";
import AccessibilitySidebar from "./components/AccessibilitySidebar";
import AccessibilityPage from "./components/AccessibilityPage";
import CommunitySupport from "./components/CommunitySupport";
import ProfilePage from "./components/ProfilePage";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import IshiharaTest from "./components/IshiharaTest";
import ParkinsonsDetection from "./components/ParkinsonsDetection/ParkinsonsDetection.jsx";

import "./styles/accessibility.scss";

const App = () => {
  const location = useLocation();
  const isAccessibilityPage = location.pathname === "/accessibility";
  const [showSidebar, setShowSidebar] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--user-font-size", `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.toggle("dyslexic-font", isDyslexicFont);
  }, [isDyslexicFont]);

  return (
    <div className="app-container">
      {!isAccessibilityPage && (
        <button
          className={`accessibility-toggle ${showSidebar ? "shifted" : ""}`}
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle Accessibility Tools"
        >
          <SlidersHorizontal size={24} />
        </button>
      )}

      <Navbar />

      {!isAccessibilityPage && showSidebar && (
        <AccessibilitySidebar
          fontSize={fontSize}
          setFontSize={setFontSize}
          isDyslexicFont={isDyslexicFont}
          setIsDyslexicFont={setIsDyslexicFont}
          closeSidebar={() => setShowSidebar(false)}
        />
      )}

      <div className="main-content">
        <div className={`content-area ${showSidebar ? "with-sidebar" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Scheme />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/community" element={<CommunitySupport />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<IshiharaTest />} />
            <Route path="/parkinsons" element={<ParkinsonsDetection />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
