# Careless-Canvas-NML v1.1.0 Update - Development Team Handoff

## Overview
This document outlines the complete implementation plan for v1.1.0 features. The backend architecture already supports most functionality - we primarily need to add UI components to expose existing capabilities to users.

## Version Update
**File**: `package.json`
- Update version from `"1.0.0-rc.1"` to `"1.1.0"`

## Feature 1: 🔗 Visual Connections with Typed Relationships

### Current State
- Backend already supports all connection types: `explores`, `leads-to`, `relates`, `contradicts`, `supports`, `questions`
- CSS styling exists for all connection types in `src/index.css`
- Connections currently default to `'relates'` type

### Implementation Required

#### 1.1 Add Connection Type Selection UI
**File**: `src/components/Canvas.tsx`

Add state for connection mode and type selection:

```typescript
// Add after existing imports
import { ConnectionType } from '../types';

// Add inside CanvasInner component, after existing state
const [connectionMode, setConnectionMode] = useState(false);
const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>('relates');

// Update the onConnect callback to use selected type
const onConnect = useCallback((connection: any) => {
  if (connection.source && connection.target) {
    addConnection(connection.source, connection.target, selectedConnectionType);
  }
}, [addConnection, selectedConnectionType]);
```

Add connection toolbar before the ReactFlow component:

```typescript
{/* Connection Toolbar - Add before ReactFlow */}
{connectionMode && (
  <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
    <div className="text-sm font-semibold text-gray-700 mb-2">Connection Type</div>
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
    <button
      onClick={() => setConnectionMode(false)}
      className="mt-2 w-full px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
    >
      Exit Connection Mode
    </button>
  </div>
)}
```

#### 1.2 Add Connection Mode Toggle to App Toolbar
**File**: `src/App.tsx`

Add connection mode state and pass to Canvas:

```typescript
// Add state in App component
const [connectionMode, setConnectionMode] = useState(false);

// Add button in toolbar after Load button
<button 
  onClick={() => setConnectionMode(!connectionMode)}
  className={`px-3 py-1 text-sm rounded ${
    connectionMode 
      ? 'bg-green-500 text-white hover:bg-green-600' 
      : 'bg-purple-500 text-white hover:bg-purple-600'
  }`}
  title="Toggle connection mode"
>
  {connectionMode ? 'Exit Connect' : 'Connect Pages'}
</button>

// Update Canvas component to receive connectionMode
<Canvas connectionMode={connectionMode} setConnectionMode={setConnectionMode} />
```

#### 1.3 Update Canvas Component Props
**File**: `src/components/Canvas.tsx`

```typescript
interface CanvasProps {
  connectionMode?: boolean;
  setConnectionMode?: (mode: boolean) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  connectionMode = false, 
  setConnectionMode 
}) => {
  return (
    <ReactFlowProvider>
      <CanvasInner 
        connectionMode={connectionMode} 
        setConnectionMode={setConnectionMode} 
      />
    </ReactFlowProvider>
  );
};

// Update CanvasInner interface
interface CanvasInnerProps {
  connectionMode: boolean;
  setConnectionMode?: (mode: boolean) => void;
}

const CanvasInner: React.FC<CanvasInnerProps> = ({ 
  connectionMode, 
  setConnectionMode 
}) => {
  // Use connectionMode prop instead of local state
```

#### 1.4 Enhanced Connection Display
**File**: `src/components/Canvas.tsx`

Update edges mapping to show connection labels:

```typescript
const edges: Edge[] = useMemo(() => {
  return connections.map((conn: ConnectionData) => ({
    id: conn.id,
    source: conn.from,
    target: conn.to,
    type: 'default',
    className: `connection-${conn.type}`,
    label: conn.type,
    labelStyle: { fontSize: '10px', fontWeight: 600 },
    labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
  }));
}, [connections]);
```

## Feature 2: 🎨 Color-Coded Organization with Manual Selection

### Current State
- Backend supports all colors: `red`, `blue`, `green`, `yellow`, `purple`, `gray`
- Smart color assignment based on content already works
- CSS styling for all colors exists

### Implementation Required

#### 2.1 Add Color Picker to Page Node
**File**: `src/components/PageNode.tsx`

Add color picker state and UI in edit mode:

