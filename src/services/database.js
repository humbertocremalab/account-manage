import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Colecciones
const METRICS_COLLECTION = 'metrics';
const CHECKLISTS_COLLECTION = 'checklists';
const DRIVE_FOLDERS_COLLECTION = 'driveFolders';
const EVENTOS_COLLECTION = 'eventos';
const INSUMOS_COLLECTION = 'insumos';
const TAREAS_EXPRESS_COLLECTION = 'tareasExpress';

// ============== MÉTRICAS ==============
export const saveMetrics = async (userId, month, year, metrics) => {
  try {
    const docId = `${userId}_${year}_${month}`;
    const docRef = doc(db, METRICS_COLLECTION, docId);
    await setDoc(docRef, { 
      userId,
      month,
      year,
      data: metrics 
    }, { merge: true });
    console.log('Métricas guardadas:', docId);
    return true;
  } catch (error) {
    console.error('Error saving metrics:', error);
    return false;
  }
};

export const loadMetrics = async (userId, month, year) => {
  try {
    const docId = `${userId}_${year}_${month}`;
    const docRef = doc(db, METRICS_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Métricas cargadas:', docId);
      return docSnap.data().data;
    }
    console.log('No hay métricas para:', docId);
    return null;
  } catch (error) {
    console.error('Error loading metrics:', error);
    return null;
  }
};

// ============== CHECKLISTS ==============
export const saveChecklists = async (userId, month, year, checklists) => {
  try {
    const docId = `${userId}_${year}_${month}`;
    const docRef = doc(db, CHECKLISTS_COLLECTION, docId);
    await setDoc(docRef, { 
      userId,
      month,
      year,
      data: checklists 
    }, { merge: true });
    console.log('Checklists guardados:', docId);
    return true;
  } catch (error) {
    console.error('Error saving checklists:', error);
    return false;
  }
};

export const loadChecklists = async (userId, month, year) => {
  try {
    const docId = `${userId}_${year}_${month}`;
    const docRef = doc(db, CHECKLISTS_COLLECTION, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Checklists cargados:', docId);
      return docSnap.data().data;
    }
    console.log('No hay checklists para:', docId);
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
    console.log('Drive folders guardados:', userId);
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
      console.log('Drive folders cargados:', userId);
      return docSnap.data().data;
    }
    console.log('No hay drive folders para:', userId);
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
    console.log('Eventos guardados:', userId, eventos.length);
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
      const data = docSnap.data().data;
      console.log('Eventos cargados:', userId, data?.length || 0);
      return data || [];
    }
    console.log('No hay eventos para:', userId);
    return [];
  } catch (error) {
    console.error('Error loading eventos:', error);
    return [];
  }
};

// ============== INSUMOS ==============
export const saveInsumos = async (userId, insumos) => {
  try {
    const docRef = doc(db, INSUMOS_COLLECTION, userId);
    await setDoc(docRef, { data: insumos }, { merge: true });
    console.log('Insumos guardados:', userId, insumos.length);
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
      const data = docSnap.data().data;
      console.log('Insumos cargados:', userId, data?.length || 0);
      return data || [];
    }
    console.log('No hay insumos para:', userId);
    return [];
  } catch (error) {
    console.error('Error loading insumos:', error);
    return [];
  }
};

// ============== TAREAS EXPRESS ==============
export const saveTareasExpress = async (userId, tareas) => {
  try {
    const docRef = doc(db, TAREAS_EXPRESS_COLLECTION, userId);
    await setDoc(docRef, { data: tareas }, { merge: true });
    console.log('Tareas express guardadas:', userId, tareas.length);
    return true;
  } catch (error) {
    console.error('Error saving tareas express:', error);
    return false;
  }
};

export const loadTareasExpress = async (userId) => {
  try {
    const docRef = doc(db, TAREAS_EXPRESS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data().data;
      console.log('Tareas express cargadas:', userId, data?.length || 0);
      return data || [];
    }
    console.log('No hay tareas express para:', userId);
    return [];
  } catch (error) {
    console.error('Error loading tareas express:', error);
    return [];
  }
};

// ============== OBTENER TODOS LOS DATOS PARA REPORTE ==============
export const getAllDataForReport = async (userId, month, year) => {
  try {
    console.log('Cargando reporte para:', userId, month, year);
    
    const [metrics, checklists, driveFolders, eventos, insumos, tareasExpress] = await Promise.all([
      loadMetrics(userId, month, year),
      loadChecklists(userId, month, year),
      loadDriveFolders(userId),
      loadEventos(userId),
      loadInsumos(userId),
      loadTareasExpress(userId)
    ]);

    const eventosFiltrados = (eventos || []).filter(evento => {
      const fecha = new Date(evento.fecha);
      return fecha.getMonth() === month && fecha.getFullYear() === year;
    });

    const tareasFiltradas = (tareasExpress || []).filter(tarea => {
      const fecha = new Date(tarea.fechaEntrada);
      return fecha.getMonth() === month && fecha.getFullYear() === year;
    });

    const result = {
      metrics: metrics || {
        monterrey: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 },
        saltillo: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 },
        cdmx: { leadsMeta: 0, leadsGenerados: 0, presupuesto: 0, gasto: 0 }
      },
      checklists: checklists || { awareness: [], prospeccion: [], retargeting: [] },
      driveFolders: driveFolders || { awareness: null, prospeccion: null, retargeting: null },
      eventos: eventosFiltrados,
      insumos: insumos || [],
      tareasExpress: tareasFiltradas
    };
    
    console.log('Reporte cargado:', result);
    return result;
  } catch (error) {
    console.error('Error getting all data for report:', error);
    return null;
  }
};