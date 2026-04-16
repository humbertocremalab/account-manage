import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, FolderOpen, Play, File, Image, RefreshCw } from 'lucide-react';
import { getFilesFromFolder, getFileThumbnail, getFileType } from '../../services/driveService';

const DriveCarousel = ({ folderData, onUpdate }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (folderData?.url) {
      loadFiles(folderData.url);
    }
  }, [folderData?.url]);

  const loadFiles = async (url) => {
    setLoading(true);
    setError('');
    try {
      const filesList = await getFilesFromFolder(url);
      setFiles(filesList);
      setCurrentIndex(0);
    } catch (err) {
      setError('Error al cargar archivos');
      console.error(err);
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

  const getFileIcon = (file) => {
    const type = getFileType(file);
    if (type === 'video') return <Play className="w-6 h-6 text-white" />;
    if (type === 'image') return <Image className="w-6 h-6 text-white" />;
    return <File className="w-6 h-6 text-white" />;
  };

  if (!folderData?.url) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6">
        <div className="text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No hay carpeta conectada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header con nombre de carpeta */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800 truncate">
            {folderData.nombre}
          </h4>
          <button
            onClick={() => loadFiles(folderData.url)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenido del carrusel */}
      <div className="p-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="h-48 flex items-center justify-center text-red-500 text-sm">
            {error}
          </div>
        ) : files.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500">
            No hay archivos en esta carpeta
          </div>
        ) : (
          <div className="relative">
            {/* Contenedor de archivo actual */}
            <div className="overflow-hidden rounded-lg h-48 bg-gray-100">
              {files[currentIndex] && (
                <div className="relative h-full group">
                  {getFileType(files[currentIndex]) === 'video' ? (
                    <div className="relative h-full">
                      <img
                        src={getFileThumbnail(files[currentIndex])}
                        alt={files[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <Play className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getFileThumbnail(files[currentIndex])}
                      alt={files[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Botón para abrir en Drive */}
                  <a
                    href={files[currentIndex].webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-700" />
                  </a>
                </div>
              )}
            </div>

            {/* Controles de navegación */}
            {files.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Información del archivo */}
            <div className="mt-3">
              <p className="text-sm text-gray-700 truncate font-medium">
                {files[currentIndex]?.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {currentIndex + 1} de {files.length}
                </p>
                {files.length > 1 && (
                  <div className="flex space-x-1">
                    {files.slice(0, 5).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentIndex 
                            ? 'bg-blue-600 w-4' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveCarousel;