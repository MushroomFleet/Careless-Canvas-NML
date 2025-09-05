# Dev Team v3.1.1 QoL Update - Implementation Guide

This document provides detailed technical specifications for implementing 6 core usability features in Careless-Canvas-NML v3.1.1. Each feature builds upon existing foundations and follows established code patterns.

## Overview of Features

1. **Project Metadata in Settings** - Project name, author, and document tags
2. **Page Title & Tags Editing** - Enhanced page metadata editing interface
3. **Connection Label Editing** - Click-to-edit labels on connections
4. **Connection Deletion UI** - Visual delete button for selected connections
5. **Theme Separation** - Remove theme from NML export (client-only preference)
6. **Enhanced Filename Generation** - Use project metadata for save filenames

---

## Feature 1: Project Metadata in Settings Modal

### Overview
Add project name, author, and document-level tags to the settings modal. This metadata will be used for filename generation and NML document properties.

### Files to Modify
- `src/stores/canvasStore.ts`
- `src/components/SettingsModal.tsx`

### Implementation Steps

#### Step 1: Extend Store State
**File:** `src/stores/canvasStore.ts`

Add to the initial state:
```typescript
const initialState: AppState = {
  canvas: {
    zoom: 1,
    centerX: 0,
    centerY: 0,
    grid: true,
    theme: 'light'
  },
  // ADD THIS:
  projectMeta: {
    name: '',
    author: '',
    tags: []
  },
  pages: new Map(),
  connections: [],
  selectedPageId: null,
  editingPageId: null,
  nextPageId: 1
};
```

Add to the store interface:
```typescript
interface CanvasStore extends AppState {
  // ADD THESE ACTIONS:
  setProjectName: (name: string) => void;
  setProjectAuthor: (author: string) => void;
  setProjectTags: (tags: string[]) => void;
  updateProjectMeta: (meta: Partial<ProjectMeta>) => void;
  
  // ... existing methods
}
```

Add the action implementations:
```typescript
// ADD THESE TO THE STORE:
setProjectName: (name) => set((state) => ({
  projectMeta: { ...state.projectMeta, name }
})),

setProjectAuthor: (author) => set((state) => ({
  projectMeta: { ...state.projectMeta, author }
})),

setProjectTags: (tags) => set((state) => ({
  projectMeta: { ...state.projectMeta, tags }
})),

updateProjectMeta: (meta) => set((state) => ({
  projectMeta: { ...state.projectMeta, ...meta }
})),
```

#### Step 2: Update Types
**File:** `src/types/index.ts`

Add the ProjectMeta interface:
```typescript
export interface ProjectMeta {
  name: string;
  author: string;
  tags: string[];
}

export interface AppState {
  canvas: CanvasState;
  projectMeta: ProjectMeta; // ADD THIS LINE
  pages: Map<string, PageData>;
  connections: ConnectionData[];
  selectedPageId: string | null;
  editingPageId: string | null;
  nextPageId: number;
}
```

#### Step 3: Enhanced Settings Modal
**File:** `src/components/SettingsModal.tsx`

