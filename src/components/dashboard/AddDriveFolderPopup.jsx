import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

const AddDriveFolderPopup = ({ isOpen, onClose, onAdd, categoria }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    url: '',
    categoria: categoria || 'awareness'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ nombre: '', url: '', categoria: categoria || 'awareness' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Agregar carpeta de Drive
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la carpeta
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Creativos Abril"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID o URL de carpeta Drive
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">
              La carpeta debe ser pública o compartida para verla.
            </p>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="awareness"
                  checked={formData.categoria === 'awareness'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">Awareness</span>
                  <p className="text-xs text-gray-500">Creativos de reconocimiento de marca</p>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="prospeccion"
                  checked={formData.categoria === 'prospeccion'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">Prospección</span>
                  <p className="text-xs text-gray-500">Material para captación de leads</p>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="retargeting"
                  checked={formData.categoria === 'retargeting'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">Retargeting</span>
                  <p className="text-xs text-gray-500">Contenido para remarketing</p>
                </div>
              </label>
            </div>
          </div>

          {/* Botones */}
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
              <FolderPlus className="w-4 h-4 mr-2" />
              Agregar carpeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriveFolderPopup;