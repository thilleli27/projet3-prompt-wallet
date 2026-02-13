/**
 * useKeyboardShortcuts Hook
 * Handles global keyboard shortcuts for navigation
 * 
 * Keyboard shortcuts:
 * - Ctrl+L: Navigate to prompts list (dashboard)
 * - Ctrl+N: Navigate to new prompt page
 * - Ctrl+/: Show help dialog with shortcut information
 * 
 * These shortcuts are defined in the Electron main process
 * and communicated via IPC (Inter-Process Communication)
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    // Listen for navigation events from Electron main process
    if (window.api && window.api.onNavigate) {
      window.api.onNavigate((path) => {
        navigate(path)
      })
    }

    // Listen for help/shortcuts event from Electron main process
    if (window.api && window.api.onShowShortcutsHelp) {
      window.api.onShowShortcutsHelp(() => {
        // Display help dialog with available shortcuts
        alert(`Available keyboard shortcuts:

📋 Ctrl+L : List prompts
➕ Ctrl+N : New prompt
❓ Ctrl+/ : Help`)
      })
    }
  }, [navigate])
}
