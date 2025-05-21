import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Scheme.scss";

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false); // New state for search status
  const location = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch schemes and categories
  useEffect(() => {
    fetch("http://localhost:5000/api/schemes")
      .then((res) => res.json())
      .then((data) => {
        setSchemes(data);
        setFilteredSchemes(data);

        // Extract unique categories
        const allCategories = new Set();
        data.forEach((scheme) => {
          scheme.fields?.schemeCategory?.forEach((cat) => allCategories.add(cat));
        });
        setCategories(["All", ...Array.from(allCategories)]);
      })
      .catch((err) => console.error("Error fetching schemes:", err));
  }, []);

  // Enhanced search handler
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search')?.toLowerCase().trim();
    
    if (searchTerm) {
      setIsSearching(true);
      const filtered = schemes.filter(scheme => {
        const nameMatch = scheme.fields?.schemeName?.toLowerCase().includes(searchTerm);
        const descMatch = scheme.fields?.briefDescription?.toLowerCase().includes(searchTerm);
        const categoryMatch = scheme.fields?.schemeCategory?.some(cat => 
          cat.toLowerCase().includes(searchTerm)
        );
        return nameMatch || descMatch || categoryMatch;
      });
      setFilteredSchemes(filtered);
      setSelectedCategory("All");
    } else {
      setIsSearching(false);
      if (selectedCategory === "All") {
        setFilteredSchemes(schemes);
      }
    }
  }, [location.search, schemes, selectedCategory]);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setIsSearching(false); // Reset search status when filtering by category

    if (category === "All") {
      setFilteredSchemes(schemes);
    } else {
      const filtered = schemes.filter((scheme) =>
        scheme.fields?.schemeCategory?.includes(category)
      );
      setFilteredSchemes(filtered);
    }
  };

  const handleExplore = (externalLink) => {
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
    } else {
      alert('This scheme currently has no external link available.');
    }
  };

  return (
    <div className="schemes">
      <div className="schemes-container">
        <h1>Government & Private Schemes</h1>
        <p>Explore available opportunities designed for accessibility and inclusivity.</p>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`filter-button ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => filterByCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Status Indicator */}
        {isSearching && (
          <div className="search-status">
            Showing results for: <strong>{new URLSearchParams(location.search).get('search')}</strong>
            <button 
              onClick={() => {
                setSelectedCategory("All");
                setIsSearching(false);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="clear-search"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Scheme Grid */}
        <div className="scheme-grid">
          {filteredSchemes.length === 0 ? (
            <p className="no-results">
              {isSearching 
                ? "No schemes match your search. Try different keywords."
                : "No schemes found in this category."}
            </p>
          ) : (
            filteredSchemes.map((scheme, index) => (
              <div className="scheme-card" key={index}>
                <h2>{scheme.fields?.schemeName || "Untitled Scheme"}</h2>
                <p>{scheme.fields?.briefDescription || "No description available."}</p>
                <button onClick={() => handleExplore(scheme.fields?.externalLink)}>
                  Explore
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheme;