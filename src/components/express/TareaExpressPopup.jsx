import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, User } from 'lucide-react';

const TareaExpressPopup = ({ isOpen, onClose, onSave, tarea }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    responsable: '',
    fechaEntrada: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    estado: 'pendiente',
    progreso: 0
  });

  useEffect(() => {
    if (tarea) {
      setFormData({
        titulo: tarea.titulo || '',
        responsable: tarea.responsable || '',
        fechaEntrada: tarea.fechaEntrada || new Date().toISOString().split('T')[0],
        fechaVencimiento: tarea.fechaVencimiento || '',
        estado: tarea.estado || 'pendiente',
        progreso: tarea.progreso || 0
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        titulo: '',
        responsable: '',
        fechaEntrada: today,
        fechaVencimiento: '',
        estado: 'pendiente',
        progreso: 0
      });
    }
  }, [tarea, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.titulo.trim()) {
      onSave({
        ...formData,
        id: tarea?.id || Date.now()
      });
      onClose();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const estados = [
    { id: 'pendiente', label: 'Pendiente', color: 'gray' },
    { id: 'en_progreso', label: 'En progreso', color: 'yellow' },
    { id: 'completada', label: 'Completada', color: 'green' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {tarea ? 'Editar Tarea Express' : 'Nueva Tarea Express'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la tarea
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: Enviar cotización a cliente"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                placeholder="Ej: Ana"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha entrada
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.fechaEntrada}
                  onChange={(e) => setFormData({ ...formData, fechaEntrada: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha vence
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                  min={today}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {estados.map(e => (
                <option key={e.id} value={e.id}>{e.label}</option>
              ))}
            </select>
          </div>

          {formData.estado === 'en_progreso' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progreso: {formData.progreso}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progreso}
                onChange={(e) => setFormData({ ...formData, progreso: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {tarea ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TareaExpressPopup;