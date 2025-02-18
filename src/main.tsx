
import { createRoot } from 'react-dom/client';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import App from './App';
import './index.css';

// Fonction pour initialiser l'application
const initializeApp = () => {
  const root = createRoot(document.getElementById("root")!);
  
  // Attendre que Firebase Auth soit initialisé
  const unsubscribe = onAuthStateChanged(auth, () => {
    unsubscribe(); // Se désabonner après la première initialisation
    root.render(<App />);
  });
};

// Démarrer l'initialisation
initializeApp();
