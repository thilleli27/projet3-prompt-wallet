import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PromptCard from "../components/PromptCard";
import DeleteModal from "../components/DeleteModal";
import FilterBar from "../components/FilterBar";
import { prompts as initialPrompts } from "../data/prompts";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Load prompts from localStorage or use initial prompts
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem('prompts');
    return saved ? JSON.parse(saved) : initialPrompts;
  });
  
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Save to localStorage when prompts change
  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  const filteredPrompts = useMemo(
    () => prompts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [prompts, search]
  );

  const deletePrompt = () => {
    if (deleteId === null) return;
    setPrompts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="btn-new" onClick={() => navigate("/new")}>
          + New Prompt
        </button>
      </div>

      <FilterBar value={search} onChange={setSearch} />

      <div className="prompts-grid">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <p className="empty-state">No prompt found</p>
      )}

      <DeleteModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={deletePrompt}
      />
    </div>
  );
}