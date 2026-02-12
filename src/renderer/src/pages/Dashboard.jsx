import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PromptCard from "../components/PromptCard";
import DeleteModal from "../components/DeleteModal";
import FilterBar from "../components/FilterBar";
import { prompts as initialPrompts } from "../data/prompts";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Charger depuis le fichier au lieu de localStorage
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Charger les prompts au démarrage
  useEffect(() => {
    async function loadPrompts() {
      try {
        const savedPrompts = await window.api.prompts.load();
        
        // Si aucun prompt sauvegardé, utiliser les prompts initiaux
        if (savedPrompts.length === 0) {
          setPrompts(initialPrompts);
          // Sauvegarder les prompts initiaux dans le fichier
          await window.api.prompts.save(initialPrompts);
        } else {
          setPrompts(savedPrompts);
        }
      } catch (error) {
        console.error('Error loading prompts:', error);
        // En cas d'erreur, utiliser les prompts initiaux
        setPrompts(initialPrompts);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrompts();
  }, []);

  // Sauvegarder dans le fichier au lieu de localStorage
  useEffect(() => {
    if (!isLoading && prompts.length > 0) {
      window.api.prompts.save(prompts);
    }
  }, [prompts, isLoading]);

  const filteredPrompts = useMemo(
    () => prompts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [prompts, search]
  );

  const deletePrompt = () => {
    if (deleteId === null) return;
    setPrompts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <p style={{ color: '#9A48D0', fontSize: '1.2rem' }}>Loading prompts...</p>
      </div>
    );
  }

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