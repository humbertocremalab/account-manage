import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';

// Colecciones
const METRICS_COLLECTION = 'metrics';
const CHECKLISTS_COLLECTION = 'checklists';
const DRIVE_FOLDERS_COLLECTION = 'driveFolders';
const EVENTOS_COLLECTION = 'eventos';

// ============== MÉTRICAS ==============
export const saveMetrics = async (userId, metrics) => {
  try {
    const docRef = doc(db, METRICS_COLLECTION, userId);
    await setDoc(docRef, { data: metrics }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving metrics:', error);
    return false;
  }
};

export const loadMetrics = async (userId) => {
  try {
    const docRef = doc(db, METRICS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error('Error loading metrics:', error);
    return null;
  }
};

export const subscribeToMetrics = (userId, callback) => {
  const docRef = doc(db, METRICS_COLLECTION, userId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().data);
    } else {
      callback(null);
    }
  });
};

// ============== CHECKLISTS ==============
export const saveChecklists = async (userId, checklists) => {
  try {
    const docRef = doc(db, CHECKLISTS_COLLECTION, userId);
    await setDoc(docRef, { data: checklists }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving checklists:', error);
    return false;
  }
};

export const loadChecklists = async (userId) => {
  try {
    const docRef = doc(db, CHECKLISTS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error('Error loading checklists:', error);
    return null;
  }
};

// ============== DRIVE FOLDERS ==============
export const saveDriveFolders = async (userId, folders) => {
  try {
    const docRef = doc(db, DRIVE_FOLDERS_COLLECTION, userId);
    await setDoc(docRef, { data: folders }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving drive folders:', error);
    return false;
  }
};

export const loadDriveFolders = async (userId) => {
  try {
    const docRef = doc(db, DRIVE_FOLDERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error('Error loading drive folders:', error);
    return null;
  }
};

// ============== EVENTOS ==============
export const saveEventos = async (userId, eventos) => {
  try {
    const docRef = doc(db, EVENTOS_COLLECTION, userId);
    await setDoc(docRef, { data: eventos }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving eventos:', error);
    return false;
  }
};

export const loadEventos = async (userId) => {
  try {
    const docRef = doc(db, EVENTOS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error('Error loading eventos:', error);
    return null;
  }
};

// ============== INSUMOS ==============
const INSUMOS_COLLECTION = 'insumos';

export const saveInsumos = async (userId, insumos) => {
  try {
    const docRef = doc(db, INSUMOS_COLLECTION, userId);
    await setDoc(docRef, { data: insumos }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving insumos:', error);
    return false;
  }
};

export const loadInsumos = async (userId) => {
  try {
    const docRef = doc(db, INSUMOS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error('Error loading insumos:', error);
    return null;
  }
};

// ============== SUSCRIPCIONES EN TIEMPO REAL ==============
export const subscribeToAllData = (userId, callback) => {
  const unsubscribers = [];
  
  // Suscribirse a métricas
  const unsubMetrics = onSnapshot(doc(db, METRICS_COLLECTION, userId), (docSnap) => {
    callback('metrics', docSnap.exists() ? docSnap.data().data : null);
  });
  unsubscribers.push(unsubMetrics);
  
  // Suscribirse a checklists
  const unsubChecklists = onSnapshot(doc(db, CHECKLISTS_COLLECTION, userId), (docSnap) => {
    callback('checklists', docSnap.exists() ? docSnap.data().data : null);
  });
  unsubscribers.push(unsubChecklists);
  
  // Suscribirse a drive folders
  const unsubFolders = onSnapshot(doc(db, DRIVE_FOLDERS_COLLECTION, userId), (docSnap) => {
    callback('driveFolders', docSnap.exists() ? docSnap.data().data : null);
  });
  unsubscribers.push(unsubFolders);
  
  // Suscribirse a eventos
  const unsubEventos = onSnapshot(doc(db, EVENTOS_COLLECTION, userId), (docSnap) => {
    callback('eventos', docSnap.exists() ? docSnap.data().data : null);
  });
  unsubscribers.push(unsubEventos);
  
  // Retornar función para cancelar todas las suscripciones
  return () => unsubscribers.forEach(unsub => unsub());
};