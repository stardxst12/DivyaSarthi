import React from "react";
import { FiEdit, FiLogOut, FiBookmark, FiSettings, FiUser } from "react-icons/fi";
import "../styles/profile.scss";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1><FiUser className="profile-icon" /> My Profile</h1>
          <p>Manage your account and preferences</p>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar-container">
              <img 
                src="/path-to-profile-pic.jpg" 
                alt="Profile" 
                className="profile-avatar"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/150/6a0572/ffffff?text=User";
                }}
              />
              <div className="avatar-overlay">
                <FiEdit className="edit-icon" />
              </div>
            </div>
            <div className="user-details">
              <h2>User Name</h2>
              <p className="user-email">user@example.com</p>
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Saved Schemes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5</span>
                  <span className="stat-label">Applications</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-btn edit-btn">
              <FiEdit /> Edit Profile
            </button>
            <button className="action-btn saved-btn">
              <FiBookmark /> Saved Schemes
            </button>
            <button className="action-btn pref-btn">
              <FiSettings /> Accessibility
            </button>
            <button className="action-btn logout-btn">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;