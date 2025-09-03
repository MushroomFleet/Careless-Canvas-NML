import React, { useCallback, useMemo } from 'react';
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
import { PageData, ConnectionData } from '../types';

const nodeTypes = {
  pageNode: PageNode,
};

const CanvasInner: React.FC = () => {
  const {
    pages,
    connections,
    addPage,
    addConnection,
    updatePage,
    setZoom,
    setCenter,
  } = useCanvasStore();

  const reactFlowInstance = useReactFlow();

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
      className: `connection-${conn.type}`,
      label: conn.label,
    }));
  }, [connections]);

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
      addConnection(connection.source, connection.target);
    }
  }, [addConnection]);

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
      className="w-full h-full" 
      onPaste={handlePaste}
      tabIndex={0} // Make div focusable for paste events
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onViewportChange={onViewportChange}
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

export const Canvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};

export default Canvas;
