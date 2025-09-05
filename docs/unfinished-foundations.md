# Unfinished Foundations - Hidden Features & Improvement Opportunities

This document catalogs existing functionality in Careless-Canvas-NML that lacks proper UI exposure or could be enhanced. These represent opportunities for future development where the backend foundations already exist.

## High Priority - Missing Core UI Elements

### 1. Connection Management
**Current State:** Connections can be selected via click (`selectedEdgeId` state exists) and deleted via keyboard (Delete/Backspace), but no UI feedback or buttons exist.

**Missing Elements:**
- Visual feedback for selected connections (CSS class exists but underutilized)
- Delete button/toolbar for selected connections
- Connection label editing interface
- Connection type modification after creation

**Code References:**
- `Canvas.tsx`: `selectedEdgeId`, `onEdgeClick`, `deleteConnection`
- CSS: `.selected-edge` class exists but needs enhancement

### 2. Page Metadata Editing
**Current State:** PageData interface supports `title` and `tags` fields, displayed in UI, but no editing interface exists.

**Missing Elements:**
- Title input field in page editing mode
- Tag management interface (add/remove tags)
- Tag display and filtering enhancements

**Code References:**
- `types/index.ts`: `PageData.title`, `PageData.tags`
- `PageNode.tsx`: Title display in header, tags in footer
- `canvasStore.ts`: `updatePage` supports title/tags updates

### 3. Document Metadata Management
**Current State:** NML format supports rich document metadata (author, tags, project name) but no editing interface exists.

**Missing Elements:**
- Project name/title input in settings
- Author field in settings
- Document-level tags management
- Custom filename generation using project metadata

**Code References:**
- `types/index.ts`: `NMLDocument.meta` structure
- `nmlFormat.ts`: Full metadata export/import support
- `canvasStore.ts`: `saveToNML` uses hardcoded titles

## Medium Priority - Enhanced User Experience

### 4. Smart Features Not Exposed
**Current State:** Advanced features work but users aren't aware of them.

**Hidden Features:**
- Smart color assignment based on content keywords
  - "urgent/important/warning" → red
  - "question/idea/brainstorm" → yellow  
  - "solution/action/todo" → green
  - "reference/source/citation" → purple
  - "information/research/data" → blue
- Paste functionality (Ctrl+V) to create pages
- Rich resize handles (8 directional handles) only visible when selected
- Connection type variety (6 types) only visible in connection mode

**Code References:**
- `canvasStore.ts`: `getSmartColor` function
- `Canvas.tsx`: `handlePaste` function
- `PageNode.tsx`: Comprehensive resize handle system

### 5. Keyboard Shortcuts & Interactions
**Current State:** Multiple keyboard shortcuts work but aren't documented or discoverable.

**Hidden Shortcuts:**
- Delete/Backspace: Delete selected pages and connections
- Escape: Exit page editing mode
- Ctrl+V: Create page from clipboard content

**Missing Elements:**
- Keyboard shortcut help/reference
- Visual indicators for interactive elements
- Tooltip guidance for complex interactions

### 6. Canvas State & Statistics
**Current State:** Rich canvas state tracking exists but no display interface.

**Available Data:**
- Page count and statistics
- Connection count and types
- Canvas zoom and position state
- Page relationships and connections per page

**Code References:**
- `canvasStore.ts`: `getConnections`, `getPage` utility functions
- `App.tsx`: Page count display in save button only

## Low Priority - Advanced Features

### 7. Theme System Enhancement
**Current State:** Light/dark theme toggle exists but incomplete implementation.

**Issues:**
- Theme not fully applied across all components
- Dark theme styles incomplete
- Theme saved to NML files (should be client-only preference)

**Code References:**
- `SettingsModal.tsx`: Theme selection interface
- `App.tsx`: Theme class application
- `nmlFormat.ts`: Theme included in export (should be removed)

### 8. File Format Capabilities
**Current State:** NML 2.0 format supports rich features not utilized in UI.

**Underutilized Features:**
- Document versioning and timestamps
- Canvas viewport state persistence
- Rich connection labeling
- Extended page properties

### 9. Canvas Navigation & Organization
**Current State:** Basic canvas functionality exists but could be enhanced.

**Missing Features:**
- Page search/filtering beyond color
- Canvas minimap or overview
- Page organization tools (alignment, distribution)
- Bulk operations on multiple selections

**Code References:**
- `App.tsx`: Basic color filtering exists
- `Canvas.tsx`: Multi-selection support partially implemented

## Technical Debt & Code Quality

### 10. State Management Patterns
**Current State:** Mixed patterns for handling UI state and data updates.

**Issues:**
- Some UI state mixed with data state
- Inconsistent update patterns
- Missing optimizations for large canvases

### 11. Component Architecture
**Current State:** Components handle multiple responsibilities.

**Opportunities:**
- Extract specialized editing components
- Separate display and editing modes more clearly
- Improve component reusability

## Development Notes

### Quick Wins (< 2 hours each)
1. Add delete button for selected connections
2. Expose keyboard shortcut documentation
3. Enhance selected connection visual feedback
4. Add project name field to settings

### Medium Effort (4-8 hours each)
1. Page title and tags editing interface
2. Connection label editing
3. Smart color assignment user education
4. Complete theme system implementation

### Larger Features (1-2 days each)
1. Comprehensive document metadata management
2. Advanced canvas navigation tools
3. Bulk operations and multi-selection enhancements
4. Canvas state persistence and restoration

---

*This document serves as a roadmap for enhancing Careless-Canvas-NML by building upon existing foundations rather than creating new systems from scratch.*
