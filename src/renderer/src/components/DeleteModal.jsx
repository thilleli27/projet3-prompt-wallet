/**
 * DeleteModal Component
 * Confirmation dialog for deleting a prompt
 * 
 * Props:
 * - open: Boolean to show/hide the modal
 * - onClose: Callback to close modal (triggered by Cancel button or ESC key)
 * - onConfirm: Callback to confirm deletion
 * 
 * Features:
 * - Close with ESC key (standard UX)
 * - Click outside closes modal
 * - Prevents body scroll when modal is open
 * - Accessible with aria-modal and proper labels
 * - Memoized for performance
 */

import { useEffect, useCallback, memo } from "react";

function DeleteModal({ open, onClose, onConfirm }) {
  /**
   * Handle keyboard events for ESC key
   * Implements standard modal closing behavior
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  /**
   * Setup modal event listeners and body scroll lock
   * Cleanup when modal closes or component unmounts
   */
  useEffect(() => {
    if (!open) return;
    
    // Add keyboard listener for ESC key
    document.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    
    // Cleanup listeners and restore scrolling
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, handleKeyDown]);

  // Don't render anything if modal is not open
  if (!open) return null;

  return (
    <div
      className="modal active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-content">
        <h2 className="modal-title" id="delete-modal-title">
          Confirm deletion
        </h2>
        <p className="modal-text">
          Are you sure you want to delete this prompt?
        </p>
        <div className="modal-actions">
          {/* Cancel button */}
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          {/* Confirm delete button - auto-focused for keyboard accessibility */}
          <button className="btn-confirm" onClick={onConfirm} autoFocus>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Export memoized component
 * Only re-renders when props actually change
 */
export default memo(DeleteModal);
