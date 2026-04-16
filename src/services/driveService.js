const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || 'AIzaSyBH8-5rLNM_--UWRMIywOb-m5-UOuzUYUw';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export const getFilesFromFolder = async (folderId) => {
  try {
    const cleanFolderId = extractFolderIdFromUrl(folderId);
    
    const response = await fetch(
      `${DRIVE_API_BASE}/files?q='${cleanFolderId}'+in+parents&key=${DRIVE_API_KEY}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,hasThumbnail)`
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar archivos');
    }
    
    const data = await response.json();
    console.log('Archivos obtenidos:', data.files); // Para debug
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    return [];
  }
};

export const getFileThumbnail = (file) => {
  // Si el archivo tiene thumbnailLink proporcionado por Google
  if (file.thumbnailLink) {
    // Modificar el tamaño de la miniatura
    return file.thumbnailLink.replace('=s220', '=s400');
  }
  
  // Si es una imagen, podemos obtener miniatura directamente
  if (file.mimeType?.startsWith('image/')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
  }
  
  // Si es un video, intentar obtener miniatura
  if (file.mimeType?.startsWith('video/')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
  }
  
  // Si es PDF
  if (file.mimeType?.includes('pdf')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
  }
  
  // Fallback para otros tipos
  return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
};

export const getFileType = (file) => {
  if (file.mimeType?.startsWith('image/')) return 'image';
  if (file.mimeType?.startsWith('video/')) return 'video';
  if (file.mimeType?.includes('pdf')) return 'pdf';
  return 'file';
};

export const extractFolderIdFromUrl = (url) => {
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
    return url;
  }
  
  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return url;
};

// Función para verificar si una imagen carga correctamente
export const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};