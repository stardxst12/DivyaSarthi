import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { Search } from "@mui/icons-material";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset !== 0);
    return () => (window.onscroll = null);
  };

  // ===== [NEW] Search Function =====
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        {/* ===== LEFT SIDE (UNCHANGED) ===== */}
        <div className="left">
          <Link to="/">
            <img src="/divyasarthi_Logo.jpg" alt="DivyaSarthi Logo" className="home-logo" />
          </Link>
          <Link to="/schemes" className="nav-button">Schemes & Opportunities</Link>
          <Link to="/profile" className="nav-button">My Profile</Link>
          <Link to="/contact" className="nav-button">Contact & Help</Link>
          <Link to="/test" className="nav-button">Test</Link>
          <Link to="/parkinsons" className="nav-button">Parkinson's</Link>
        </div>

        {/* ===== RIGHT SIDE (ONLY SEARCH MODIFIED) ===== */}
        <div className="right">
          {/* ===== [UPDATED] Search Bar ===== */}
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nav-search-input"
            />
            <button type="submit" className="nav-search-button">
              <Search className="search-icon" />
            </button>
          </form>

          {/* REST REMAINS EXACTLY THE SAME */}
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/register" className="nav-button">Register</Link>
          <img
            src="https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            alt="User Profile"
          />
          <div className="profile">
            <div className="icon">▼</div>
            <div className="options">
              <Link to="/profile" className="dropdown-item">My Profile</Link>
              <Link to="/saved-schemes" className="dropdown-item">Saved Schemes</Link>
              <Link to="/accessibility" className="dropdown-item">Accessibility Settings</Link>
              <span className="dropdown-item logout">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;