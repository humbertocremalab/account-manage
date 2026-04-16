import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCi3nxC2c8Sp4JAs9ylU4uxVagVXToP8HM",
  authDomain: "accountmatrixhub.firebaseapp.com",
  projectId: "accountmatrixhub",
  storageBucket: "accountmatrixhub.firebasestorage.app",
  messagingSenderId: "912278749399",
  appId: "1:912278749399:web:f6c4f8f575b01243d2b092",
  measurementId: "G-TLQ1WDTS38"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;