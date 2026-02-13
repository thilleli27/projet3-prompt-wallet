# Prompt Wallet - Project Documentation

## Overview

**Prompt Wallet** is an Electron + React desktop application for managing, storing, and using AI prompts. It provides a user-friendly interface to create, edit, search, and organize prompts with support for variable substitution.

## Architecture

### Tech Stack
- **Desktop Framework**: Electron 39.2.6
- **UI Framework**: React 19.2.1
- **Routing**: React Router v7.13.0
- **Build Tool**: Electron Vite 5.0.0
- **Styling**: CSS (custom styling with dark/light theme support)
- **Data Storage**: JSON files in user's app data directory
- **Process Communication**: Electron IPC (Inter-Process Communication)

### Project Structure

```
src/
├── main/                      # Electron main process
│   └── index.js              # Window creation, IPC handlers, keyboard shortcuts
├── preload/
│   └── index.js              # Preload scripts for secure IPC
└── renderer/                 # React frontend
    └── src/
        ├── App.jsx           # Main app component and routing
        ├── index.css         # Global styles
        ├── main.jsx          # React entry point
        ├── components/       # Reusable UI components
        │   ├── Navbar.jsx    # Navigation bar with theme toggle
        │   ├── PromptCard.jsx # Individual prompt display
        │   ├── FilterBar.jsx  # Search input
        │   ├── DeleteModal.jsx # Delete confirmation dialog
        │   └── DropZone.jsx  # Drag & drop file handling
        ├── hooks/            # Custom React hooks
        │   └── useKeyboardShortcuts.js # Keyboard shortcut handling
        ├── pages/            # Page components (routes)
        │   ├── Dashboard.jsx  # Main prompt list view
        │   ├── NewPrompt.jsx  # Create new prompt page
        │   ├── EditPrompt.jsx # Edit existing prompt page
        │   ├── UsePrompt.jsx  # View and use prompt with variables
        │   ├── About.jsx      # About page
        │   └── Cgu.jsx        # Terms and conditions
        └── data/
            └── prompts.js     # Sample/initial prompts data
```

## Core Features

### 1. Dashboard (Home Page)
- **Display**: Grid view of all stored prompts
- **Search**: Real-time filtering by prompt title
- **Actions**: 
  - Create new prompt
  - Edit existing prompt
  - Delete prompt (with confirmation)
  - View/use prompt
- **State Management**: Automatically loads and saves prompts to file

**Key File**: [src/renderer/src/pages/Dashboard.jsx](src/renderer/src/pages/Dashboard.jsx)

### 2. Create Prompt
- **Form Fields**:
  - Title (required, max 100 characters)
  - Category (dropdown selection)
  - Content (required, supports variable syntax)
  - Description (optional)
  - Tags (multiple, dynamic)
- **Variable Detection**: Automatically detects `{{variable}}` patterns
- **Auto-save**: Saves prompts to file after creation
- **Drag & Drop Support**: Can create prompt from dropped text files

**Key File**: [src/renderer/src/pages/NewPrompt.jsx](src/renderer/src/pages/NewPrompt.jsx)

### 3. Edit Prompt
- Load existing prompt data
- Modify any field
- Update variables
- Save changes to file

**Key File**: [src/renderer/src/pages/EditPrompt.jsx](src/renderer/src/pages/EditPrompt.jsx)

### 4. Use Prompt
- View full prompt text
- **Variable Substitution**: Fill in detected variables
- **Copy to Clipboard**: Copy final prompt with substituted variables
- Real-time preview of final prompt

**Key File**: [src/renderer/src/pages/UsePrompt.jsx](src/renderer/src/pages/UsePrompt.jsx)

### 5. Theme Toggle
- **Location**: Navigation bar
- **Options**: Light mode (moon icon 🌙) / Dark mode (sun icon ☀️)
- **Persistence**: Theme state managed in component
- **Implementation**: Toggles `dark` class on document body

