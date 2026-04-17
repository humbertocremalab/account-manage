import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveEventos, loadEventos } from '../services/database';
import EventList from '../components/eventos/EventList';
import TareasChecklist from '../components/eventos/TareasChecklist';
import GastosList from '../components/eventos/GastosList';
import NewEventPopup from '../components/eventos/NewEventPopup';
import EditEventPopup from '../components/eventos/EditEventPopup';

const Eventos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [eventoActivo, setEventoActivo] = useState(null);
  const [showNewEventPopup, setShowNewEventPopup] = useState(false);
  const [showEditEventPopup, setShowEditEventPopup] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const savedEventos = await loadEventos();
        if (savedEventos && savedEventos.length > 0) {
          setEventos(savedEventos);
          setEventoActivo(savedEventos[0]);
        }
      } catch (error) {
        console.error('Error loading eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const saveEventosToDB = async (updatedEventos) => {
    if (user) {
      await saveEventos(updatedEventos);
    }
  };

  const handleAddEvento = async (nuevoEvento) => {
    const eventoConDatos = {
      ...nuevoEvento,
      tareas: [],
      gastos: []
    };
    const updatedEventos = [...eventos, eventoConDatos];
    setEventos(updatedEventos);
    setEventoActivo(eventoConDatos);
    await saveEventosToDB(updatedEventos);
  };

  const handleUpdateEvento = async (eventoActualizado) => {
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActualizado.id ? eventoActualizado : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(eventoActualizado);
    await saveEventosToDB(updatedEventos);
  };

  const handleDeleteEvento = async (eventoId) => {
    const updatedEventos = eventos.filter(ev => ev.id !== eventoId);
    setEventos(updatedEventos);
    if (eventoActivo?.id === eventoId) {
      setEventoActivo(updatedEventos.length > 0 ? updatedEventos[0] : null);
    }
    await saveEventosToDB(updatedEventos);
  };

  const handleSelectEvento = (evento) => {
    setEventoActivo(evento);
  };

  const handleAddTarea = async (texto) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, tareas: [...(ev.tareas || []), { text: texto, completed: false }] }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
    await saveEventosToDB(updatedEventos);
  };

  const handleToggleTarea = async (index) => {
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
    await saveEventosToDB(updatedEventos);
  };

  const handleDeleteTarea = async (index) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, tareas: ev.tareas.filter((_, i) => i !== index) }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
    await saveEventosToDB(updatedEventos);
  };

  const handleAddGasto = async (gasto) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, gastos: [...(ev.gastos || []), gasto] }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
    await saveEventosToDB(updatedEventos);
  };

  const handleDeleteGasto = async (index) => {
    if (!eventoActivo) return;
    
    const updatedEventos = eventos.map(ev => 
      ev.id === eventoActivo.id 
        ? { ...ev, gastos: ev.gastos.filter((_, i) => i !== index) }
        : ev
    );
    setEventos(updatedEventos);
    setEventoActivo(updatedEventos.find(ev => ev.id === eventoActivo.id));
    await saveEventosToDB(updatedEventos);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
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
          <div className="lg:col-span-1">
            <EventList
              eventos={eventos}
              eventoActivo={eventoActivo}
              onSelectEvent={handleSelectEvento}
              onNewEvent={() => setShowNewEventPopup(true)}
              onDeleteEvent={handleDeleteEvento}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {eventoActivo ? (
              <>
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
                      onClick={() => setShowEditEventPopup(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                  </div>
                </div>

                <TareasChecklist
                  tareas={eventoActivo.tareas || []}
                  onAddTarea={handleAddTarea}
                  onToggleTarea={handleToggleTarea}
                  onDeleteTarea={handleDeleteTarea}
                />

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

      <NewEventPopup
        isOpen={showNewEventPopup}
        onClose={() => setShowNewEventPopup(false)}
        onAdd={handleAddEvento}
      />

      <EditEventPopup
        isOpen={showEditEventPopup}
        onClose={() => setShowEditEventPopup(false)}
        onSave={handleUpdateEvento}
        evento={eventoActivo}
      />
    </div>
  );
};

export default Eventos;