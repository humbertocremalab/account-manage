import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditMetricsPopup = ({ isOpen, onClose, metrics, onSave, sucursal }) => {
  const [formData, setFormData] = useState({
    leadsMeta: metrics.leadsMeta || 0,
    leadsGenerados: metrics.leadsGenerados || 0,
    presupuesto: metrics.presupuesto || 0,
    gasto: metrics.gasto || 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Editar Métricas - {sucursal}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leads Meta
            </label>
            <input
              type="number"
              value={formData.leadsMeta}
              onChange={(e) => handleChange('leadsMeta', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leads Generados
            </label>
            <input
              type="number"
              value={formData.leadsGenerados}
              onChange={(e) => handleChange('leadsGenerados', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto ($)
            </label>
            <input
              type="number"
              value={formData.presupuesto}
              onChange={(e) => handleChange('presupuesto', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gasto ($)
            </label>
            <input
              type="number"
              value={formData.gasto}
              onChange={(e) => handleChange('gasto', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="1000"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Resumen:</p>
            <p className="text-sm">
              Avance Leads: {((formData.leadsGenerados / formData.leadsMeta) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-sm">
              % Gasto: {((formData.gasto / formData.presupuesto) * 100 || 0).toFixed(1)}%
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMetricsPopup;