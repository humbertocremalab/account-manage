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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-blue-600" />
            Agregar carpeta de Drive
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
              Nombre de la carpeta
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Creativos Abril"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID o URL de carpeta Drive
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              La carpeta debe ser pública o compartida para verla.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="awareness"
                  checked={formData.categoria === 'awareness'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Awareness</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="prospeccion"
                  checked={formData.categoria === 'prospeccion'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Prospección</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="retargeting"
                  checked={formData.categoria === 'retargeting'}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Retargeting</span>
              </label>
            </div>
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar carpeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriveFolderPopup;