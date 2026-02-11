import { Link, NavLink } from "react-router-dom";
import { memo, useState, useEffect } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav aria-label="Main navigation">
      <div className="nav-container">
        <div className="logo">
          <Link to="/" aria-label="Prompt Wallet Home">
            Prompt Wallet
          </Link>
        </div>

        <ul className="nav-menu">
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

          <li className="nav-item">
            <NavLink to="/cgu" className="nav-link">
              Terms
            </NavLink>
          </li>

          <li className="nav-item">
            <span className="nav-link" tabIndex={0}>
              Info
            </span>
            <div className="dropdown">
              <NavLink to="/about">About</NavLink>
            </div>
          </li>
        </ul>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default memo(Navbar);
