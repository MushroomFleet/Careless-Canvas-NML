import React, { useState, useMemo } from 'react';
import Canvas from './components/Canvas';
import { SettingsModal } from './components/SettingsModal';
import { useCanvasStore } from './stores/canvasStore';
import { PageColor } from './types';
import './index.css';

function App() {
  const { saveToNML, loadFromNML, pages, canvas } = useCanvasStore();
  const [connectionMode, setConnectionMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [colorFilter, setColorFilter] = useState<PageColor | 'all'>('all');

  // Filter pages by color
  const filteredPages = useMemo(() => {
    if (colorFilter === 'all') return pages;
    return new Map(Array.from(pages).filter(([_, page]) => page.color === colorFilter));
  }, [pages, colorFilter]);

  const handleSave = () => {
    const pageCount = pages.size;
    const title = pageCount > 0 ? `Canvas Document (${pageCount} pages)` : 'Empty Canvas';
    saveToNML(title);
  };

  const handleLoad = async () => {
    await loadFromNML();
  };

  return (
    <div className={`w-screen h-screen flex flex-col ${canvas.theme === 'dark' ? 'theme-dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Simple toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">Careless-Canvas-NML</h1>
          <div className="text-sm text-gray-500">
            Press Ctrl+V to paste content and create a new page
          </div>
        </div>
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
          <button 
            onClick={() => setShowSettings(true)}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            title="Open settings"
          >
            Settings
          </button>
        </div>
      </div>
      
      {/* Canvas area */}
      <div className="flex-1 overflow-hidden">
        <Canvas connectionMode={connectionMode} setConnectionMode={setConnectionMode} />
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-1 text-xs text-gray-600">
        Ready | Careless-Canvas-NML v1.1.0 | Drag to connect pages | ESC to exit edit mode
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}

export default App;