```typescript
// Add after existing imports
import { PageColor } from '../types';

// Add inside PageNode component after existing state
const [showColorPicker, setShowColorPicker] = useState(false);

// Add color change handler
const handleColorChange = useCallback((color: PageColor) => {
  updatePage(pageData.id, { color });
  setShowColorPicker(false);
}, [pageData.id, updatePage]);

// Add color picker UI in edit mode controls section
{isEditing && (
  <div className="flex justify-between items-center mb-2">
    <div className="flex items-center space-x-2">
      <button
        onClick={togglePreview}
        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        {showPreview ? 'Edit' : 'Preview'}
      </button>
      
      {/* Color Picker Button */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`w-6 h-6 rounded border-2 ${getColorClass(pageData.color)}`}
          title="Change page color"
        />
        
        {/* Color Picker Dropdown */}
        {showColorPicker && (
          <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded shadow-lg p-2 z-20">
            <div className="grid grid-cols-3 gap-1">
              {(['red', 'blue', 'green', 'yellow', 'purple', 'gray'] as PageColor[]).map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-6 h-6 rounded border-2 page-${color} hover:scale-110 transition-transform`}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    
    <button
      onClick={handleSave}
      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
    >
      Save
    </button>
  </div>
)}
```

#### 2.2 Update CSS for Better Color Picker
**File**: `src/index.css`

Add styles for color picker:

```css
/* Color picker styles */
.color-picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 50;
}

.color-option {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 2px solid;
  cursor: pointer;
  transition: transform 0.15s;
}

.color-option:hover {
  transform: scale(1.1);
}

