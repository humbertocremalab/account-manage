import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';

const InsumoPopup = ({ isOpen, onClose, onSave, insumo }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    sucursal: 'monterrey',
    fechaVencimiento: '',
    estado: 'activo'
  });

  useEffect(() => {
    if (insumo) {
      setFormData({
        nombre: insumo.nombre || '',
        sucursal: insumo.sucursal || 'monterrey',
        fechaVencimiento: insumo.fechaVencimiento || '',
        estado: insumo.estado || 'activo'
      });
    } else {
      setFormData({
        nombre: '',
        sucursal: 'monterrey',
        fechaVencimiento: '',
        estado: 'activo'
      });
    }
  }, [insumo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre.trim()) {
      onSave({
        ...formData,
        id: insumo?.id || Date.now()
      });
      onClose();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const sucursales = [
    { id: 'monterrey', label: 'Monterrey' },
    { id: 'saltillo', label: 'Saltillo' },
    { id: 'cdmx', label: 'CDMX' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {insumo ? 'Editar Insumo' : 'Nuevo Insumo'}
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
              Nombre del material
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Banner Principal"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sucursal
            </label>
            <select
              value={formData.sucursal}
              onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {sucursales.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de vencimiento
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

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
              {insumo ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsumoPopup;