import React from 'react';
import Canvas from './components/Canvas';
import { useCanvasStore } from './stores/canvasStore';
import './index.css';

function App() {
  const { saveToNML, loadFromNML, pages } = useCanvasStore();

  const handleSave = () => {
    const pageCount = pages.size;
    const title = pageCount > 0 ? `Canvas Document (${pageCount} pages)` : 'Empty Canvas';
    saveToNML(title);
  };

  const handleLoad = async () => {
    await loadFromNML();
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Simple toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">Careless-Canvas-NML</h1>
          <div className="text-sm text-gray-500">
            Press Ctrl+V to paste content and create a new page
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Save canvas as NML file"
          >
            Save ({pages.size} pages)
          </button>
          <button 
            onClick={handleLoad}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            title="Load NML file"
          >
            Load
          </button>
        </div>
      </div>
      
      {/* Canvas area */}
      <div className="flex-1 overflow-hidden">
        <Canvas />
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-1 text-xs text-gray-600">
        Ready | Careless-Canvas-NML v1.0 | Drag to connect pages | ESC to exit edit mode
      </div>
    </div>
  );
}

export default App;
