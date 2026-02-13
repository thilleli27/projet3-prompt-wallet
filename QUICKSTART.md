# Prompt Wallet - Quick Start Guide & Architecture

## Project Summary

**Prompt Wallet** is an Electron + React desktop application that allows users to:
- Create and manage AI prompts with variables
- Search and filter prompts
- Use prompts with variable substitution
- Persist data locally in JSON files
- Use keyboard shortcuts for productivity
- Drag & drop files to create prompts

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Desktop Framework | Electron | 39.2.6 |
| UI Library | React | 19.2.1 |
| Router | React Router | 7.13.0 |
| Build Tool | Electron Vite | 5.0.0 |
| Storage | JSON Files | - |
| IPC Communication | Electron IPC | - |
| Style | CSS + Dark Mode | - |

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts the app with hot reload for both main and renderer processes.

### Build for Production
```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

## Project Structure

```
projet3-prompt-wallet/
├── src/
│   ├── main/
│   │   └── index.js              # Electron main process
│   ├── preload/
│   │   └── index.js              # Secure IPC bridge
│   └── renderer/
│       └── src/
│           ├── App.jsx           # Root component
│           ├── components/       # Reusable UI components
│           ├── pages/            # Route pages
│           ├── hooks/            # Custom hooks
│           └── data/             # Sample data
├── DOCUMENTATION.md              # Full documentation
└── QUICKSTART.md                 # This file
```

## Data Flow Architecture

### Creating a Prompt
```
User Form Input
    ↓
detectVariables() - Parse {{variable}} syntax
    ↓
handleSubmit()
    ↓
IPC: prompts:save → Main Process
    ↓
Write to prompts.json
    ↓
Navigate to Dashboard
```

### Loading Prompts
```
Dashboard Mount
    ↓
loadPrompts() - useEffect
    ↓
IPC: prompts:load → Main Process
    ↓
Read from prompts.json
    ↓
Return array (or empty array if file not found)
    ↓
setPrompts() → UI Update
```

### Using Prompts with Variables
```
View Prompt Page
    ↓
Detect {{variables}} from content
    ↓
Render input fields for each variable
    ↓
User fills form
    ↓
Replace {{variable}} with user input
    ↓
Show final prompt
    ↓
Copy to clipboard
```

## Component Hierarchy

```
App (Router setup)
└── AppContent
    ├── Navbar (Logo, Navigation, Theme)
    │   ├── Dropdown "Prompt" menu
    │   │   ├── Link "List"
    │   │   ├── Link "New"
    │   │   └── Link "Use"
    │   ├── Link "Terms"
    │   ├── Dropdown "Info" menu
    │   │   └── Link "About"
    │   └── Theme Toggle Button
    └── DropZone (Drag & drop wrapper)
        └── Routes
            ├── / → Dashboard
            │   ├── FilterBar
            │   └── PromptCard (rendered for each prompt)
            │       ├── Title (clickable)
            │       ├── Preview text
            │       ├── Metadata (date, tag)
            │       └── Buttons (Edit, Delete)
            │   └── DeleteModal
            ├── /new → NewPrompt
            │   ├── Title input
            │   ├── Category select
            │   ├── Content textarea
            │   ├── Tag fields
            │   ├── Description textarea
            │   └── Variable detection display
            ├── /edit/:id → EditPrompt
            ├── /use/:id → UsePrompt
            │   ├── Variable form inputs
            │   └── Final prompt display
            ├── /about → About
            └── /cgu → Terms
```

## Key Features & Implementation

### 1. Variable Substitution
**File**: `NewPrompt.jsx`, `UsePrompt.jsx`

Variables are any text matching the pattern `{{variable_name}}`:
- Automatically detected in content
- Highlighted in yellow box during creation
- Form inputs generated automatically on use page
- Replaced with user values when copying

### 2. Keyboard Shortcuts
**File**: `src/main/index.js`, `useKeyboardShortcuts.js`

| Shortcut | Action |
|----------|--------|
| Ctrl+L | Go to Dashboard |
| Ctrl+N | Create new prompt |
| Ctrl+/ | Show help |

Implementation:
- Main process registers shortcuts with `electron-localshortcut`
- Sends IPC message to renderer
- Renderer hook listens and navigates

### 3. Dark/Light Theme
**File**: `Navbar.jsx`, `index.css`

- Toggle button in navbar (moon/sun emoji)
- Applies `dark` class to `document.body`
- CSS handles style changes
- State is component-level (reset on reload)

### 4. Drag & Drop Files
**File**: `DropZone.jsx`

- Wraps entire app
- Accepts `.txt`, `.md`, `text/plain`
- Shows visual feedback
- Creates new prompt with:
  - Title from filename
  - Content from file text

### 5. Auto-save to File
**File**: `Dashboard.jsx`

```javascript
// Auto-save effect
useEffect(() => {
  if (!isLoading && prompts.length > 0) {
    window.api.prompts.save(prompts);
  }
}, [prompts, isLoading]);
```

- Auto-saves whenever prompts change
- Skips on initial load
- Error handling with fallback

## Data Storage Details

### File Location
- **Windows**: `%APPDATA%\prompt-wallet1\prompts.json`
- **macOS**: `~/Library/Application Support/prompt-wallet1/prompts.json`
- **Linux**: `~/.config/prompt-wallet1/prompts.json`

### Prompt Object Structure
```javascript
{
  id: 1674234234000,           // Timestamp of creation
  title: "API Documentation",
  category: "Documentation",
  content: "Create docs for {{api_name}}...",
  description: "Short description",
  tags: ["api", "docs"],
  date: "20 Jan 2024",
  preview: "Create docs for {{api_name}}...",
  tag: "Documentation"
}
```

### Sample prompts.json
```json
[
  {
    "id": 1674234234000,
    "title": "API Documentation",
    "category": "Documentation",
    "content": "Create comprehensive documentation for the {{api_name}} API...",
    "description": "Generate API docs",
    "tags": ["api", "documentation"],
    "date": "20 Jan 2024",
    "preview": "Create comprehensive documentation for the {{api_name}} API...",
    "tag": "Documentation"
  }
]
```

## IPC Communication Flow

### Channel: prompts:load
```
Renderer: window.api.prompts.load()
    ↓ (IPC invoke)
