import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import EventList from '../components/eventos/EventList';
import TareasChecklist from '../components/eventos/TareasChecklist';
import GastosList from '../components/eventos/GastosList';
import NewEventPopup from '../components/eventos/NewEventPopup';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoActivo, setEventoActivo] = useState(null);
  const [showNewEventPopup, setShowNewEventPopup] = useState(false);

  const handleAddEvento = (nuevoEvento) => {
    setEventos(prev => [...prev, nuevoEvento]);
    setEventoActivo(nuevoEvento);
  };

  const handleSelectEvento = (evento) => {
    setEventoActivo(evento);
  };

  const handleAddTarea = (texto) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, tareas: [...ev.tareas, { text: texto, completed: false }] }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
  };

  const handleToggleTarea = (index) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { 
            ...ev, 
            tareas: ev.tareas.map((t, i) => 
              i === index ? { ...t, completed: !t.completed } : t
            )
          }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
  };

  const handleDeleteTarea = (index) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, tareas: ev.tareas.filter((_, i) => i !== index) }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
  };

  const handleAddGasto = (gasto) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, gastos: [...ev.gastos, gasto] }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
  };

  const handleDeleteGasto = (index) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, gastos: ev.gastos.filter((_, i) => i !== index) }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Eventos</h2>
        <p className="text-gray-600 text-sm">
          Gestiona tareas y gastos de tus eventos
        </p>
      </div>

      {eventos.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Crea tu primer evento para empezar
          </h3>
          <p className="text-gray-500 mb-6">
            Organiza tus eventos, tareas y gastos en un solo lugar
          </p>
          <button
            onClick={() => setShowNewEventPopup(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Evento
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Lista de eventos */}
          <div className="lg:col-span-1">
            <EventList
              eventos={eventos}
              eventoActivo={eventoActivo}
              onSelectEvent={handleSelectEvento}
              onNewEvent={() => setShowNewEventPopup(true)}
            />
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-4">
            {eventoActivo ? (
              <>
                {/* Header del evento activo */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {eventoActivo.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(eventoActivo.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewEventPopup(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Nuevo Evento
                    </button>
                  </div>
                </div>

                {/* Tareas */}
                <TareasChecklist
                  tareas={eventoActivo.tareas || []}
                  onAddTarea={handleAddTarea}
                  onToggleTarea={handleToggleTarea}
                  onDeleteTarea={handleDeleteTarea}
                />

                {/* Gastos */}
                <GastosList
                  gastos={eventoActivo.gastos || []}
                  onAddGasto={handleAddGasto}
                  onDeleteGasto={handleDeleteGasto}
                />
              </>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-500">Selecciona un evento para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Nuevo Evento */}
      <NewEventPopup
        isOpen={showNewEventPopup}
        onClose={() => setShowNewEventPopup(false)}
        onAdd={handleAddEvento}
      />
    </div>
  );
};

export default Eventos;