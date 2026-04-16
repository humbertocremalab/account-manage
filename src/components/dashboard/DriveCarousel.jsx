import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { getFilesFromFolder, getFileThumbnail, getFileType } from '../../services/driveService';

const DriveCarousel = ({ folderData, onRemove }) => {
  const [files, setFiles] = useState([]);
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
    } catch (err) {
      setError('Error al cargar archivos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const truncateFileName = (name, maxLength = 12) => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    const ext = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.length - ext.length - 1);
    return nameWithoutExt.substring(0, maxLength - 3) + '...';
  };

  if (!folderData?.url) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <h4 className="font-medium text-gray-800 text-sm">
          {folderData.nombre} <span className="text-gray-400 font-normal">({folderData.categoria})</span>
        </h4>
        {onRemove && (
          <button
            onClick={() => onRemove(folderData.categoria)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
            title="Eliminar carpeta"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lista de archivos */}
      <div className="px-3 pb-3">
        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-xs">
            {error}
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            No hay archivos en esta carpeta
          </div>
        ) : (
          <div className="overflow-x-auto pb-1 -mx-3 px-3">
            <div className="flex space-x-3 min-w-max">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group"
                >
                  <div className="w-[90px]">
                    {/* Contenedor de imagen 9:16 */}
                    <div className="relative h-[160px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={getFileThumbnail(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Si falla la miniatura, mostrar un placeholder con ícono
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('thumbnail-fallback');
                        }}
                      />
                      {getFileType(file) === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all">
                          <div className="bg-white rounded-full p-2 shadow-md">
                            <Play className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Nombre del archivo */}
                    <p 
                      className="mt-1.5 text-xs text-gray-700 text-center truncate"
                      title={file.name}
                    >
                      {truncateFileName(file.name, 12)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .thumbnail-fallback {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .thumbnail-fallback::after {
          content: "🎬";
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

export default DriveCarousel;