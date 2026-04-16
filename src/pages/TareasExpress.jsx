import React, { useState } from 'react';
import { Zap, Plus, Clock, CheckCircle } from 'lucide-react';

const TareasExpress = () => {
  const [tareas, setTareas] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tareas Express</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </button>
      </div>

      <div className="grid gap-3">
        {tareas.map((tarea, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            {/* Item de tarea */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TareasExpress;