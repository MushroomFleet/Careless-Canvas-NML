import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
} from '@xyflow/react';
import { useCanvasStore } from '../stores/canvasStore';
import { PageNode } from './PageNode';
import { PageData, ConnectionData, ConnectionType } from '../types';

const nodeTypes = {
  pageNode: PageNode,
};

interface CanvasProps {
  connectionMode?: boolean;
  setConnectionMode?: (mode: boolean) => void;
}

interface CanvasInnerProps {
  connectionMode: boolean;
  setConnectionMode?: (mode: boolean) => void;
}

const CanvasInner: React.FC<CanvasInnerProps> = ({ 
  connectionMode, 
  setConnectionMode 
}) => {
  const {
    pages,
    connections,
    addPage,
    addConnection,
    updatePage,
    setZoom,
    setCenter,
    deleteConnection,
    deletePage,
  } = useCanvasStore();

  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>('relates');
  const [connectionLabel, setConnectionLabel] = useState<string>('');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();

  // Add keyboard handler for delete functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        
        // Get selected nodes from ReactFlow
        const selectedNodes = reactFlowInstance.getNodes().filter(node => node.selected);
        const selectedNodeIds = selectedNodes.map(node => node.id);
        
        // Delete selected page nodes
        selectedNodeIds.forEach(nodeId => {
          deletePage(nodeId);
        });
        
        // Delete selected connection if any
        if (selectedEdgeId) {
          deleteConnection(selectedEdgeId);
          setSelectedEdgeId(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdgeId, deletePage, deleteConnection, reactFlowInstance]);

  // Add edge selection handler
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdgeId(edge.id);
  }, []);

  // Convert store data to React Flow format
  const nodes: Node[] = useMemo(() => {
    return Array.from(pages.values()).map((page: PageData) => ({
      id: page.id,
      type: 'pageNode',
      position: { x: page.x, y: page.y },
      data: page as any, // Type assertion for React Flow compatibility
      draggable: true,
    }));
  }, [pages]);

  const edges: Edge[] = useMemo(() => {
    return connections.map((conn: ConnectionData) => ({
      id: conn.id,
      source: conn.from,
      target: conn.to,
      type: 'default',
      className: `connection-${conn.type} ${selectedEdgeId === conn.id ? 'selected-edge' : ''}`,
      label: conn.type,
      labelStyle: { fontSize: '10px', fontWeight: 600 },
      labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
    }));
  }, [connections, selectedEdgeId]);

  // Handle paste to create new page
  const handlePaste = useCallback(async (event: React.ClipboardEvent) => {
    event.preventDefault();
    
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.trim()) {
        // Create page at center of current viewport
        const viewport = reactFlowInstance.getViewport();
        const centerX = -viewport.x / viewport.zoom + 400;
        const centerY = -viewport.y / viewport.zoom + 300;

        addPage(centerX, centerY, clipboardText);
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      // Fallback to clipboardData if clipboard API fails
      const clipboardText = event.clipboardData.getData('text');
      if (clipboardText.trim()) {
        const viewport = reactFlowInstance.getViewport();
        const centerX = -viewport.x / viewport.zoom + 400;
        const centerY = -viewport.y / viewport.zoom + 300;
        
        addPage(centerX, centerY, clipboardText);
      }
    }
  }, [addPage, reactFlowInstance]);

  // Handle connection creation
  const onConnect = useCallback((connection: any) => {
    if (connection.source && connection.target) {
      const label = connectionLabel.trim() || undefined;
      addConnection(connection.source, connection.target, selectedConnectionType, label);
      setConnectionLabel(''); // Clear after creating connection
    }
  }, [addConnection, selectedConnectionType, connectionLabel]);

  // Handle node drag stop - update store with final position
  const onNodeDragStop = useCallback((event: any, node: Node) => {
    updatePage(node.id, {
      x: node.position.x,
      y: node.position.y
    });
  }, [updatePage]);

  // Handle viewport changes
  const onViewportChange = useCallback((viewport: any) => {
    setZoom(viewport.zoom);
    setCenter(viewport.x, viewport.y);
  }, [setZoom, setCenter]);

  return (
    <div 
      className="w-full h-full relative" 
      onPaste={handlePaste}
      tabIndex={0} // Make div focusable for paste events
    >
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

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onViewportChange={onViewportChange}
        onEdgeClick={onEdgeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Background 
          color="#e2e8f0" 
          gap={20} 
          size={1}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
};

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

export default Canvas;
