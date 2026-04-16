const DRIVE_API_KEY = 'AIzaSyBH8-5rLNM_--UWRMIywOb-m5-UOuzUYUw';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

export const getFilesFromFolder = async (folderId) => {
  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/files?q='${folderId}'+in+parents&key=${DRIVE_API_KEY}&fields=files(id,name,mimeType,webViewLink,thumbnailLink)`
    );
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    return [];
  }
};

export const getFileThumbnail = (file) => {
  if (file.mimeType.startsWith('image/')) {
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
  }
  return file.thumbnailLink || '/placeholder-image.png';
};

export const extractFolderIdFromUrl = (url) => {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : url;
};