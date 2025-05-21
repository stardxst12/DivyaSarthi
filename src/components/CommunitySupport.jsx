import React from "react";
import "../styles/community.scss";  

const CommunitySupport = () => {
  return (
    <div className="page-container community-page">
      <div className="overlay"></div>
      <div className="community-support">
        <h1>Community & Support</h1>
        <div className="support-options">
          <div className="option">Discussion Forums</div>
          <div className="option">Live Chat Support</div>
          <div className="option">Resource Library</div>
          <div className="option">Workshops & Webinars</div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;
