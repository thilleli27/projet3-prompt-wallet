/**
 * Preload Script
 * Safely exposes Electron and IPC APIs to the renderer process
 * 
 * Uses contextBridge to maintain security boundaries
 * Renderer process can only access explicitly exposed APIs
 * 
 * Exposed Objects:
 * - window.electron: Electron API utilities
 * - window.api: Custom IPC handlers for prompts and navigation
 */

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * Custom APIs for renderer process
 * Provides secure access to main process functionality
 */
const api = {
  /**
   * Listen for navigation events from keyboard shortcuts
   * Called when user presses Ctrl+L or Ctrl+N
   * 
   * @param {Function} callback - Called with path to navigate to (e.g., '/', '/new')
   */
  onNavigate: (callback) => {
    ipcRenderer.on('navigate-to', (event, path) => callback(path))
  },

  /**
   * Listen for keyboard shortcuts help event
   * Called when user presses Ctrl+/
   * 
   * @param {Function} callback - Called to show shortcuts help
   */
  onShowShortcutsHelp: (callback) => {
    ipcRenderer.on('show-shortcuts-help', () => callback())
  },

  /**
   * Prompt Storage API
   * IPC handlers for loading, saving, and deleting prompts
   * Data is stored in userData directory as JSON
   */
  prompts: {
    /**
     * Load all prompts from file
     * @returns {Promise<Array>} Array of prompt objects
     */
    load: () => ipcRenderer.invoke('prompts:load'),

    /**
     * Save prompts to file
     * @param {Array} prompts - Array of prompt objects to save
     * @returns {Promise<Object>} { success: boolean, error?: string }
     */
    save: (prompts) => ipcRenderer.invoke('prompts:save', prompts),

    /**
     * Delete a prompt by ID
     * @param {number} id - Prompt ID to delete
     * @returns {Promise<Object>} { success: boolean, error?: string }
     */
    delete: (id) => ipcRenderer.invoke('prompts:delete', id)
  }
}

/**
 * Expose APIs to renderer process
 * Uses contextBridge for security if context isolation is enabled
 * Falls back to direct window assignment if not
 * 
 * Security Note:
 * - Only explicitly exposed APIs are accessible from renderer
 * - No direct access to Node.js or file system
 * - All IPC calls go through the preload script
 */
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