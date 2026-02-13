/**
 * FilterBar Component
 * Search input for filtering prompts by title
 * 
 * Props:
 * - value: Current search text value
 * - onChange: Callback function triggered when input changes
 * 
 * Features:
 * - Real-time search filtering
 * - Memoized for performance
 * - Accessible with proper aria-label
 * - Debouncing handled by parent component
 */

import { memo, useCallback } from "react";

function FilterBar({ value, onChange }) {
  /**
   * Memoized change handler
   * Prevents unnecessary re-renders by maintaining referential equality
   */
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
        placeholder="🔍 Search prompts..."
        value={value}
        onChange={handleChange}
        aria-label="Search prompts"
        autoComplete="off"
      />
    </div>
  );
}

/**
 * Export memoized component
 * Only re-renders when value or onChange props actually change
 */
export default memo(FilterBar);
