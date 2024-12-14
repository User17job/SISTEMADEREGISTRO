import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cargar variables de entorno
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKs2mby1Q_9DrqALfxVhj7RGMe1sxcukA",
  authDomain: "sistema-de-asistencia-957d3.firebaseapp.com",
  projectId: "sistema-de-asistencia-957d3",
  storageBucket: "sistema-de-asistencia-957d3.firebasestorage.app",
  messagingSenderId: "376203827285",
  appId: "1:376203827285:web:96dcdec8cf6fe45caf9cdc",
  measurementId: "G-PW84237ZWT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
