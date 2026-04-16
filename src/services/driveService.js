const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || 'AIzaSyBH8-5rLNM_--UWRMIywOb-m5-UOuzUYUw';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export const getFilesFromFolder = async (folderId) => {
  try {
    const cleanFolderId = extractFolderIdFromUrl(folderId);
    
    const response = await fetch(
      `${DRIVE_API_BASE}/files?q='${cleanFolderId}'+in+parents&key=${DRIVE_API_KEY}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,hasThumbnail,size)`
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar archivos');
    }
    
    const data = await response.json();
    console.log('Archivos obtenidos:', data.files);
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    return [];
  }
};

export const getFileThumbnail = (file) => {
  // Para videos - usar miniatura generada por Google
  if (file.mimeType?.startsWith('video/')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400-h600`;
  }
  
  // Para imágenes
  if (file.mimeType?.startsWith('image/')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400-h600`;
  }
  
  // Para PDFs
  if (file.mimeType?.includes('pdf')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400-h600`;
  }
  
  // Usar thumbnailLink de Google si existe
  if (file.thumbnailLink) {
    return file.thumbnailLink.replace('=s220', '=s400');
  }
  
  // Fallback
  return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400-h600`;
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