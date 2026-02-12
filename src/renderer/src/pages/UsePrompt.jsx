import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UsePrompt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(null);
  const [variables, setVariables] = useState({});
  const [detectedVars, setDetectedVars] = useState([]);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [promptNotFound, setPromptNotFound] = useState(false);

  // Charger depuis le fichier
  useEffect(() => {
    async function loadPrompt() {
      try {
        const prompts = await window.api.prompts.load();
        const foundPrompt = prompts.find((p) => p.id === parseInt(id));

        if (foundPrompt) {
          setPrompt(foundPrompt);

          // Detect variables in content
          const regex = /\{\{([^}]+)\}\}/g;
          const matches = [...foundPrompt.content.matchAll(regex)];
          const vars = [...new Set(matches.map((m) => m[1]))];
          setDetectedVars(vars);

          // Initialize variable values
          const initialVars = {};
          vars.forEach((v) => {
            initialVars[v] = "";
          });
          setVariables(initialVars);
        } else {
          setPromptNotFound(true);
        }
      } catch (error) {
        console.error("Error loading prompt:", error);
        setPromptNotFound(true);
      }
    }

    loadPrompt();
  }, [id]);

  // Update final prompt when variables change
  useEffect(() => {
    if (!prompt) return;

    let result = prompt.content;
    let allFilled = true;

    detectedVars.forEach((varName) => {
      const value = variables[varName];
      if (!value || !value.trim()) {
        allFilled = false;
      }
      result = result.replace(new RegExp(`\\{\\{${varName}\\}\\}`, "g"), value || `{{${varName}}}`);
    });

    setFinalPrompt(
      allFilled && detectedVars.length > 0
        ? result
        : detectedVars.length === 0
        ? prompt.content
        : "Fill in all variables above to see your customized prompt..."
    );
  }, [variables, prompt, detectedVars]);

  const updateVariable = (varName, value) => {
    setVariables((prev) => ({
      ...prev,
      [varName]: value,
    }));
  };

  const copyToClipboard = () => {
    if (!finalPrompt || (detectedVars.length > 0 && finalPrompt.includes("{{"))) {
      alert("⚠️ Please fill in all variables before copying the prompt.");
      return;
    }
    navigator.clipboard.writeText(finalPrompt).then(() => {
      alert("✅ Prompt copied to clipboard!");
    });
  };

  const goToDashboard = () => {
    navigate("/");
  };

  if (promptNotFound) {
    return (
      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
        <h1 style={{ color: "#9A48D0" }}>❌ Prompt not found</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Prompt #{id} does not exist or has been deleted.
        </p>
        <button
          onClick={goToDashboard}
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

  if (!prompt) {
    return (
      <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem", textAlign: "center" }}>
        <p style={{ color: "#666" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      {/* Main container */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
        {/* Back button */}
        <button
          onClick={goToDashboard}
          style={{
            marginBottom: "2rem",
            color: "#9A48D0",
            fontWeight: 600,
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: "1rem",
          }}
        >
          ← Back to list
        </button>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#9A48D0", marginBottom: "0.5rem" }}>
            {prompt.title}
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            {detectedVars.length > 0
              ? "Fill in the variables and copy your customized prompt"
              : "Copy your prompt"}
          </p>
          {prompt.tag && (
            <span
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                backgroundColor: "#B288C0",
                color: "#fff",
                fontSize: "0.9rem",
              }}
            >
              {prompt.tag}
            </span>
          )}
        </div>

        {/* Description if available */}
        {prompt.description && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #B288C0",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ color: "#666", lineHeight: 1.6, margin: 0 }}>{prompt.description}</p>
          </div>
        )}

        {/* Original prompt */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #B288C0",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#9A48D0",
              marginBottom: "1rem",
              borderBottom: "2px solid #B288C0",
              paddingBottom: "0.5rem",
            }}
          >
            Original prompt
          </h2>
          <div
            style={{
              backgroundColor: "#F8F8F8",
              padding: "1.5rem",
              borderRadius: "12px",
              lineHeight: 1.8,
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {detectedVars.length > 0 ? (
              prompt.content.split(/(\{\{[^}]+\}\})/g).map((part, i) => {
                const match = part.match(/\{\{([^}]+)\}\}/);
                if (match) {
                  const varName = match[1];
                  return (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "#B288C0",
                        color: "#fff",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {variables[varName] || `{{${varName}}}`}
                    </span>
                  );
                }
                return part;
              })
            ) : (
              prompt.content
            )}
          </div>
        </div>

        {/* Variables (only if detected) */}
        {detectedVars.length > 0 && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #B288C0",
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#9A48D0",
                marginBottom: "1rem",
                borderBottom: "2px solid #B288C0",
                paddingBottom: "0.5rem",
              }}
            >
              Variables to fill ({detectedVars.length})
            </h2>
            {detectedVars.map((varName, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "#333",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#9A48D0",
                      color: "#fff",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontFamily: "'Courier New', monospace",
                      marginRight: "0.5rem",
                    }}
                  >
                    {`{{${varName}}}`}
                  </span>
                  {varName.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={variables[varName]}
                  onChange={(e) => updateVariable(varName, e.target.value)}
                  placeholder={`Enter ${varName.replace(/_/g, " ")}...`}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    fontSize: "1rem",
                    border: "2px solid #B288C0",
                    borderRadius: "8px",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Final prompt */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #7BC950",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#7BC950",
              marginBottom: "1rem",
              borderBottom: "2px solid #7BC950",
              paddingBottom: "0.5rem",
            }}
          >
            Final prompt
          </h2>
          <div
            style={{
              backgroundColor: "#F0F9EC",
              padding: "1.5rem",
              borderRadius: "12px",
              lineHeight: 1.8,
              minHeight: "120px",
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {finalPrompt}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #9A48D0, #B288C0)",
            color: "#fff",
            border: "none",
            padding: "1.25rem 2rem",
            fontSize: "1.2rem",
            fontWeight: 600,
            borderRadius: "12px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: "0 4px 12px rgba(154,72,208,0.3)",
          }}
        >
          📋 Copy prompt
        </button>
      </div>
    </div>
  );
}