import { memo, useCallback } from "react";

function FilterBar({ value, onChange }) {
  // Handler mémorisé (évite des re-renders inutiles)
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="filter-bar">
      <input
        className="filter-input"
        type="text"
        placeholder="🔍 Rechercher un prompt..."
        value={value}
        onChange={handleChange}
        aria-label="Rechercher un prompt"
        autoComplete="off"
      />
    </div>
  );
}

export default memo(FilterBar);
