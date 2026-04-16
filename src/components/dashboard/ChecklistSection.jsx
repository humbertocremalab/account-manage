import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

const ChecklistSection = ({ title, items, onAddItem, onToggleItem, onDeleteItem }) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText);
      setNewItemText('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
          {title}
        </h3>
        <span className="text-xs text-gray-500">{items.length} items</span>
      </div>

      <div className="space-y-2 mb-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between group">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(index)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {item.text}
              </span>
            </label>
            <button
              onClick={() => onDeleteItem(index)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nuevo item..."
          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
        >
          <Plus className="w-3 h-3 mr-1" />
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ChecklistSection;