/* Update page color classes for better visibility */
.page-red { border-color: #ef4444; background-color: #fef2f2; }
.page-blue { border-color: #3b82f6; background-color: #eff6ff; }
.page-green { border-color: #10b981; background-color: #f0fdf4; }
.page-yellow { border-color: #f59e0b; background-color: #fffbeb; }
.page-purple { border-color: #8b5cf6; background-color: #faf5ff; }
.page-gray { border-color: #6b7280; background-color: #f9fafb; }
```

#### 2.3 Add Color Filter to Main Toolbar
**File**: `src/App.tsx`

Add color filter dropdown:

```typescript
// Add state for color filter
const [colorFilter, setColorFilter] = useState<PageColor | 'all'>('all');

// Add filter logic
const filteredPages = useMemo(() => {
  if (colorFilter === 'all') return pages;
  return new Map([...pages].filter(([_, page]) => page.color === colorFilter));
}, [pages, colorFilter]);

// Add color filter dropdown in toolbar
<div className="flex items-center space-x-2">
  {/* Color Filter */}
  <select
    value={colorFilter}
    onChange={(e) => setColorFilter(e.target.value as PageColor | 'all')}
    className="px-2 py-1 text-sm border border-gray-300 rounded"
  >
    <option value="all">All Colors</option>
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    <option value="green">Green</option>
    <option value="yellow">Yellow</option>
    <option value="purple">Purple</option>
    <option value="gray">Gray</option>
  </select>
  
  {/* Existing buttons */}
  <button onClick={handleSave}>Save ({pages.size} pages)</button>
  <button onClick={handleLoad}>Load</button>
  <button onClick={() => setShowSettings(true)}>Settings</button>
</div>
```

## Feature 3: ⚙️ Settings Modal with Themes

### Implementation Required

#### 3.1 Create Settings Modal Component
**File**: `src/components/SettingsModal.tsx`

```typescript
import React from 'react';
import { useCanvasStore } from '../stores/canvasStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { canvas, setTheme } = useCanvasStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Theme Settings */}
          <div>
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
                onChange={() => {/* toggleGrid() - add this method to store */}}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show Grid</span>
            </label>
          </div>

          {/* Version Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Careless-Canvas-NML v1.1.0
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### 3.2 Add Settings Modal to App
**File**: `src/App.tsx`

```typescript
// Add import
import { SettingsModal } from './components/SettingsModal';

// Add state
const [showSettings, setShowSettings] = useState(false);

// Add settings button to toolbar
<button 
  onClick={() => setShowSettings(true)}
  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
  title="Open settings"
>
  Settings
</button>

// Add modal before closing div
<SettingsModal 
  isOpen={showSettings} 
  onClose={() => setShowSettings(false)} 
/>
```

#### 3.3 Implement Dark Theme CSS
**File**: `src/index.css`

Add dark theme styles:

```css
/* Dark theme styles */
.theme-dark {
  background-color: #1f2937;
  color: #f9fafb;
}

.theme-dark .bg-white {
  background-color: #374151;
}

.theme-dark .bg-gray-50 {
  background-color: #1f2937;
}

.theme-dark .bg-gray-100 {
  background-color: #374151;
}

.theme-dark .text-gray-800 {
  color: #f9fafb;
}

.theme-dark .text-gray-500 {
  color: #9ca3af;
}

.theme-dark .text-gray-600 {
  color: #d1d5db;
}

.theme-dark .border-gray-200 {
  border-color: #4b5563;
}

/* Dark theme page colors */
.theme-dark .page-red {
  background-color: #220c0c;
  border-color: #dc2626;
}

.theme-dark .page-blue {
  background-color: #0c1a2b;
  border-color: #2563eb;
}

.theme-dark .page-green {
  background-color: #0c1f17;
  border-color: #059669;
}

.theme-dark .page-yellow {
  background-color: #2b1f0c;
  border-color: #d97706;
}

.theme-dark .page-purple {
  background-color: #1c0c2b;
  border-color: #7c3aed;
}

.theme-dark .page-gray {
  background-color: #1f2937;
  border-color: #4b5563;
}

.theme-dark .page-node {
  background-color: #374151;
  color: #f9fafb;
}
```

#### 3.4 Apply Theme Classes Dynamically
**File**: `src/App.tsx`

```typescript
// Add theme class to main container
const { canvas } = useCanvasStore();

return (
  <div className={`w-screen h-screen flex flex-col ${canvas.theme === 'dark' ? 'theme-dark bg-gray-900' : 'bg-gray-50'}`}>
    {/* Rest of component */}
  </div>
);
```

## Additional Enhancements

### 4.1 Update Canvas Store for Grid Toggle
**File**: `src/stores/canvasStore.ts`

Add toggleGrid method:

```typescript
// Add to CanvasStore interface
toggleGrid: () => void;

// Add to store implementation
toggleGrid: () => set((state) => ({
  canvas: { ...state.canvas, grid: !state.canvas.grid }
})),
```

### 4.2 Connection Context Menu (Optional Enhancement)
**File**: `src/components/Canvas.tsx`

Add right-click context menu for connections:

```typescript
// Add state for context menu
const [contextMenu, setContextMenu] = useState<{
  x: number;
  y: number;
  connectionId: string;
} | null>(null);

// Add edge click handler
const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
  event.preventDefault();
  setContextMenu({
    x: event.clientX,
    y: event.clientY,
    connectionId: edge.id,
  });
}, []);

// Add context menu component
{contextMenu && (
  <div
    className="fixed bg-white border border-gray-200 rounded shadow-lg py-1 z-50"
    style={{ left: contextMenu.x, top: contextMenu.y }}
  >
    <button
      onClick={() => {
        deleteConnection(contextMenu.connectionId);
        setContextMenu(null);
      }}
      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
    >
      Delete Connection
    </button>
  </div>
)}
```

## Testing Checklist

### Manual Testing Required:
1. **Connection Types**:
   - [ ] Connection mode toggle works
   - [ ] All 6 connection types can be selected
   - [ ] Connection labels display correctly
   - [ ] Connection colors match type

2. **Color Organization**:
   - [ ] Color picker appears in edit mode
   - [ ] All 6 colors can be selected
   - [ ] Color filter dropdown works
   - [ ] Smart color assignment still works

3. **Settings & Themes**:
   - [ ] Settings modal opens/closes
   - [ ] Theme switching works
   - [ ] Dark theme styles apply correctly
   - [ ] Grid toggle functionality

4. **Backwards Compatibility**:
   - [ ] Existing NML files load correctly
   - [ ] All v1.0 features still work
   - [ ] No regressions in core functionality

## File Summary

**Files to Modify:**
- `package.json` - Version update
- `src/App.tsx` - Add settings, connection mode, color filter
- `src/components/Canvas.tsx` - Connection UI, context menu
- `src/components/PageNode.tsx` - Color picker
- `src/stores/canvasStore.ts` - Add toggleGrid method
- `src/index.css` - Dark theme styles

**Files to Create:**
- `src/components/SettingsModal.tsx` - Settings interface

## Deployment Notes

1. Test thoroughly in both light and dark themes
2. Verify NML file compatibility with v1.0
3. Update documentation to reflect new features
4. Consider adding keyboard shortcuts for power users
5. Update status bar to show v1.1.0

## Future Considerations for v1.2.0

- Keyboard shortcuts for connection types
- Page templates/snippets
- Export to different formats (PDF, PNG)
- Collaborative features
- Plugin system architecture

---

**Development Team**: This plan provides complete implementation details. All backend support exists - focus on UI/UX implementation. Estimated development time: 2-3 days for full implementation and testing.
