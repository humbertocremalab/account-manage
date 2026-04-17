import React, { useState, useEffect } from 'react';
import { Play, X, Film, Image, File } from 'lucide-react';
import { getFilesFromFolder, getFileThumbnail, getFileType } from '../../services/driveService';

const DriveCarousel = ({ folderData, onRemove, readOnly = false }) => {
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
      if (filesList.length === 0) {
        setError('No se encontraron archivos');
      }
    } catch (err) {
      setError('Error al cargar archivos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const truncateFileName = (name, maxLength = 13) => {
    if (!name) return '';
    const nameWithoutExt = name.replace(/\.(mp4|mov|avi|mkv|jpg|jpeg|png|gif|pdf)$/i, '');
    if (nameWithoutExt.length <= maxLength) return nameWithoutExt;
    return nameWithoutExt.substring(0, maxLength - 3) + '...';
  };

  const FileThumbnail = ({ file }) => {
    const [imgError, setImgError] = useState(false);
    const fileType = getFileType(file);
    const thumbnailUrl = getFileThumbnail(file);

    if (imgError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center">
          {fileType === 'video' && <Film className="w-6 h-6 text-gray-400 mb-1" />}
          {fileType === 'image' && <Image className="w-6 h-6 text-gray-400 mb-1" />}
          {fileType === 'file' && <File className="w-6 h-6 text-gray-400 mb-1" />}
          <span className="text-[9px] text-gray-400 text-center px-1">
            {fileType === 'video' ? 'Video' : fileType === 'image' ? 'Imagen' : 'Archivo'}
          </span>
        </div>
      );
    }

    return (
      <>
        <img
          src={thumbnailUrl}
          alt={file.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {fileType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
            <div className="bg-white/90 rounded-full p-2 shadow-lg">
              <Play className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        )}
      </>
    );
  };

  if (!folderData?.url) {
    return null;
  }

  // Componente para el contenido del archivo (con o sin enlace)
  const FileWrapper = ({ file, children }) => {
    if (readOnly) {
      // Invitado: solo mostrar sin enlace
      return (
        <div className="flex-shrink-0 group w-[90px] cursor-default">
          {children}
        </div>
      );
    }
    // Admin: con enlace para abrir
    return (
      <a
        href={file.webViewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 group w-[90px] cursor-pointer"
      >
        {children}
      </a>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
        <h4 className="font-medium text-gray-800 text-sm">
          {folderData.nombre} <span className="text-gray-400 font-normal text-xs">({folderData.categoria})</span>
        </h4>
        {!readOnly && onRemove && (
          <button
            onClick={() => onRemove(folderData.categoria)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
            title="Eliminar carpeta"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Lista de archivos */}
      <div className="px-3 py-3">
        {loading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500 text-xs mb-2">{error}</p>
            {!readOnly && (
              <button 
                onClick={() => loadFiles(folderData.url)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Reintentar
              </button>
            )}
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            No hay archivos en esta carpeta
          </div>
        ) : (
          <div className="overflow-x-auto pb-1 -mx-3 px-3">
            <div className="flex gap-3 min-w-max">
              {files.map((file) => (
                <FileWrapper key={file.id} file={file}>
                  {/* Miniatura 9:16 */}
                  <div className="relative h-[160px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <FileThumbnail file={file} />
                  </div>
                  
                  {/* Nombre del archivo */}
                  <p 
                    className="mt-1.5 text-[11px] text-gray-700 text-center truncate font-medium"
                    title={file.name}
                  >
                    {truncateFileName(file.name, 12)}
                  </p>
                </FileWrapper>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveCarousel;