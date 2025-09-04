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
