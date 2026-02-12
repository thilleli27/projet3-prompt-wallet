import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import localShortcut from 'electron-localshortcut'
import { promises as fs } from 'fs' 

//  Chemin du fichier de stockage
const getPromptsPath = () => {
  const userDataPath = app.getPath('userData')
  return join(userDataPath, 'prompts.json')
}

//  Handlers IPC pour les prompts
ipcMain.handle('prompts:load', async () => {
  try {
    const filePath = getPromptsPath()
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Fichier n'existe pas encore, retourner un tableau vide
      return []
    }
    console.error('Error loading prompts:', error)
    throw error
  }
})

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

function createWindow() {
  // Create the browser window.
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

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Ouvre DevTools pour débugger
  mainWindow.webContents.openDevTools()

  // ========================================
  // 🎹 RACCOURCIS CLAVIER
  // ========================================
  // Raccourci 1 : Ctrl+L - Afficher la liste des prompts (Dashboard)
  localShortcut.register(mainWindow, 'CommandOrControl+L', () => {
    mainWindow.webContents.send('navigate-to', '/')
  })

  // Raccourci 2 : Ctrl+N - Créer un nouveau prompt
  localShortcut.register(mainWindow, 'CommandOrControl+N', () => {
    mainWindow.webContents.send('navigate-to', '/new')
  })

  // Raccourci optionnel : Ctrl+/ - Afficher l'aide des raccourcis
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.