Replace the entire component with:
```typescript
import React, { useState } from 'react';
import { useCanvasStore } from '../stores/canvasStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    canvas, 
    projectMeta, 
    setTheme, 
    toggleGrid, 
    updateProjectMeta 
  } = useCanvasStore();
  
  const [localProjectName, setLocalProjectName] = useState(projectMeta.name);
  const [localAuthor, setLocalAuthor] = useState(projectMeta.author);
  const [localTagsString, setLocalTagsString] = useState(projectMeta.tags.join(', '));

  const handleSave = () => {
    const tags = localTagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    updateProjectMeta({
      name: localProjectName,
      author: localAuthor,
      tags
    });
    
    onClose();
  };

  const handleCancel = () => {
    // Reset to current values
    setLocalProjectName(projectMeta.name);
    setLocalAuthor(projectMeta.author);
    setLocalTagsString(projectMeta.tags.join(', '));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-sm text-gray-400 hover:text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Project Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Project Information</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={localProjectName}
                  onChange={(e) => setLocalProjectName(e.target.value)}
                  placeholder="My Canvas Project"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Used for filename generation</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={localAuthor}
                  onChange={(e) => setLocalAuthor(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Tags
                </label>
                <input
                  type="text"
                  value={localTagsString}
                  onChange={(e) => setLocalTagsString(e.target.value)}
                  placeholder="research, brainstorm, project-alpha"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Canvas Settings Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Canvas Settings</h3>
            
            {/* Theme Settings */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={canvas.theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Light (Default)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={canvas.theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Dark</span>
                </label>
              </div>
            </div>

            {/* Grid Settings */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={canvas.grid}
                  onChange={toggleGrid}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show Grid</span>
              </label>
            </div>
          </div>

          {/* Version Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Careless-Canvas-NML v3.1.1
            </div>
          </div>
        </div>

        <div className="flex justify-between p-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Feature 2: Page Title & Tags Editing

### Overview
Add title and tags input fields to the page editing interface, enhancing the existing editing UI.

### Files to Modify
- `src/components/PageNode.tsx`

### Implementation Steps

#### Step 1: Enhanced Page Editing Interface
**File:** `src/components/PageNode.tsx`

Find the edit mode controls section and replace it with:
```typescript
{/* Edit mode controls */}
<div className="flex justify-between items-center mb-2">
  <div className="flex items-center space-x-2">
    <button
      onClick={togglePreview}
      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
    >
      {showPreview ? 'Edit' : 'Preview'}
    </button>
    
    {/* Enhanced Color Picker Button */}
    <div className="relative">
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
        title="Change page color"
      >
        <div className={`w-3 h-3 rounded-full border border-gray-400 ${getColorClass(pageData.color)}`} />
        <span>Color</span>
      </button>
      
      {/* Enhanced Color Picker Dropdown */}
      {showColorPicker && (
        <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 min-w-48">
          <div className="text-xs font-medium text-gray-700 mb-2">Choose Color</div>
          <div className="grid grid-cols-2 gap-2">
            {(['red', 'blue', 'green', 'yellow', 'purple', 'gray'] as PageColor[]).map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`flex items-center space-x-2 px-2 py-1 text-xs rounded border transition-all ${
                  pageData.color === color 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title={`Set color to ${color}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 page-${color}`} />
                <span className="capitalize">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>

    <button
      onClick={handleDelete}
      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
      title="Delete this page"
    >
      Remove
    </button>
  </div>
  
  <button
    onClick={handleSave}
    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
  >
    Save
  </button>
</div>

{/* ADD NEW METADATA EDITING SECTION */}
{!showPreview && (
  <div className="mb-3 space-y-2 border-b border-gray-200 pb-3">
    {/* Title Input */}
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Page Title (Optional)
      </label>
      <input
        type="text"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        placeholder="Enter page title..."
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
    
    {/* Tags Input */}
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Tags (Optional)
      </label>
      <input
        type="text"
        value={localTagsString}
        onChange={(e) => setLocalTagsString(e.target.value)}
        placeholder="tag1, tag2, tag3..."
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
    </div>
  </div>
)}
```

#### Step 2: Add State Management for Title and Tags
Add these state variables at the top of the PageNode component:
```typescript
const [localTitle, setLocalTitle] = useState(pageData.title || '');
const [localTagsString, setLocalTagsString] = useState(pageData.tags.join(', '));
```

Update the useEffect to sync with pageData:
```typescript
useEffect(() => {
  setLocalContent(pageData.content);
  setLocalTitle(pageData.title || '');
  setLocalTagsString(pageData.tags.join(', '));
}, [pageData.content, pageData.title, pageData.tags]);
```

Update the handleSave function:
```typescript
const handleSave = useCallback(() => {
  const tags = localTagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  
  updatePage(pageData.id, { 
    content: localContent,
    title: localTitle.trim() || undefined,
    tags
  });
  setEditingPage(null);
  setShowPreview(true);
}, [pageData.id, localContent, localTitle, localTagsString, updatePage, setEditingPage]);
```

---

## Feature 3: Connection Label Editing

### Overview
Add the ability to edit connection labels through the connection toolbar and click-to-edit functionality.

### Files to Modify
- `src/components/Canvas.tsx`

### Implementation Steps

#### Step 1: Add Label State to Connection Toolbar
**File:** `src/components/Canvas.tsx`

Add new state for connection label:
```typescript
const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>('relates');
const [connectionLabel, setConnectionLabel] = useState<string>(''); // ADD THIS
const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
```

Update the onConnect function to include labels:
```typescript
const onConnect = useCallback((connection: any) => {
  if (connection.source && connection.target) {
    const label = connectionLabel.trim() || undefined;
    addConnection(connection.source, connection.target, selectedConnectionType, label);
    setConnectionLabel(''); // Clear after creating connection
  }
}, [addConnection, selectedConnectionType, connectionLabel]);
```

#### Step 2: Enhanced Connection Toolbar
Replace the connection toolbar section with:
```typescript
{/* Connection Toolbar */}
{connectionMode && (
  <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3 connection-toolbar">
    <div className="text-sm font-semibold text-gray-700 mb-2">Create Connection</div>
    
    <div className="space-y-3">
      {/* Connection Type */}
      <div>
        <div className="text-xs font-medium text-gray-700 mb-1">Connection Type</div>
        <div className="grid grid-cols-2 gap-2">
          {(['explores', 'leads-to', 'relates', 'contradicts', 'supports', 'questions'] as ConnectionType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedConnectionType(type)}
              className={`px-2 py-1 text-xs rounded border ${
                selectedConnectionType === type 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Connection Label */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Label (Optional)
        </label>
        <input
          type="text"
          value={connectionLabel}
          onChange={(e) => setConnectionLabel(e.target.value)}
          placeholder="Enter connection label..."
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
    
    <button
      onClick={() => setConnectionMode && setConnectionMode(false)}
      className="mt-3 w-full px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
    >
      Exit Connection Mode
    </button>
  </div>
)}
```

#### Step 3: Update Store to Support Connection Labels
**File:** `src/stores/canvasStore.ts`

Update the addConnection method signature:
```typescript
addConnection: (from: string, to: string, type?: ConnectionType, label?: string) => void;
```

Update the implementation:
```typescript
addConnection: (from, to, type = 'relates', label) => {
  const id = generateId();
  const connection: ConnectionData = { 
    id, 
    from, 
    to, 
    type,
    label: label || undefined
  };

  set((state) => ({
    connections: [...state.connections, connection]
  }));
},
```

---

## Feature 4: Connection Deletion UI

### Overview
Show a delete button when a connection is selected, with enhanced visual feedback.

### Files to Modify
- `src/components/Canvas.tsx`
- `src/index.css`

### Implementation Steps

#### Step 1: Enhanced Connection Selection UI
**File:** `src/components/Canvas.tsx`

Add after the connection toolbar (but before the ReactFlow component):
```typescript
{/* Selected Connection Toolbar */}
{selectedEdgeId && !connectionMode && (
  <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
    <div className="text-sm font-semibold text-gray-700 mb-2">Connection Selected</div>
    <div className="space-y-2">
      <div className="text-xs text-gray-600">
        {(() => {
          const connection = connections.find(conn => conn.id === selectedEdgeId);
          return connection ? `Type: ${connection.type}` : '';
        })()}
      </div>
      {(() => {
        const connection = connections.find(conn => conn.id === selectedEdgeId);
        return connection?.label ? (
          <div className="text-xs text-gray-600">Label: {connection.label}</div>
        ) : null;
      })()}
      
      <div className="flex space-x-2">
        <button
          onClick={() => {
            if (selectedEdgeId) {
              deleteConnection(selectedEdgeId);
              setSelectedEdgeId(null);
            }
          }}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-300"
          title="Delete this connection"
        >
          Delete Connection
        </button>
        <button
          onClick={() => setSelectedEdgeId(null)}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          title="Deselect connection"
        >
          Deselect
        </button>
      </div>
    </div>
  </div>
)}
```

#### Step 2: Enhanced Edge Styling
**File:** `src/index.css`

Add these CSS rules for better connection selection feedback:
```css
/* Enhanced connection selection styles */
.react-flow__edge.selected-edge .react-flow__edge-path {
  stroke: #ef4444;
  stroke-width: 3px;
  animation: pulse-edge 1.5s infinite;
}

.react-flow__edge.selected-edge .react-flow__edge-textbg {
  fill: #fee2e2;
}

.react-flow__edge.selected-edge .react-flow__edge-text {
  fill: #dc2626;
  font-weight: 600;
}

@keyframes pulse-edge {
  0% {
    stroke-opacity: 1;
  }
  50% {
    stroke-opacity: 0.6;
  }
  100% {
    stroke-opacity: 1;
  }
}

/* Hover effects for connections */
.react-flow__edge:hover .react-flow__edge-path {
  stroke-width: 2px;
  stroke: #6366f1;
}
```

---

## Feature 5: Remove Theme from NML Export

### Overview
Exclude theme data from NML file exports, keeping it as a client-only preference.

### Files to Modify
- `src/utils/nmlFormat.ts`

### Implementation Steps

#### Step 1: Update Export Function
**File:** `src/utils/nmlFormat.ts`

In the `exportToNML` function, remove theme from canvas export:
```typescript
// Create NML document structure
const nmlDoc: NMLDocument = {
  version: '2.0',
  meta: {
    title,
    created: now,
    author: 'Careless-Canvas-NML User'
  },
  canvas: {
    zoom: 1.0,
    centerX: 0,
    centerY: 0,
    grid: true
    // REMOVE: theme property should not be included
  },
  pages: nmlPages,
  links: nmlLinks
};
```

Update the generateXML function to exclude theme:
```typescript
// Canvas section
xml += '  <canvas\n';
xml += `    zoom="${doc.canvas.zoom}"\n`;
xml += `    center-x="${doc.canvas.centerX}"\n`;
xml += `    center-y="${doc.canvas.centerY}"\n`;
if (doc.canvas.grid !== undefined) {
  xml += `    grid="${doc.canvas.grid}"\n`;
}
// REMOVE: theme export
xml += '  />\n\n';
```

#### Step 2: Update Import Function
Update `importFromNML` to ignore theme if present (for backwards compatibility):
```typescript
// Parse canvas settings - ignore theme if present
const canvasElement = doc.querySelector('canvas');
if (canvasElement) {
  // Parse canvas settings but ignore theme
  // Theme will remain as client preference
}
```

---

## Feature 6: Enhanced Filename Generation

### Overview
Use project metadata to generate meaningful filenames when saving.

### Files to Modify
- `src/stores/canvasStore.ts`
- `src/App.tsx`

### Implementation Steps

#### Step 1: Update Save Function
**File:** `src/stores/canvasStore.ts`

Update the `saveToNML` function:
```typescript
saveToNML: () => {
  const state = get();
  const { projectMeta, pages, connections } = state;
  
  // Generate filename from project metadata
  let filename = 'canvas-document';
  if (projectMeta.name.trim()) {
    filename = projectMeta.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Add timestamp
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '');
  filename += `-${timestamp}`;
  
  // Generate title for document
  const title = projectMeta.name || `Canvas Document (${pages.size} pages)`;
  
  // Use project metadata in export
  const nmlContent = exportToNML(state.pages, state.connections, {
    title,
    author: projectMeta.author,
    tags: projectMeta.tags.join(', ')
  });
  
  downloadNMLFile(nmlContent, `${filename}.nml`);
},
```

#### Step 2: Update Export Function to Accept Metadata
**File:** `src/utils/nmlFormat.ts`

Update the `exportToNML` function signature:
```typescript
export const exportToNML = (
  pages: Map<string, PageData>,
  connections: ConnectionData[],
  metadata: {
    title: string;
    author?: string;
    tags?: string;
  }
): string => {
  const now = new Date().toISOString();
  
  // ... existing code ...
  
  // Create NML document structure
  const nmlDoc: NMLDocument = {
    version: '2.0',
    meta: {
      title: metadata.title,
      created: now,
      author: metadata.author || 'Careless-Canvas-NML User',
      tags: metadata.tags
    },
    canvas: {
      zoom: 1.0,
      centerX: 0,
      centerY: 0,
      grid: true
    },
    pages: nmlPages,
    links: nmlLinks
  };

  return generateXML(nmlDoc);
};
```

#### Step 3: Update App Component
**File:** `src/App.tsx`

Remove the custom handleSave function and use the store's saveToNML directly:
```typescript
// REMOVE the handleSave function and update the button:
<button 
  onClick={saveToNML}
  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
  title="Save canvas as NML file"
>
  Save ({pages.size} pages)
</button>
```

---

## CSS Enhancements

### Additional Styling
**File:** `src/index.css`

Add these styles for the new UI elements:
```css
/* Enhanced settings modal styling */
.settings-section {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* Page metadata editing styles */
.page-metadata-section {
  background-color: #f9fafb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Connection toolbar enhancements */
.connection-toolbar {
  min-width: 280px;
  max-width: 320px;
}

.connection-toolbar input {
  transition: border-color 0.2s ease-in-out;
}

/* Selected connection toolbar */
.selected-connection-toolbar {
  min-width: 200px;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
}

/* Enhanced button hover effects */
.toolbar-button {
  transition: all 0.2s ease-in-out;
  transform: translateY(0);
}

.toolbar-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

---

## Testing Checklist

### Feature 1: Project Metadata
- [ ] Settings modal opens and displays project fields
- [ ] Project name, author, and tags save correctly
- [ ] Save button uses project name in filename
- [ ] Timestamp is correctly appended to filename
- [ ] Metadata appears in exported NML files

### Feature 2: Page Title & Tags
- [ ] Title and tags fields appear in edit mode
- [ ] Values save and persist correctly
- [ ] Title displays in page header when set
- [ ] Tags display in page footer when set
- [ ] Empty fields handle correctly (undefined vs empty string)

### Feature 3: Connection Labels
- [ ] Label input appears in connection toolbar
- [ ] Labels save with new connections
- [ ] Labels display on connections when present
- [ ] Label input clears after creating connection

### Feature 4: Connection Deletion UI
- [ ] Clicking connection selects it and shows toolbar
- [ ] Delete button removes connection correctly
- [ ] Deselect button clears selection
- [ ] Visual feedback shows selected connection clearly
- [ ] Multiple selections work correctly

### Feature 5: Theme Separation
- [ ] Theme preference persists in client
- [ ] Theme is not included in exported NML files
- [ ] Importing NML files ignores theme data
- [ ] Backwards compatibility maintained

### Feature 6: Enhanced Filenames
- [ ] Project name generates clean filename
- [ ] Special characters are handled correctly
- [ ] Timestamp appends correctly to filename
- [ ] Default filename used when no project name set
- [ ] Filename sanitization works properly
- [ ] NML metadata includes project information correctly

---

## Implementation Priority

### Phase 1 (Day 1)
1. Feature 1: Project Metadata in Settings
2. Feature 5: Theme Separation from NML
3. Feature 6: Enhanced Filename Generation

### Phase 2 (Day 2)
4. Feature 2: Page Title & Tags Editing
5. Feature 4: Connection Deletion UI

### Phase 3 (Day 3)
6. Feature 3: Connection Label Editing
7. CSS Enhancements and Polish
8. Comprehensive Testing

---

## Final Notes

### Breaking Changes
- None. All features are additive and maintain backwards compatibility.

### Migration Notes
- Existing NML files will continue to work
- Theme data in old files will be ignored during import
- New project metadata fields default to empty strings/arrays

### Performance Considerations
- New state fields are minimal and won't impact performance
- UI enhancements use existing patterns and shouldn't affect rendering speed
- File operations remain efficient with metadata additions

### Future Enhancements
After v3.1.1, consider implementing features from `unfinished-foundations.md`:
- Keyboard shortcut documentation
- Advanced canvas navigation
- Bulk operations for multiple selections
- Enhanced theme system completion

---

**Implementation Complete:** These 6 features will significantly enhance Careless-Canvas-NML's usability while showcasing the full potential of the NML standard format.
