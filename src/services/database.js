import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';

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
    const docRef = doc(db, METRICS_COLLECTION, `${userId}_${year}_${month}`);
    await setDoc(docRef, { 
      userId,
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

export const loadMetrics = async (userId, month, year) => {
  try {
    const docRef = doc(db, METRICS_COLLECTION, `${userId}_${year}_${month}`);
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

// ============== CHECKLISTS ==============
export const saveChecklists = async (userId, month, year, checklists) => {
  try {
    const docRef = doc(db, CHECKLISTS_COLLECTION, `${userId}_${year}_${month}`);
    await setDoc(docRef, { 
      userId,
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

export const loadChecklists = async (userId, month, year) => {
  try {
    const docRef = doc(db, CHECKLISTS_COLLECTION, `${userId}_${year}_${month}`);
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
      return docSnap.data().data;
    }
    return [];
  } catch (error) {
    console.error('Error loading tareas express:', error);
    return [];
  }
};

// ============== OBTENER TODOS LOS DATOS PARA REPORTE ==============
export const getAllDataForReport = async (userId, month, year) => {
  try {
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

    // ============== GESTIÓN DE USUARIOS ==============
const USER_ROLES_COLLECTION = 'userRoles';

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
    await setDoc(docRef, { role, email, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, USER_ROLES_COLLECTION));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data()
      });
    });
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const deleteUserRole = async (userId) => {
  try {
    const docRef = doc(db, USER_ROLES_COLLECTION, userId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting user role:', error);
    return false;
  }
};

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