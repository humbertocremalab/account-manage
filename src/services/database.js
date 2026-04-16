import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';

// ID de la organización (puede ser fijo para todos)
const ORG_ID = 'default-org';

// Colecciones
const METRICS_COLLECTION = 'metrics';
const CHECKLISTS_COLLECTION = 'checklists';
const DRIVE_FOLDERS_COLLECTION = 'driveFolders';
const EVENTOS_COLLECTION = 'eventos';
const INSUMOS_COLLECTION = 'insumos';
const TAREAS_EXPRESS_COLLECTION = 'tareasExpress';
const USER_ROLES_COLLECTION = 'userRoles';

// ============== MÉTRICAS (compartidas por organización y mes) ==============
export const saveMetrics = async (month, year, metrics) => {
  try {
    const docRef = doc(db, METRICS_COLLECTION, `${ORG_ID}_${year}_${month}`);
    await setDoc(docRef, { 
      orgId: ORG_ID,
      month,
      year,
      data: metrics 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving metrics:', error);
    return false;
  }
};

export const loadMetrics = async (month, year) => {
  try {
    const docRef = doc(db, METRICS_COLLECTION, `${ORG_ID}_${year}_${month}`);
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

// ============== CHECKLISTS (compartidas por organización y mes) ==============
export const saveChecklists = async (month, year, checklists) => {
  try {
    const docRef = doc(db, CHECKLISTS_COLLECTION, `${ORG_ID}_${year}_${month}`);
    await setDoc(docRef, { 
      orgId: ORG_ID,
      month,
      year,
      data: checklists 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving checklists:', error);
    return false;
  }
};

export const loadChecklists = async (month, year) => {
  try {
    const docRef = doc(db, CHECKLISTS_COLLECTION, `${ORG_ID}_${year}_${month}`);
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

// ============== DRIVE FOLDERS (compartidas) ==============
export const saveDriveFolders = async (folders) => {
  try {
    const docRef = doc(db, DRIVE_FOLDERS_COLLECTION, ORG_ID);
    await setDoc(docRef, { data: folders }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving drive folders:', error);
    return false;
  }
};

export const loadDriveFolders = async () => {
  try {
    const docRef = doc(db, DRIVE_FOLDERS_COLLECTION, ORG_ID);
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

// ============== EVENTOS (compartidos) ==============
export const saveEventos = async (eventos) => {
  try {
    const docRef = doc(db, EVENTOS_COLLECTION, ORG_ID);
    await setDoc(docRef, { data: eventos }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving eventos:', error);
    return false;
  }
};

export const loadEventos = async () => {
  try {
    const docRef = doc(db, EVENTOS_COLLECTION, ORG_ID);
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

// ============== INSUMOS (compartidos) ==============
export const saveInsumos = async (insumos) => {
  try {
    const docRef = doc(db, INSUMOS_COLLECTION, ORG_ID);
    await setDoc(docRef, { data: insumos }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving insumos:', error);
    return false;
  }
};

export const loadInsumos = async () => {
  try {
    const docRef = doc(db, INSUMOS_COLLECTION, ORG_ID);
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

// ============== TAREAS EXPRESS (compartidas) ==============
export const saveTareasExpress = async (tareas) => {
  try {
    const docRef = doc(db, TAREAS_EXPRESS_COLLECTION, ORG_ID);
    await setDoc(docRef, { data: tareas }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving tareas express:', error);
    return false;
  }
};

export const loadTareasExpress = async () => {
  try {
    const docRef = doc(db, TAREAS_EXPRESS_COLLECTION, ORG_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error('Error loading tareas express:', error);
    return null;
  }
};

// ============== ROLES DE USUARIO ==============
export const getUserRole = async (userId) => {
  try {
    const docRef = doc(db, USER_ROLES_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().role;
    }
    return 'viewer';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'viewer';
  }
};

export const setUserRole = async (userId, role, email) => {
  try {
    const docRef = doc(db, USER_ROLES_COLLECTION, userId);
    await setDoc(docRef, { role, email }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

// ============== OBTENER TODOS LOS DATOS PARA REPORTE ==============
export const getAllDataForReport = async (month, year) => {
  try {
    const [metrics, checklists, driveFolders, eventos, insumos, tareasExpress] = await Promise.all([
      loadMetrics(month, year),
      loadChecklists(month, year),
      loadDriveFolders(),
      loadEventos(),
      loadInsumos(),
      loadTareasExpress()
    ]);

    const eventosFiltrados = (eventos || []).filter(evento => {
      const fecha = new Date(evento.fecha);
      return fecha.getMonth() === month && fecha.getFullYear() === year;
    });

    const tareasFiltradas = (tareasExpress || []).filter(tarea => {
      const fecha = new Date(tarea.fechaEntrada);
      return fecha.getMonth() === month && fecha.getFullYear() === year;
    });

    return {
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
  } catch (error) {
    console.error('Error getting all data for report:', error);
    return null;
  }
};