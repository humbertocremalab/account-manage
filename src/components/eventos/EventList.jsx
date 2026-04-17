import React from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';

const EventList = ({ eventos, eventoActivo, onSelectEvent, onNewEvent, onDeleteEvent, readOnly = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    }).replace(/\//g, '/');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Eventos</h3>
        {!readOnly && onNewEvent && (
        <button
          onClick={onNewEvent}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Evento
        </button>
        )}
      </div>
    
      
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {eventos.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Sin eventos</p>
          </div>
        ) : (
          eventos.map(evento => (
            <div
              key={evento.id}
              className={`relative group ${
                eventoActivo?.id === evento.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              
              <button
                onClick={() => onSelectEvent(evento)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-800 text-sm">{evento.nombre}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(evento.fecha)}</p>
              </button>
               {!readOnly && onDeleteEvent && (
              <button
                onClick={() => onDeleteEvent(evento.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 transition-all"
                title="Eliminar evento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;