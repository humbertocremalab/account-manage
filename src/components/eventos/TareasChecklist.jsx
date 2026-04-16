import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';

const TareasChecklist = ({ tareas, onAddTarea, onToggleTarea, onDeleteTarea }) => {
  const [nuevaTarea, setNuevaTarea] = useState('');

  const handleAdd = () => {
    if (nuevaTarea.trim()) {
      onAddTarea(nuevaTarea);
      setNuevaTarea('');
    }
  };

  const tareasCompletadas = tareas.filter(t => t.completed).length;
  const totalTareas = tareas.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
          Checklist de tareas
        </h3>
        <span className="text-xs text-gray-500">
          {tareasCompletadas}/{totalTareas}
        </span>
      </div>

      <div className="space-y-2 mb-3 max-h-[300px] overflow-y-auto">
        {tareas.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Sin tareas</p>
        ) : (
          tareas.map((tarea, index) => (
            <div key={index} className="flex items-center justify-between group">
              <label className="flex items-center space-x-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={tarea.completed}
                  onChange={() => onToggleTarea(index)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${tarea.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {tarea.text}
                </span>
              </label>
              <button
                onClick={() => onDeleteTarea(index)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nueva tarea..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TareasChecklist;