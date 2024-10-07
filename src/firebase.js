// Import des fonctions nécessaires de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Ajoutez cette ligne
import { doc, getDoc, setDoc, increment } from 'firebase/firestore'; // Ajout de la fonction pour le compteur de devis

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

// Définition des fonctions getNextDevisNumber et getLastDevisNumber
const getNextDevisNumber = async () => {
  const counterRef = doc(db, 'counters', 'devis');
  const counterSnap = await getDoc(counterRef);
  
  if (!counterSnap.exists()) {
    // Initialiser le compteur s'il n'existe pas
    await setDoc(counterRef, { count: 1 });
    return 1;
  } else {
    // Incrémenter le compteur
    await setDoc(counterRef, { count: increment(1) }, { merge: true });
    return counterSnap.data().count + 1;
  }
};

const getLastDevisNumber = async () => {
  const counterRef = doc(db, 'counters', 'devis');
  const counterSnap = await getDoc(counterRef);
  
  if (!counterSnap.exists()) {
    return 0;
  }
  
  return counterSnap.data().count;
};

// Export des éléments nécessaires
export { app, db, storage, analytics, auth, getNextDevisNumber, getLastDevisNumber };