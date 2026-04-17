import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EditMetricsPopup = ({ isOpen, onClose, metrics, onSave }) => {
  const [sucursalActiva, setSucursalActiva] = useState('monterrey');
  const [formData, setFormData] = useState({
    monterrey: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 },
    saltillo: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 },
    cdmx: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 }
  });

  // Inicializar formData cuando se abre el popup o cambian las metrics
  useEffect(() => {
    if (isOpen && metrics) {
      setFormData({
        monterrey: {
          leadsMeta: metrics.monterrey?.leadsMeta || 0,
          leadsGenerados: metrics.monterrey?.leadsGenerados || 0,
          presupuesto: metrics.monterrey?.presupuesto || 0,
          gasto: metrics.monterrey?.gasto || 0
        },
        saltillo: {
          leadsMeta: metrics.saltillo?.leadsMeta || 0,
          leadsGenerados: metrics.saltillo?.leadsGenerados || 0,
          presupuesto: metrics.saltillo?.presupuesto || 0,
          gasto: metrics.saltillo?.gasto || 0
        },
        cdmx: {
          leadsMeta: metrics.cdmx?.leadsMeta || 0,
          leadsGenerados: metrics.cdmx?.leadsGenerados || 0,
          presupuesto: metrics.cdmx?.presupuesto || 0,
          gasto: metrics.cdmx?.gasto || 0
        }
      });
    }
  }, [isOpen, metrics]);

  if (!isOpen) return null;

  const sucursales = [
    { id: 'monterrey', label: 'Monterrey' },
    { id: 'saltillo', label: 'Saltillo' },
    { id: 'cdmx', label: 'CDMX' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [sucursalActiva]: {
        ...prev[sucursalActiva],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const datosActuales = formData[sucursalActiva];
  const porcentajeLeads = datosActuales.leadsMeta > 0 
    ? ((datosActuales.leadsGenerados / datosActuales.leadsMeta) * 100).toFixed(1)
    : '0.0';
  const porcentajeGasto = datosActuales.presupuesto > 0
    ? ((datosActuales.gasto / datosActuales.presupuesto) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Editar Métricas
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Pestañas de sucursales */}
          <div className="flex border-b border-gray-200 mb-5">
            {sucursales.map(sucursal => (
              <button
                key={sucursal.id}
                type="button"
                onClick={() => setSucursalActiva(sucursal.id)}
                className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
                  sucursalActiva === sucursal.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {sucursal.label}
                {sucursalActiva === sucursal.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Campos para la sucursal activa */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leads Meta
              </label>
              <input
                type="number"
                value={datosActuales.leadsMeta}
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
                value={datosActuales.leadsGenerados}
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
                value={datosActuales.presupuesto}
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
                value={datosActuales.gasto}
                onChange={(e) => handleChange('gasto', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>

            {/* Resumen sucursal actual */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">Resumen {sucursales.find(s => s.id === sucursalActiva)?.label}:</p>
              <div className="flex justify-between text-sm">
                <span>Avance Leads:</span>
                <span className="font-medium">{porcentajeLeads}%</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>% Gasto:</span>
                <span className="font-medium">{porcentajeGasto}%</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
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