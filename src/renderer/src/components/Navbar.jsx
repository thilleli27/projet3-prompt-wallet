/**
 * Navbar Component
 * Main navigation bar for the application
 * 
 * Features:
 * - Navigation menu with dropdown items
 * - Dark/Light theme toggle
 * - Accessible navigation with ARIA labels
 * - Memoized to prevent unnecessary re-renders
 */

import { Link, NavLink } from "react-router-dom";
import { memo, useState, useEffect } from "react";

function Navbar() {
  // Theme state: false = light mode, true = dark mode
  const [isDark, setIsDark] = useState(false);

  /**
   * Update document class when theme changes
   * The 'dark' class is used by CSS to apply dark theme styles
   */
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav aria-label="Main navigation">
      <div className="nav-container">
        {/* Logo/Home link */}
        <div className="logo">
          <Link to="/" aria-label="Prompt Wallet Home">
            Prompt Wallet
          </Link>
        </div>

        {/* Main navigation menu */}
        <ul className="nav-menu">
          {/* Prompt menu with dropdown */}
          <li className="nav-item">
            <span className="nav-link" tabIndex={0}>
              Prompt
            </span>
            <div className="dropdown">
              <NavLink to="/" end>List</NavLink>
              <NavLink to="/new">New</NavLink>
              <NavLink to="/use/1">Use</NavLink>
            </div>
          </li>

          {/* Direct link to Terms and Conditions */}
          <li className="nav-item">
            <NavLink to="/cgu" className="nav-link">
              Terms
            </NavLink>
          </li>

          {/* Info menu with dropdown */}
          <li className="nav-item">
            <span className="nav-link" tabIndex={0}>
              Info
            </span>
            <div className="dropdown">
              <NavLink to="/about">About</NavLink>
            </div>
          </li>
        </ul>

        {/* Theme toggle button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle"
          aria-label="Toggle theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

/**
 * Export memoized component to prevent unnecessary re-renders
 * The memo wrapper ensures the component only re-renders if its props change
 */
export default memo(Navbar);
