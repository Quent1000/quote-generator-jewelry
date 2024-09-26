// Import des fonctions nécessaires de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Ajoutez cette ligne

// Configuration de votre application Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHwK9ltB-ycCsBi4glVy82spVRNDoC4HY",
  authDomain: "devisapp-43162.firebaseapp.com",
  projectId: "devisapp-43162",
  storageBucket: "devisapp-43162.appspot.com",
  messagingSenderId: "660741441802",
  appId: "1:660741441802:web:cf4dcd6d0a515e72de92f3",
  measurementId: "G-9RRZJDT7PS"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Firestore
const db = getFirestore(app);

// Initialisation de Storage
const storage = getStorage(app);

// Initialisation de Analytics
const analytics = getAnalytics(app);

// Initialisation de Auth
const auth = getAuth(app); // Ajoutez cette ligne

// Export des éléments nécessaires
export { app, db, storage, analytics, auth }; // Ajoutez auth à l'export