**Related Component**: [src/renderer/src/components/Navbar.jsx](src/renderer/src/components/Navbar.jsx#L28)

### 6. Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Navigate to Dashboard (list view) |
| `Ctrl+N` | Navigate to New Prompt page |
| `Ctrl+/` | Show keyboard shortcuts help |

**Registered in**: [src/main/index.js](src/main/index.js#L110-L125)  
**Handled in**: [src/renderer/src/hooks/useKeyboardShortcuts.js](src/renderer/src/hooks/useKeyboardShortcuts.js)

### 7. Drag & Drop Files
- **Supported Types**: `.txt`, `.md`, `text/plain`
- **Behavior**: Drops file → Creates new prompt with:
  - Title: filename (without extension)
  - Content: file contents
- **Visual Feedback**: Shows dashed blue border and overlay when dragging

**Component**: [src/renderer/src/components/DropZone.jsx](src/renderer/src/components/DropZone.jsx)

## Data Management

### Storage Format
- **Type**: JSON file
- **Location**: User's app data directory (`userData`)
- **Filename**: `prompts.json`
- **Path Format**: `${app.getPath('userData')}/prompts.json`

### Prompt Object Structure
```javascript
{
  id: number,              // Unix timestamp when created
  title: string,           // Prompt title
  category: string,        // Category/tag
  content: string,         // Main prompt text (supports {{variable}} syntax)
  description: string,     // Short description/preview
  tags: string[],          // Array of tags
  date: string,            // Creation date (formatted)
  preview: string,         // Text preview (first 80 characters of content)
  tag: string              // Category label
}
```

### IPC Handlers
Located in [src/main/index.js](src/main/index.js#L35-L71):

1. **`prompts:load`**
   - Reads `prompts.json` from userData
   - Returns empty array if file doesn't exist
   - Error handling with console logging

2. **`prompts:save`**
   - Writes prompts array to file
   - Pretty-printed JSON (2-space indentation)
   - Returns success/error object

3. **`prompts:delete`**
   - Removes prompt by ID
   - Updates and resaves file
   - Returns success/error object

## Component Documentation

### Navbar
- **Theme Toggle**: Dark/light mode switching
- **Navigation Menu**: Dropdown menus for Prompt and Info sections
- **Memoized**: Prevents unnecessary re-renders

### PromptCard
- **Props**: `prompt` (object), `onDelete` (function)
- **Features**: 
  - Clickable title (navigates to use page)
  - Metadata display (date, category)
  - Action buttons (edit, delete)
  - Keyboard accessible
- **Memoized**: Performance optimization

### FilterBar
- **Props**: `value` (search string), `onChange` (callback)
- **Purpose**: Real-time search input
- **Optimized**: Memoized with useCallback

### DeleteModal
- **Props**: `open` (boolean), `onClose`, `onConfirm` (callbacks)
- **Features**:
  - ESC key closes modal
  - Body scroll prevention
  - Accessible (ARIA labels)
  - Auto-focused confirm button

### DropZone
- **Wraps**: Entire application
- **Features**:
  - Drag-over visual feedback
  - File type validation
  - Pre-fills new prompt form
  - Full-screen overlay feedback

## Hooks

### useKeyboardShortcuts
- **Purpose**: Listen for keyboard shortcuts from Electron main process
- **Used By**: AppContent component
- **Actions**: Navigates to paths or shows help dialog
- **IPC Events**: `navigate-to`, `show-shortcuts-help`

## Styling Approach

### Theme Implementation
- **CSS Variables**: Custom properties for colors
- **Dark Class**: Applied to document body when dark mode enabled
- **Global Styles**: [src/renderer/src/index.css](src/renderer/src/index.css)
- **Component Styles**: Inline styles for form elements and layouts

### Color Scheme
- **Primary Purple**: `#9A48D0`
- **Light Purple**: `#B288C0`
- **Success Green**: `#7BC950`
- **Blue Accent**: `#3b82f6`
- **Dark Backgrounds**: Enabled via CSS dark mode

## State Management Pattern

### Local Component State
- Each page manages its own form state
- Dashboard manages prompts list and filter state
- Theme state in Navbar component

### Data Persistence
- **Auto-save**: Prompts automatically saved after changes
- **Load on Mount**: Dashboard loads prompts on component mount
- **Error Fallback**: Uses initial sample prompts if file operations fail

## Keyboard Accessibility
- **ARIA Labels**: All buttons have descriptive labels
- **Role Attributes**: Proper semantic HTML roles
- **Tab Navigation**: Components support keyboard focus
- **Enter Key**: Title and interactive elements respond to Enter key

## Performance Optimizations

1. **React.memo**: Used on components to prevent unnecessary re-renders
   - PromptCard
   - FilterBar
   - DeleteModal
   - Navbar

2. **useCallback**: Memoized callbacks in event handlers
   - Prevents function recreation on every render

3. **useMemo**: Filtered prompts list
   - Only recalculates when search or prompts change

4. **Lazy Loading**: Prompts loaded from file on mount

## Error Handling

### File Operations
- Try-catch blocks around file read/write operations
- Graceful fallback to sample prompts on error
- Console error logging for debugging

### User Feedback
- Loading states during async operations
- Confirmation modals before destructive actions
- Alert dialogs for validation messages

## Development Workflow

### Scripts
```bash
npm run dev        # Start development mode with HMR
npm run build      # Build for production
npm run start      # Run built application
npm run format     # Format code with Prettier
npm run lint       # Check code with ESLint
```

### Building
```bash
npm run build:win   # Build for Windows
npm run build:mac   # Build for macOS
npm run build:linux # Build for Linux
```

## Adding New Features

### To Add a New Prompt Field
1. Update Prompt object structure in data/prompts.js
2. Add form field in NewPrompt.jsx and EditPrompt.jsx
3. Update PromptCard.jsx to display new field
4. Update UsePrompt.jsx if needed for variable substitution

### To Add a New Page
1. Create new component in `pages/` folder
2. Add Route in App.jsx
3. Add navigation link in Navbar.jsx if needed
4. Add keyboard shortcut in main/index.js (optional)

### To Add a Keyboard Shortcut
1. Register shortcut in `src/main/index.js`
2. Send IPC message to renderer
3. Handle in `useKeyboardShortcuts` hook
4. Update help dialog with new shortcut

## Troubleshooting

### Prompts Not Saving
- Check UserData directory permissions
- Verify IPC handlers in main process
- Check browser console for errors

### Dark Mode Not Working
- Verify CSS `dark` class is being applied
- Check index.css for dark mode styles
- Ensure theme state updates properly

### Keyboard Shortcuts Not Working
- Verify shortcuts are registered in main.js
- Check that renderer process receives IPC messages
- Ensure useKeyboardShortcuts hook is called in AppContent

## Future Improvements

- [ ] Cloud sync for prompts
- [ ] Prompt categories with sorting
- [ ] Favorites/starred prompts
- [ ] Prompt versioning/history
- [ ] Export/import prompts
- [ ] Search by tags
- [ ] Keyboard shortcut customization
- [ ] Prompt templates
- [ ] AI integration
- [ ] Syntax highlighting for prompt content
