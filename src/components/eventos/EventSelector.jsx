import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const EventSelector = ({ eventos, eventoActivo, onSelectEvent, onNewEvent }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    }).replace(/\//g, '/');
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative flex-1">
        <select
          value={eventoActivo?.id || ''}
          onChange={(e) => {
            const selected = eventos.find(ev => ev.id === Number(e.target.value));
            onSelectEvent(selected);
          }}
          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>Selecciona evento</option>
          {eventos.map(evento => (
            <option key={evento.id} value={evento.id}>
              {evento.nombre} - {formatDate(evento.fecha)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      
      <button
        onClick={onNewEvent}
        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center whitespace-nowrap"
      >
        <Plus className="w-4 h-4 mr-1" />
        Nuevo Evento
      </button>
    </div>
  );
};

export default EventSelector;