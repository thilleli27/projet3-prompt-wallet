/**
 * React Application Entry Point
 * Renders the App component into the DOM
 * 
 * Loads:
 * - App component with routing
 * - Global CSS styles
 * - React StrictMode for development warnings
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Render React app into root div in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode highlights potential issues in development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
