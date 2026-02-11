import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function PromptCard({ prompt, onDelete }) {
  const navigate = useNavigate();
  const goToUse = useCallback(() => navigate(`/use/${prompt.id}`), [navigate, prompt.id]);
  const goToEdit = useCallback(() => navigate(`/edit/${prompt.id}`), [navigate, prompt.id]);
  const handleDelete = useCallback(() => onDelete(prompt.id), [onDelete, prompt.id]);

  return (
    <div className="prompt-card">
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
      <p className="prompt-preview">{prompt.preview}</p>
      <div className="prompt-meta">
        <span>📅 {prompt.date}</span>
        <span className="prompt-tag">{prompt.tag}</span>
      </div>
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

export default memo(PromptCard);