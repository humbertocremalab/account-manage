import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Lock } from 'lucide-react';

const ChecklistSection = ({ title, items = [], onAddItem, onToggleItem, onDeleteItem, readOnly = false }) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAdd = () => {
    if (newItemText.trim() && onAddItem) {
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
          {readOnly && <Lock className="w-3 h-3 ml-2 text-gray-400" />}
        </h3>
        <span className="text-xs text-gray-500">{items.length} items</span>
      </div>

      <div className="space-y-2 mb-3 max-h-[300px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Sin items</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center justify-between group">
              <label className="flex items-center space-x-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleItem && onToggleItem(index)}
                  disabled={readOnly}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {item.text}
                </span>
              </label>
              {/* Botón eliminar - SOLO visible si NO es readOnly */}
              {!readOnly && onDeleteItem && (
                <button
                  onClick={() => onDeleteItem(index)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input para agregar - SOLO visible si NO es readOnly */}
      {!readOnly && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nuevo item..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChecklistSection;