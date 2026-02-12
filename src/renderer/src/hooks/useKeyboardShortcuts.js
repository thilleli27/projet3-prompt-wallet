import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    // Écouter les événements de navigation depuis Electron
    if (window.api && window.api.onNavigate) {
      window.api.onNavigate((path) => {
        navigate(path)
      })
    }

    // Écouter l'aide des raccourcis
    if (window.api && window.api.onShowShortcutsHelp) {
      window.api.onShowShortcutsHelp(() => {
        // Vous pouvez afficher un modal ou une notification
        alert(`Raccourcis clavier :

📋 Ctrl+L : Liste des prompts
➕ Ctrl+N : Nouveau prompt
❓ Ctrl+/ : Aide`)
      })
    }
  }, [navigate])
}
