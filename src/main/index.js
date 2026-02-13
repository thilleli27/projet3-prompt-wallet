/**
 * Electron Main Process
 * Handles:
 * - Window creation and management
 * - IPC communication between main and renderer processes
 * - Keyboard shortcuts for navigation
 * - File-based data persistence for prompts
 */

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import localShortcut from 'electron-localshortcut'
import { promises as fs } from 'fs' 

/**
 * Get the file path for storing prompts
 * Stores in user's app data directory so it persists across sessions
 * Returns: {string} Full path to prompts.json
 */
const getPromptsPath = () => {
  const userDataPath = app.getPath('userData')
  return join(userDataPath, 'prompts.json')
}

/**
 * IPC Handler: Load prompts
 * Reads prompts from JSON file in userData directory
 * Returns empty array if file doesn't exist yet
 */
ipcMain.handle('prompts:load', async () => {
  try {
    const filePath = getPromptsPath()
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return []
    }
    console.error('Error loading prompts:', error)
    throw error
  }
})

/**
 * IPC Handler: Save prompts
 * Writes prompts array to JSON file with pretty formatting
 * Overwrites previous contents
 */
ipcMain.handle('prompts:save', async (event, prompts) => {
  try {
    const filePath = getPromptsPath()
    await fs.writeFile(filePath, JSON.stringify(prompts, null, 2), 'utf8')
    return { success: true }
  } catch (error) {
    console.error('Error saving prompts:', error)
    return { success: false, error: error.message }
  }
})

/**
 * IPC Handler: Delete prompt by ID
 * Removes a prompt from the file and saves the updated list
 */
ipcMain.handle('prompts:delete', async (event, id) => {
  try {
    const filePath = getPromptsPath()
    const data = await fs.readFile(filePath, 'utf8')
    const prompts = JSON.parse(data)
    const updated = prompts.filter(p => p.id !== id)
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf8')
    return { success: true }
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return { success: false, error: error.message }
  }
})

/**
 * Create the main application window
 * Configures window properties, keyboard shortcuts, and IPC listeners
 */
function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Show window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle external links in a new browser window
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools()

  // ========================================
  // 🎹 KEYBOARD SHORTCUTS
  // ========================================
  // Shortcut 1: Ctrl+L - Navigate to Dashboard (List prompts)
  localShortcut.register(mainWindow, 'CommandOrControl+L', () => {
    mainWindow.webContents.send('navigate-to', '/')
  })

  // Shortcut 2: Ctrl+N - Navigate to New Prompt page
  localShortcut.register(mainWindow, 'CommandOrControl+N', () => {
    mainWindow.webContents.send('navigate-to', '/new')
  })

  // Shortcut 3: Ctrl+/ - Show keyboard shortcuts help
  localShortcut.register(mainWindow, 'CommandOrControl+/', () => {
    mainWindow.webContents.send('show-shortcuts-help')
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

/**
 * App ready event
 * Called when Electron has finished initialization
 */
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Create the main window
  createWindow()

  // Re-create window when dock icon is clicked (macOS)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/**
 * Quit when all windows are closed
 * Exception: On macOS, stay active until Cmd+Q is pressed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})