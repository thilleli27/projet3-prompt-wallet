/**
 * Main Application Component
 * Entry point for the Prompt Wallet Electron application
 * 
 * This app allows users to:
 * - View, create, edit and delete prompts
 * - Search and filter prompts
 * - Toggle between dark and light theme
 * - Use keyboard shortcuts for navigation
 * - Drag & drop files to create new prompts
 */

import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewPrompt from "./pages/NewPrompt";
import EditPrompt from "./pages/EditPrompt";
import UsePrompt from "./pages/UsePrompt";
import About from "./pages/About";
import Cgu from "./pages/Cgu";
import Navbar from "./components/Navbar";
import DropZone from "./components/DropZone";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

/**
 * AppContent Component
 * Contains the main navigation and route configuration
 * Activates global keyboard shortcuts and file drag-drop functionality
 */
function AppContent() {
  // Activate keyboard shortcuts for navigation and help
  useKeyboardShortcuts()

  return (
    // DropZone enables drag-and-drop file functionality
    <DropZone>
      {/* Main navigation bar */}
      <Navbar />
      
      {/* Application routes */}
      <Routes>
        {/* Dashboard: List all prompts */}
        <Route path="/" element={<Dashboard />} />
        {/* Create new prompt */}
        <Route path="/new" element={<NewPrompt />} />
        {/* Edit existing prompt */}
        <Route path="/edit/:id" element={<EditPrompt />} />
        {/* Use/view specific prompt */}
        <Route path="/use/:id" element={<UsePrompt />} />
        {/* About page */}
        <Route path="/about" element={<About />} />
        {/* Terms and conditions */}
        <Route path="/cgu" element={<Cgu />} />
      </Routes>
    </DropZone>
  )
}

/**
 * Root App Component
 * Wraps the application with HashRouter for client-side routing
 * (Using HashRouter instead of BrowserRouter for Electron compatibility)
 */
export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
