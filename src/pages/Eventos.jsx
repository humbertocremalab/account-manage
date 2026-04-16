import React, { useState } from 'react';
import { Calendar, DollarSign, Plus, CheckSquare } from 'lucide-react';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    fecha: '',
    costo: '',
    tareas: []
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </button>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay eventos programados</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Crear primer evento
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Lista de eventos aquí */}
        </div>
      )}

      {/* Modal de formulario - Implementar después */}
    </div>
  );
};

export default Eventos;