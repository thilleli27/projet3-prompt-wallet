import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EditPrompt() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([""]);
  const [variablesDetected, setVariablesDetected] = useState([]);

  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);
  const [descLength, setDescLength] = useState(0);

  const [promptNotFound, setPromptNotFound] = useState(false);

  // Load the prompt to edit
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prompts');
      if (saved) {
        const prompts = JSON.parse(saved);
        const promptToEdit = prompts.find((p) => p.id === parseInt(id));

        if (promptToEdit) {
          setTitle(promptToEdit.title || "");
          setCategory(promptToEdit.category || promptToEdit.tag || "");
          setContent(promptToEdit.content || "");
          setDescription(promptToEdit.description || promptToEdit.preview || "");
          setTags(promptToEdit.tags && promptToEdit.tags.length > 0 ? promptToEdit.tags : [""]);

          setTitleLength(promptToEdit.title?.length || 0);
          setContentLength(promptToEdit.content?.length || 0);
          setDescLength(promptToEdit.description?.length || 0);

          if (promptToEdit.content) {
            detectVariables(promptToEdit.content);
          }
        } else {
          setPromptNotFound(true);
        }
      } else {
        setPromptNotFound(true);
      }
    } catch (error) {
      console.error("Error loading prompt:", error);
      setPromptNotFound(true);
    }
  }, [id]);

  function detectVariables(text) {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    const variables = [...new Set(matches.map((m) => m[1]))];
    setVariablesDetected(variables);
  }

  const addTagField = () => setTags([...tags, ""]);
  const removeTagField = (index) =>
    setTags(tags.filter((_, i) => i !== index));
  const updateTag = (index, value) =>
    setTags(tags.map((t, i) => (i === index ? value : t)));

  const handleSave = (e) => {
    e.preventDefault();

    try {
      const saved = localStorage.getItem('prompts');
      const prompts = saved ? JSON.parse(saved) : [];

      // Find the index of the prompt to update
      const promptIndex = prompts.findIndex((p) => p.id === parseInt(id));

      if (promptIndex !== -1) {
        // Update the prompt
        const updatedPrompt = {
          ...prompts[promptIndex],
          title,
          category,
          content,
          description,
          tags: tags.filter((t) => t.trim() !== ""),
          preview: description || content.substring(0, 80) + "...",
          tag: category || "Other",
          // Keep the original date
          date: prompts[promptIndex].date,
        };

        prompts[promptIndex] = updatedPrompt;

        // Save to localStorage
        localStorage.setItem('prompts', JSON.stringify(prompts));

        console.log("Prompt updated:", updatedPrompt);
        navigate("/");
      } else {
        alert("❌ Prompt not found");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Error updating prompt");
    }
  };

  if (promptNotFound) {
    return (
      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
        <h1 style={{ color: "#9A48D0" }}>❌ Prompt not found</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Prompt #{id} does not exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "1rem 2rem",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #9A48D0, #B288C0)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            backgroundColor: "#7BC950",
            color: "#fff",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          ✏️ Editing
        </span>
        <h1 style={{ fontSize: "2rem", color: "#9A48D0", margin: "0.5rem 0" }}>
          Edit prompt
        </h1>
        <p style={{ color: "#666" }}>
          Modify your prompt information
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Title */}
        <div>
          <label style={{ fontWeight: 600 }}>Prompt title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleLength(e.target.value.length);
            }}
            placeholder="Ex: API documentation generator"
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "2px solid #B288C0",
              marginTop: "0.5rem",
            }}
            required
          />
          <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#999" }}>
            {titleLength}/100 characters
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontWeight: 600 }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "2px solid #B288C0",
              marginTop: "0.5rem",
            }}
          >
            <option value="">Select a category</option>
            <option value="Documentation">Documentation</option>
            <option value="Code Review">Code Review</option>
            <option value="Communication">Communication</option>
            <option value="Testing">Testing</option>
            <option value="Database">Database</option>
            <option value="Debugging">Debugging</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label style={{ fontWeight: 600 }}>Prompt content *</label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setContentLength(e.target.value.length);
              detectVariables(e.target.value);
            }}
            placeholder="Ex: Create comprehensive documentation for the {{api_name}} API..."
            style={{
              width: "100%",
              minHeight: "150px",
              borderRadius: "12px",
              border: "2px solid #B288C0",
              padding: "1rem",
              marginTop: "0.5rem",
            }}
            required
          />
          <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#999" }}>
            {contentLength}/2000 characters
          </div>

          {variablesDetected.length > 0 && (
            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "#7BC950",
                color: "#fff",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                fontSize: "0.9rem",
              }}
            >
              <strong>✓ Variables detected ({variablesDetected.length}): </strong>
              {variablesDetected.map((v, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    margin: "0 0.25rem",
                    display: "inline-block",
                  }}
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label style={{ fontWeight: 600 }}>Tags</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {tags.map((tag, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(i, e.target.value)}
                  placeholder="Ex: API, Documentation"
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", border: "2px solid #B288C0" }}
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTagField(i)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      border: "2px solid #9A48D0",
                      backgroundColor: "#fff",
                      color: "#9A48D0",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTagField}
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "2px solid #7BC950",
                backgroundColor: "#fff",
                color: "#7BC950",
                cursor: "pointer",
              }}
            >
              + Add a tag
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontWeight: 600 }}>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescLength(e.target.value.length);
            }}
            placeholder="Ex: This prompt is used to quickly generate technical documentation..."
            style={{
              width: "100%",
              minHeight: "100px",
              borderRadius: "12px",
              border: "2px solid #B288C0",
              padding: "1rem",
              marginTop: "0.5rem",
            }}
          />
          <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#999" }}>
            {descLength}/500 characters
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "12px",
              border: "2px solid #333",
              backgroundColor: "#fff",
              color: "#333",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #9A48D0, #B288C0)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            💾 Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
