/**
 * PromptCard Component
 * Displays a single prompt in card format
 * 
 * Props:
 * - prompt: Object containing prompt data (id, title, preview, date, tag)
 * - onDelete: Callback function triggered when delete button is clicked
 * 
 * Features:
 * - Clickable title to view/use the prompt
 * - Preview text
 * - Metadata (date and category tag)
 * - Edit and Delete action buttons
 * - Accessible with keyboard navigation
 * - Memoized for performance
 */

import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function PromptCard({ prompt, onDelete }) {
  const navigate = useNavigate();
  
  /**
   * Navigation handlers using useCallback to maintain referential equality
   * and prevent unnecessary re-renders of child components
   */
  const goToUse = useCallback(() => navigate(`/use/${prompt.id}`), [navigate, prompt.id]);
  const goToEdit = useCallback(() => navigate(`/edit/${prompt.id}`), [navigate, prompt.id]);
  const handleDelete = useCallback(() => onDelete(prompt.id), [onDelete, prompt.id]);

  return (
    <div className="prompt-card">
      {/* Clickable title - acts as a button to view prompt */}
      <h3
        className="prompt-title"
        onClick={goToUse}
        onKeyDown={(e) => e.key === "Enter" && goToUse()}
        tabIndex={0}
        role="button"
        aria-label={`Use prompt ${prompt.title}`}
      >
        {prompt.title}
      </h3>
      
      {/* Preview text excerpt */}
      <p className="prompt-preview">{prompt.preview}</p>
      
      {/* Metadata: creation date and category */}
      <div className="prompt-meta">
        <span>📅 {prompt.date}</span>
        <span className="prompt-tag">{prompt.tag}</span>
      </div>
      
      {/* Action buttons */}
      <div className="card-actions">
        <button className="btn-edit" onClick={goToEdit} aria-label={`Edit prompt ${prompt.title}`}>
          ✏️ Edit
        </button>
        <button className="btn-delete" onClick={handleDelete} aria-label={`Delete prompt ${prompt.title}`}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

/**
 * Export memoized component
 * Prevents re-render when parent changes but props remain the same
 */
export default memo(PromptCard);