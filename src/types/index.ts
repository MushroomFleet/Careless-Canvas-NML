// Core data types for Careless-Canvas-NML
export type PageColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';

export type ConnectionType = 'explores' | 'leads-to' | 'relates' | 'contradicts' | 'supports' | 'questions';

export interface PageData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: PageColor;
  title?: string;
  content: string;
  tags: string[];
  created: Date;
}

export interface ConnectionData {
  id: string;
  from: string;
  to: string;
  type: ConnectionType;
  label?: string;
}

export interface CanvasState {
  zoom: number;
  centerX: number;
  centerY: number;
  grid: boolean;
  theme: 'light' | 'dark';
}

export interface ProjectMeta {
  name: string;
  author: string;
  tags: string[];
}

export interface AppState {
  canvas: CanvasState;
  projectMeta: ProjectMeta;
  pages: Map<string, PageData>;
  connections: ConnectionData[];
  selectedPageId: string | null;
  editingPageId: string | null;
  nextPageId: number;
}

// NML File Format types
export interface NMLDocument {
  version: string;
  meta: {
    title: string;
    created: string;
    author?: string;
    tags?: string;
  };
  canvas: {
    zoom: number;
    centerX: number;
    centerY: number;
    grid?: boolean;
    theme?: string;
  };
  pages: NMLPage[];
  links: NMLLink[];
}

export interface NMLPage {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: PageColor;
  created: string;
  title?: string;
  content: string;
  tags?: string;
}

export interface NMLLink {
  from: string;
  to: string;
  type: ConnectionType;
  label?: string;
}