Main: ipcMain.handle('prompts:load')
    ↓
Read File: fs.readFile(prompts.json)
    ↓
Return: Array or [] if error
    ↓
Renderer: Receives data via Promise
```

### Channel: prompts:save
```
Renderer: window.api.prompts.save(prompts)
    ↓ (IPC invoke)
Main: ipcMain.handle('prompts:save')
    ↓
Write File: fs.writeFile(prompts.json, JSON.stringify())
    ↓
Return: { success: true/false, error?: message }
    ↓
Renderer: Receives response via Promise
```

### Channel: navigate-to
```
User: Presses Ctrl+L keyboard shortcut
    ↓
Main: localShortcut callback triggered
    ↓
Main: mainWindow.webContents.send('navigate-to', '/path')
    ↓
Renderer: ipcRenderer.on('navigate-to')
    ↓
Hook: useKeyboardShortcuts listens
    ↓
Navigation: navigate(path)
```

## Performance Optimizations

### React.memo
Prevents re-renders when props haven't changed:
- PromptCard
- FilterBar
- DeleteModal
- Navbar

### useCallback
Memoizes functions to maintain referential equality:
```javascript
const goToEdit = useCallback(() => 
  navigate(`/edit/${prompt.id}`), 
  [navigate, prompt.id]
)
```

### useMemo
Filters prompts only when dependencies change:
```javascript
const filteredPrompts = useMemo(
  () => prompts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
  [prompts, search]
)
```

## Common Tasks

### Adding a New Field to Prompts
1. Update `data/prompts.js` sample
2. Add form field to `NewPrompt.jsx`
3. Update `EditPrompt.jsx`
4. Display in `PromptCard.jsx` if needed

### Creating a New Page
1. Create component in `pages/` folder
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`
4. Optional: Add keyboard shortcut in `main/index.js`

### Debugging
- Ctrl+Shift+I opens DevTools (enabled in dev mode)
- Console shows IPC messages
- Check prompts.json file directly

## Keyboard Shortcuts Customization

Located in `src/main/index.js`:
```javascript
localShortcut.register(mainWindow, 'CommandOrControl+L', () => {
  mainWindow.webContents.send('navigate-to', '/')
})
```

- Change the key combination in first argument
- `CommandOrControl` = Ctrl on Windows/Linux, Cmd on macOS
- Change the path in `send()` call

## Environment Variables

Create `.env.local` (if needed):
```
VITE_APP_NAME=Prompt Wallet
```

Accessed in code via `import.meta.env.VITE_APP_NAME`

## Testing Quick Checklist

- [ ] Create prompt with variables
- [ ] Search/filter prompts
- [ ] Edit prompt
- [ ] Delete prompt (with confirmation)
- [ ] Use prompt (substitute variables)
- [ ] Copy to clipboard
- [ ] Toggle dark mode
- [ ] Try keyboard shortcuts
- [ ] Drag & drop file to create prompt
- [ ] Restart app - prompts should persist

## Common Issues & Solutions

### Prompts Not Saving
- Check AppData folder exists and is writable
- Look at console for IPC errors
- Verify `prompts.json` file permissions

### Dark Mode Not Applying
- Make sure CSS has dark mode styles
- Check that `dark` class is on body element
- Reload app if needed

### Keyboard Shortcuts Not Working
- Verify shortcuts in `main/index.js`
- Check DevTools console for errors
- Ensure `useKeyboardShortcuts` hook is called

### Variables Not Detected
- Variables must be in exact format: `{{variable_name}}`
- No spaces inside braces
- Check regex in `detectVariables()` function

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Electron Vite](https://electron-vite.org/)
- [electron-localshortcut](https://github.com/parro-it/electron-localshortcut)

## Development Tips

1. **Hot Reload**: Saves in src/ auto-reload the app in dev mode
2. **DevTools**: Press Ctrl+Shift+I to open inspector
3. **Main Process Logs**: Check terminal output
4. **Renderer Logs**: Check DevTools console
5. **File Changes**: Check `prompts.json` directly

## Next Steps

- Enhance search with fuzzy matching
- Add prompt categories and sorting
- Implement favorites
- Add import/export functionality
- Create backup/restore feature
- Add syntax highlighting
- Implement cloud sync
