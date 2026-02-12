import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Navigation depuis les raccourcis clavier
  onNavigate: (callback) => {
    ipcRenderer.on('navigate-to', (event, path) => callback(path))
  },
  // Afficher l'aide des raccourcis
  onShowShortcutsHelp: (callback) => {
    ipcRenderer.on('show-shortcuts-help', () => callback())
  },
  
  //  API pour gérer les prompts
  prompts: {
    load: () => ipcRenderer.invoke('prompts:load'),
    save: (prompts) => ipcRenderer.invoke('prompts:save', prompts),
    delete: (id) => ipcRenderer.invoke('prompts:delete', id)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}