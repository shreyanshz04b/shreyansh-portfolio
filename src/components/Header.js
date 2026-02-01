// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ onChatBotClick }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const goToAdminLogin = () => navigate("/adminlogin");

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="header">
      <nav className="navbar">
        {/* Left: Hamburger + Logo (if any) */}
        <div className="left-section">
          <div className="hamburger" onClick={toggleMenu}>
            &#9776;
          </div>
        </div>

        {/* Center: Navigation Links */}
        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/skills">Skills</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/chatbot">Chat Bot</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/resume">Resume Generate</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Right: Admin Button */}
        <div className="right-section">
          <button className="admin-login-button neon-pulse" onClick={goToAdminLogin}>
            Admin
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
