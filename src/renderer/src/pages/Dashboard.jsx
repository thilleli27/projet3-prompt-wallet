/**
 * Dashboard Page
 * Main landing page showing all prompts
 * 
 * Features:
 * - Load and display all saved prompts
 * - Search/filter prompts by title
 * - Delete prompts with confirmation dialog
 * - Navigate to create/edit/use prompt pages
 * - Loading state while fetching prompts from file storage
 * - Displays initial prompts if no saved prompts exist
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PromptCard from "../components/PromptCard";
import DeleteModal from "../components/DeleteModal";
import FilterBar from "../components/FilterBar";
import { prompts as initialPrompts } from "../data/prompts";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State management
  const [prompts, setPrompts] = useState([]);        // All prompts from file
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [search, setSearch] = useState("");          // Search query
  const [deleteId, setDeleteId] = useState(null);    // ID of prompt to delete

  /**
   * Load prompts from file on component mount
   * If no saved prompts exist, use initial sample prompts
   * Handles errors gracefully by falling back to initial prompts
   */
  useEffect(() => {
    async function loadPrompts() {
      try {
        const savedPrompts = await window.api.prompts.load();
        
        // If no prompts saved yet, use initial sample prompts
        if (savedPrompts.length === 0) {
          setPrompts(initialPrompts);
          // Save initial prompts to file
          await window.api.prompts.save(initialPrompts);
        } else {
          setPrompts(savedPrompts);
        }
      } catch (error) {
        console.error('Error loading prompts:', error);
        // On error, fallback to initial prompts
        setPrompts(initialPrompts);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrompts();
  }, []);

  /**
   * Auto-save prompts to file whenever they change
   * Skips saving during initial load and when no prompts exist
   */
  useEffect(() => {
    if (!isLoading && prompts.length > 0) {
      window.api.prompts.save(prompts);
    }
  }, [prompts, isLoading]);

  /**
   * Filter prompts based on search query
   * Memoized to optimize performance - only recalculates when dependencies change
   */
  const filteredPrompts = useMemo(
    () => prompts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [prompts, search]
  );

  /**
   * Delete prompt from list
   * Called after user confirms deletion in modal
   */
  const deletePrompt = () => {
    if (deleteId === null) return;
    setPrompts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  // Show loading state while fetching prompts
  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <p style={{ color: '#9A48D0', fontSize: '1.2rem' }}>Loading prompts...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header with title and create button */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="btn-new" onClick={() => navigate("/new")}>
          + New Prompt
        </button>
      </div>

      {/* Search/Filter bar */}
      <FilterBar value={search} onChange={setSearch} />

      {/* Grid of prompt cards */}
      <div className="prompts-grid">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      {/* Empty state message */}
      {filteredPrompts.length === 0 && (
        <p className="empty-state">No prompt found</p>
      )}

      {/* Delete confirmation modal */}
      <DeleteModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={deletePrompt}
      />
    </div>
  );
}