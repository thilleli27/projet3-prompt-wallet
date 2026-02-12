import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NewPrompt() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");

    if (editId) {
      setIsEditMode(true);
      setTitle("API documentation generator");
      setCategory("documentation");
      const sampleContent =
        "Create comprehensive documentation for the {{api_name}} API. Include endpoints, parameters, request and response examples. The documentation should cover {{number_endpoints}} main endpoints.";
      setContent(sampleContent);
      setTitleLength(40);
      setContentLength(162);
      detectVariables(sampleContent);
    }

    // 🎯 NOUVEAUTÉ : Récupérer les données du drag & drop
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

  const handleSubmit = (e) => {
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

      // Get existing prompts
      const saved = localStorage.getItem('prompts');
      const existingPrompts = saved ? JSON.parse(saved) : [];

      // Check that it's an array
      const promptsArray = Array.isArray(existingPrompts) ? existingPrompts : [];

      // Add the new prompt at the beginning
      const updatedPrompts = [prompt, ...promptsArray];

      // Save to localStorage
      localStorage.setItem('prompts', JSON.stringify(updatedPrompts));

      console.log("Prompt saved:", prompt);
      navigate("/");
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Error saving prompt");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      {/* Header */}
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

      {/* Form */}
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
            💾 Save prompt
          </button>
        </div>
      </form>
    </div>
  );
}
