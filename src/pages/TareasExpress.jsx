import React, { useState, useEffect } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveTareasExpress, loadTareasExpress } from '../services/database';
import TareaExpressCard from '../components/express/TareaExpressCard';
import TareaExpressPopup from '../components/express/TareaExpressPopup';
import ResumenTareasExpress from '../components/express/ResumenTareasExpress';

const TareasExpress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tareas, setTareas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

  useEffect(() => {
   const loadData = async () => {
  if (!user) return;
  
  setLoading(true);
  try {
    const savedTareas = await loadTareasExpress();
    if (savedTareas && Array.isArray(savedTareas)) {
      setTareas(savedTareas);
    } else {
      setTareas([]);
    }
  } catch (error) {
    console.error('Error loading tareas express:', error);
    setTareas([]);
  } finally {
    setLoading(false);
  }
};

    loadData();
  }, [user]);

  const saveTareasToDB = async (updatedTareas) => {
    if (user) {
      await saveTareasExpress(updatedTareas);
    }
  };

  const handleAddTarea = async (nuevaTarea) => {
    const updatedTareas = [...tareas, nuevaTarea];
    setTareas(updatedTareas);
    await saveTareasToDB(updatedTareas);
  };

  const handleUpdateTarea = async (tareaActualizada) => {
    const updatedTareas = tareas.map(t => 
      t.id === tareaActualizada.id ? tareaActualizada : t
    );
    setTareas(updatedTareas);
    await saveTareasToDB(updatedTareas);
    setTareaEditando(null);
  };

  const handleDeleteTarea = async (id) => {
    const updatedTareas = tareas.filter(t => t.id !== id);
    setTareas(updatedTareas);
    await saveTareasToDB(updatedTareas);
  };

  const handleToggleComplete = async (tarea) => {
    const nuevoEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
    const tareaActualizada = { ...tarea, estado: nuevoEstado };
    await handleUpdateTarea(tareaActualizada);
  };

  const handleEditTarea = (tarea) => {
    setTareaEditando(tarea);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTareaEditando(null);
  };

  const tareasPendientes = tareas.filter(t => t.estado === 'pendiente');
  const tareasEnProgreso = tareas.filter(t => t.estado === 'en_progreso');
  const tareasCompletadas = tareas.filter(t => t.estado === 'completada');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Tareas Express</h2>
          <p className="text-gray-600 text-sm">
            Gestiona tareas rápidas no proyectadas
          </p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </button>
      </div>

      {tareas.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No hay tareas express
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega tareas rápidas que surgen en el día a día
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear primera tarea
          </button>
        </div>
      ) : (
        <>
          <ResumenTareasExpress tareas={tareas} />
          
          <div className="space-y-6">
            {tareasPendientes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Pendientes ({tareasPendientes.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tareasPendientes.map(tarea => (
                    <TareaExpressCard
                      key={tarea.id}
                      tarea={tarea}
                      onEdit={handleEditTarea}
                      onDelete={handleDeleteTarea}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {tareasEnProgreso.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  En Progreso ({tareasEnProgreso.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tareasEnProgreso.map(tarea => (
                    <TareaExpressCard
                      key={tarea.id}
                      tarea={tarea}
                      onEdit={handleEditTarea}
                      onDelete={handleDeleteTarea}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {tareasCompletadas.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Completadas ({tareasCompletadas.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tareasCompletadas.map(tarea => (
                    <TareaExpressCard
                      key={tarea.id}
                      tarea={tarea}
                      onEdit={handleEditTarea}
                      onDelete={handleDeleteTarea}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <TareaExpressPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        onSave={tareaEditando ? handleUpdateTarea : handleAddTarea}
        tarea={tareaEditando}
      />
    </div>
  );
};

export default TareasExpress;