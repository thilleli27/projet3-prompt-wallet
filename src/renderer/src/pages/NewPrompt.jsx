/**
 * NewPrompt Page
 * Form for creating a new prompt or editing an existing one
 * 
 * Features:
 * - Form fields: title, category, content, description, tags
 * - Character counters for inputs
 * - Automatic variable detection ({{variable}} syntax)
 * - Dynamic tag management (add/remove tags)
 * - Support for drag-drop pre-filled content
 * - Form validation
 * - Auto-save to file storage
 * - Optional edit mode (can be extended for editing existing prompts)
 * 
 * Variables in Prompts:
 * - Use {{variable_name}} syntax in content
 * - Variables are automatically detected and highlighted
 * - Users can substitute them when using the prompt
 * 
 * Data Flow:
 * 1. User fills form
 * 2. Variables are detected from {{...}} patterns
 * 3. Submit creates prompt object with unique ID (timestamp)
 * 4. And saves to file via IPC handler
 * 5. Navigate back to dashboard
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NewPrompt() {
  const navigate = useNavigate();
  const location = useLocation(); // For receiving drag-drop data

  // Form field states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([""]);
  const [variablesDetected, setVariablesDetected] = useState([]);

  // Character counters for display
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);
  const [descLength, setDescLength] = useState(0);

  // Edit mode flag (for future edit functionality)
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize form with edit or drag-drop data
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");

    if (editId) {
      setIsEditMode(true);
      // TODO: Load existing prompt data from storage
      setTitle("API documentation generator");
      setCategory("documentation");
      const sampleContent =
        "Create comprehensive documentation for the {{api_name}} API. Include endpoints, parameters, request and response examples. The documentation should cover {{number_endpoints}} main endpoints.";
      setContent(sampleContent);
      setTitleLength(40);
      setContentLength(162);
      detectVariables(sampleContent);
    }

    // Pre-fill form with drag-drop data
    if (location.state?.title) {
      setTitle(location.state.title);
      setTitleLength(location.state.title.length);
    }
    if (location.state?.content) {
      setContent(location.state.content);
      setContentLength(location.state.content.length);
      detectVariables(location.state.content);
    }
  }, [location.search, location.state]);

  // Detect variables in content
  function detectVariables(text) {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    const variables = [...new Set(matches.map((m) => m[1]))];
    setVariablesDetected(variables);
  }

  // Tag management
  const addTagField = () => setTags([...tags, ""]);
  const removeTagField = (index) =>
    setTags(tags.filter((_, i) => i !== index));
  const updateTag = (index, value) =>
    setTags(tags.map((t, i) => (i === index ? value : t)));

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const prompt = {
        id: Date.now(),
        title,
        category,
        content,
        description,
        tags: tags.filter((t) => t.trim() !== ""),
        date: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        preview: description || content.substring(0, 80) + "...",
        tag: category || "Other",
      };

      const existingPrompts = await window.api.prompts.load();
      const promptsArray = Array.isArray(existingPrompts) ? existingPrompts : [];
      const updatedPrompts = [prompt, ...promptsArray];

      const result = await window.api.prompts.save(updatedPrompts);

      if (result.success) {
        console.log("Prompt saved:", prompt);
        navigate("/");
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Error saving prompt");
    }
  };

  // JSX du composant
  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            backgroundColor: isEditMode ? "#7BC950" : "#B288C0",
            color: "#fff",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          {isEditMode ? "✏️ Editing" : "✨ New prompt"}
        </span>
        <h1 style={{ fontSize: "2rem", color: "#9A48D0", margin: "0.5rem 0" }}>
          {isEditMode ? "Edit prompt" : "Create a new prompt"}
        </h1>
        <p style={{ color: "#666" }}>
          Fill in the information below to create your custom prompt
        </p>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
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
        {/* Title Field */}
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

        {/* Category Field */}
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

        {/* Content Field */}
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

          {/* Variable Detection Feedback */}
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

        {/* Tags Field */}
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

        {/* Description Field */}
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

        {/* Form Actions */}
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
              fontWeight: 600,
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
              fontWeight: 600,
            }}
          >
            💾 Save prompt
          </button>
        </div>
      </form>
    </div>
  );
}
