import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, FolderOpen } from 'lucide-react';
import { getFilesFromFolder, getFileThumbnail, extractFolderIdFromUrl } from '../../services/driveService';

const DriveCarousel = ({ title, folderUrl, onFolderConnect }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(!folderUrl);
  const [folderInput, setFolderInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (folderUrl) {
      loadFiles(folderUrl);
    }
  }, [folderUrl]);

  const loadFiles = async (url) => {
    setLoading(true);
    setError('');
    try {
      const folderId = extractFolderIdFromUrl(url);
      const filesList = await getFilesFromFolder(folderId);
      setFiles(filesList);
    } catch (err) {
      setError('Error al cargar archivos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectFolder = async () => {
    if (!folderInput.trim()) {
      setError('Ingresa una URL válida');
      return;
    }
    
    setLoading(true);
    try {
      await loadFiles(folderInput);
      onFolderConnect(folderInput);
      setShowFolderInput(false);
    } catch (err) {
      setError('No se pudo conectar la carpeta');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  if (showFolderInput) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6">
        <div className="text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="font-medium text-gray-800 mb-2">Conectar carpeta de Drive</h4>
          <p className="text-sm text-gray-600 mb-4">{title}</p>
          
          <input
            type="text"
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
            placeholder="ID o URL de carpeta de Drive"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
          />
          
          {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
          
          <button
            onClick={handleConnectFolder}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 text-sm"
          >
            {loading ? 'Conectando...' : 'Conectar carpeta'}
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            La carpeta debe ser pública o compartida
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <button
          onClick={() => setShowFolderInput(true)}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Cambiar carpeta
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-500">
          No hay archivos en esta carpeta
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-hidden rounded-lg h-48 bg-gray-100">
            {files[currentIndex] && (
              <div className="relative h-full">
                <img
                  src={getFileThumbnail(files[currentIndex])}
                  alt={files[currentIndex].name}
                  className="w-full h-full object-cover"
                />
                <a
                  href={files[currentIndex].webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <ExternalLink className="w-4 h-4 text-gray-700" />
                </a>
              </div>
            )}
          </div>

          {files.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="mt-2 text-center">
            <p className="text-xs text-gray-600 truncate">
              {files[currentIndex]?.name}
            </p>
            <p className="text-xs text-gray-400">
              {currentIndex + 1} / {files.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveCarousel;