import React, { useEffect, useState } from 'react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isDyslexic, setIsDyslexic] = useState(false);

  useEffect(() => {
    const fontPref = localStorage.getItem('dyslexicFont');
    setIsDyslexic(fontPref === 'true');
  }, []);

  return (
    <div
      id="main-content"
      className={`home-container default-font-size ${isDyslexic ? 'dyslexic-font' : ''}`}
    >
      <header className="hero-section">
        <h1>Empowering Abilities, Creating Opportunities</h1>
        <p>
          Discover inclusive job opportunities and support schemes designed to help you thrive in your career journey.
        </p>

        <div className="cta-buttons">
          <button className="cta-button find-jobs" onClick={() => navigate('/schemes')}>Find Jobs</button>
          <button className="cta-button explore-schemes" onClick={() => navigate('/schemes')}>Find Schemes</button>
        </div>
      </header>

      <div className="features-section">
        <button className="feature-card" onClick={() => navigate('/test')}>
          <div className="card-content">
            <h2>Ishihara Test</h2>
            <p>Take a quick skill assessment or practice test relevant to your goals.</p>
          </div>
        </button>

        <button className="feature-card" onClick={() => navigate('/parkinsons')}>
          <div className="card-content">
            <h2>Parkinson's Detection</h2>
            <p>Start real-time movement analysis to detect early signs of Parkinson’s.</p>
          </div>
        </button>

        <button className="feature-card" onClick={() => navigate('/accessibility')}>
          <div className="card-content">
            <h2>Accessibility Tools</h2>
            <p>Customize your experience with tools designed for accessibility.</p>
          </div>
        </button>
      </div>

      <section className="latest-opportunities">
        <div className="section-header">
          <h2>Latest Opportunities</h2>
          <p>Explore our curated list of the latest job openings and support schemes available for you.</p>
        </div>

        <div className="opportunities-list">
          <button
            className="opportunity-item"
            onClick={() => window.open('https://example.com/scheme1', '_blank')}
          >
            <h3>Sugamya Bharat Abhiyan</h3>
            <p>Accessibility scheme for infrastructure and digital services</p>
          </button>

          <button
            className="opportunity-item"
            onClick={() => window.open('https://example.com/scheme2', '_blank')}
          >
            <h3>Deendayal Disabled Rehabilitation Scheme</h3>
            <p>Financial assistance for NGOs working for the disabled</p>
          </button>
        </div>

        <button
          className="view-all-button"
          onClick={() => navigate('/schemes')}
        >
          View All Opportunities
        </button>
      </section>
    </div>
  );
};

export default Home;
