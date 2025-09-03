import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import { useCanvasStore } from '../stores/canvasStore';
import { PageData, PageColor } from '../types';

export const PageNode: React.FC<NodeProps> = ({ data, selected }) => {
  const pageData = data as unknown as PageData;
  const { editingPageId, setEditingPage, updatePage } = useCanvasStore();
  const [localContent, setLocalContent] = useState(pageData.content);
  const [showPreview, setShowPreview] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const isEditing = editingPageId === pageData.id;

  useEffect(() => {
    setLocalContent(pageData.content);
  }, [pageData.content]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't handle click if it's on a resize handle
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    
    if (!isEditing && !isResizing) {
      setEditingPage(pageData.id);
      setShowPreview(false);
    }
  }, [isEditing, isResizing, pageData.id, setEditingPage]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  }, []);

  const handleSave = useCallback(() => {
    updatePage(pageData.id, { content: localContent });
    setEditingPage(null);
    setShowPreview(true);
  }, [pageData.id, localContent, updatePage, setEditingPage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSave();
    }
  }, [handleSave]);

  const togglePreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const getColorClass = (color: PageColor) => {
    return `page-${color}`;
  };

  // Resize functionality
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    console.log('Resize start:', direction); // Debug log
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = pageData.width;
    const startHeight = pageData.height;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = Math.max(200, startWidth + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(200, startWidth - deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(150, startHeight + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(150, startHeight - deltaY);
      }

      // Update the node size immediately for visual feedback
      if (nodeRef.current) {
        nodeRef.current.style.width = `${newWidth}px`;
        nodeRef.current.style.height = `${newHeight}px`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsResizing(false);
      
      // Get final dimensions and update store
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const finalWidth = Math.round(rect.width);
        const finalHeight = Math.round(rect.height);
        
        console.log('Resize end:', finalWidth, finalHeight); // Debug log
        
        updatePage(pageData.id, {
          width: finalWidth,
          height: finalHeight
        });
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [pageData.id, pageData.width, pageData.height, updatePage]);

  return (
    <div
      ref={nodeRef}
      className={`page-node ${getColorClass(pageData.color)} ${selected ? 'selected' : ''} ${isEditing ? 'editing' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{ width: pageData.width, height: pageData.height, position: 'relative' }}
      onClick={handleClick}
    >
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />

      {/* Page header */}
      {pageData.title && (
        <div className="px-3 py-2 border-b border-gray-200 bg-white bg-opacity-50">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {pageData.title}
          </h3>
        </div>
      )}

      {/* Page content */}
      <div className="p-3 flex-1 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex flex-col">
            {/* Edit mode controls */}
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={togglePreview}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Save
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden">
              {showPreview ? (
                <div className="markdown-content h-full overflow-auto">
                  <ReactMarkdown>{localContent}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  className="page-textarea"
                  value={localContent}
                  onChange={handleContentChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter markdown content..."
                  autoFocus
                />
              )}
            </div>
          </div>
        ) : (
          // View mode
          <div className="markdown-content h-full overflow-auto">
            <ReactMarkdown>{pageData.content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Page info footer */}
      <div className="px-3 py-1 border-t border-gray-200 bg-white bg-opacity-50">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{pageData.color}</span>
          <span>{new Date(pageData.created).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Resize handles - only show when selected or editing */}
      {(selected || isEditing) && (
        <>
          {/* Corner handles */}
          <div 
            className="resize-handle resize-handle-se nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
          <div 
            className="resize-handle resize-handle-sw nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div 
            className="resize-handle resize-handle-ne nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div 
            className="resize-handle resize-handle-nw nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          
          {/* Edge handles */}
          <div 
            className="resize-handle resize-handle-e nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
          <div 
            className="resize-handle resize-handle-s nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div 
            className="resize-handle resize-handle-w nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div 
            className="resize-handle resize-handle-n nodrag"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
        </>
      )}
    </div>
  );
};

export default PageNode;
