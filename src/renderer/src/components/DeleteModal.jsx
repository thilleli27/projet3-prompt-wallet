import { useEffect, useCallback, memo } from "react";

function DeleteModal({ open, onClose, onConfirm }) {
  // Close with ESC key (standard UX)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, handleKeyDown]);

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
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm} autoFocus>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(DeleteModal);
