import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, FolderOpen, Play, File, Image, RefreshCw, MoreHorizontal } from 'lucide-react';
import { getFilesFromFolder, getFileThumbnail, getFileType } from '../../services/driveService';

const DriveCarousel = ({ folderData, onUpdate }) => {
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

  const getFileIcon = (file) => {
    const type = getFileType(file);
    if (type === 'video') return <Play className="w-3 h-3 text-blue-600" />;
    if (type === 'image') return <Image className="w-3 h-3 text-green-600" />;
    return <File className="w-3 h-3 text-gray-600" />;
  };

  const truncateFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const ext = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.length - ext.length - 1);
    return nameWithoutExt.substring(0, maxLength - 3) + '...' + (ext ? '.' + ext : '');
  };

  if (!folderData?.url) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header con nombre de carpeta y categoría */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">
            {folderData.nombre} <span className="text-gray-400 text-sm font-normal">({folderData.categoria || ''})</span>
          </h4>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => loadFiles(folderData.url)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
              title="Actualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de archivos con scroll horizontal */}
      <div className="p-4">
        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            No hay archivos en esta carpeta
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-3 min-w-max">
              {files.map((file, index) => (
                <a
                  key={file.id}
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group"
                >
                  <div className="w-32">
                    {/* Thumbnail */}
                    <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {getFileType(file) === 'video' ? (
                        <div className="relative h-full">
                          <img
                            src={getFileThumbnail(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                            <div className="bg-white bg-opacity-90 rounded-full p-1.5">
                              <Play className="w-3 h-3 text-blue-600" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={getFileThumbnail(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Icono de tipo de archivo */}
                      <div className="absolute bottom-1 left-1 bg-white bg-opacity-90 rounded p-0.5">
                        {getFileIcon(file)}
                      </div>
                    </div>
                    
                    {/* Nombre del archivo */}
                    <div className="mt-1.5 flex items-start space-x-1">
                      {getFileIcon(file)}
                      <p className="text-xs text-gray-700 truncate flex-1" title={file.name}>
                        {truncateFileName(file.name, 18)}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveCarousel;