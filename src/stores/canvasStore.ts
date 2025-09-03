import { create } from 'zustand';
import { PageData, ConnectionData, AppState, PageColor, ConnectionType } from '../types';
import { exportToNML, importFromNML, downloadNMLFile, uploadNMLFile } from '../utils/nmlFormat';

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Smart color assignment based on content
const getSmartColor = (content: string): PageColor => {
  const lower = content.toLowerCase();
  if (lower.includes('important') || lower.includes('urgent') || lower.includes('warning')) return 'red';
  if (lower.includes('question') || lower.includes('idea') || lower.includes('brainstorm')) return 'yellow';
  if (lower.includes('solution') || lower.includes('action') || lower.includes('todo')) return 'green';
  if (lower.includes('reference') || lower.includes('source') || lower.includes('citation')) return 'purple';
  if (lower.includes('information') || lower.includes('research') || lower.includes('data')) return 'blue';
  return 'gray';
};

interface CanvasStore extends AppState {
  // Canvas actions
  setZoom: (zoom: number) => void;
  setCenter: (x: number, y: number) => void;
  toggleGrid: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Page actions
  addPage: (x: number, y: number, content?: string) => string;
  updatePage: (id: string, updates: Partial<PageData>) => void;
  deletePage: (id: string) => void;
  selectPage: (id: string | null) => void;
  setEditingPage: (id: string | null) => void;

  // Connection actions
  addConnection: (from: string, to: string, type?: ConnectionType) => void;
  updateConnection: (id: string, updates: Partial<ConnectionData>) => void;
  deleteConnection: (id: string) => void;

  // File operations
  saveToNML: (title?: string) => void;
  loadFromNML: () => Promise<void>;
  
  // Utility actions
  reset: () => void;
  getPage: (id: string) => PageData | undefined;
  getConnections: (pageId: string) => ConnectionData[];
}

const initialState: AppState = {
  canvas: {
    zoom: 1,
    centerX: 0,
    centerY: 0,
    grid: true,
    theme: 'light'
  },
  pages: new Map(),
  connections: [],
  selectedPageId: null,
  editingPageId: null,
  nextPageId: 1
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  ...initialState,

  // Canvas actions
  setZoom: (zoom) => set((state) => ({
    canvas: { ...state.canvas, zoom }
  })),

  setCenter: (centerX, centerY) => set((state) => ({
    canvas: { ...state.canvas, centerX, centerY }
  })),

  toggleGrid: () => set((state) => ({
    canvas: { ...state.canvas, grid: !state.canvas.grid }
  })),

  setTheme: (theme) => set((state) => ({
    canvas: { ...state.canvas, theme }
  })),

  // Page actions
  addPage: (x, y, content = '') => {
    const state = get();
    const id = `page-${state.nextPageId}`;
    const color = content ? getSmartColor(content) : 'gray';
    
    const newPage: PageData = {
      id,
      x,
      y,
      width: 300,
      height: 200,
      color,
      content,
      tags: [],
      created: new Date()
    };

    const newPages = new Map(state.pages);
    newPages.set(id, newPage);

    set({
      pages: newPages,
      nextPageId: state.nextPageId + 1,
      selectedPageId: id,
      editingPageId: id
    });

    return id;
  },

  updatePage: (id, updates) => set((state) => {
    const page = state.pages.get(id);
    if (!page) return state;

    const newPages = new Map(state.pages);
    newPages.set(id, { ...page, ...updates });

    return { pages: newPages };
  }),

  deletePage: (id) => set((state) => {
    const newPages = new Map(state.pages);
    newPages.delete(id);

    const newConnections = state.connections.filter(
      conn => conn.from !== id && conn.to !== id
    );

    return {
      pages: newPages,
      connections: newConnections,
      selectedPageId: state.selectedPageId === id ? null : state.selectedPageId,
      editingPageId: state.editingPageId === id ? null : state.editingPageId
    };
  }),

  selectPage: (id) => set({ selectedPageId: id }),

  setEditingPage: (id) => set({ editingPageId: id }),

  // Connection actions
  addConnection: (from, to, type = 'relates') => {
    const id = generateId();
    const connection: ConnectionData = { id, from, to, type };

    set((state) => ({
      connections: [...state.connections, connection]
    }));
  },

  updateConnection: (id, updates) => set((state) => ({
    connections: state.connections.map(conn =>
      conn.id === id ? { ...conn, ...updates } : conn
    )
  })),

  deleteConnection: (id) => set((state) => ({
    connections: state.connections.filter(conn => conn.id !== id)
  })),

  // File operations
  saveToNML: (title = 'Canvas Document') => {
    const state = get();
    const nmlContent = exportToNML(state.pages, state.connections, title);
    downloadNMLFile(nmlContent, `${title.toLowerCase().replace(/\s+/g, '-')}.nml`);
  },

  loadFromNML: async () => {
    try {
      const xmlContent = await uploadNMLFile();
      const { pages, connections, title } = importFromNML(xmlContent);
      
      // Find the highest page ID to maintain numbering
      let maxPageId = 0;
      pages.forEach((page) => {
        const match = page.id.match(/page-(\d+)/);
        if (match) {
          maxPageId = Math.max(maxPageId, parseInt(match[1]));
        }
      });
      
      set({
        pages,
        connections,
        nextPageId: maxPageId + 1,
        selectedPageId: null,
        editingPageId: null
      });
      
      console.log(`Loaded "${title}" with ${pages.size} pages and ${connections.length} connections`);
    } catch (error) {
      console.error('Failed to load NML file:', error);
      alert(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Utility actions
  reset: () => set(initialState),

  getPage: (id) => {
    return get().pages.get(id);
  },

  getConnections: (pageId) => {
    const { connections } = get();
    return connections.filter(conn => conn.from === pageId || conn.to === pageId);
  }
}));
