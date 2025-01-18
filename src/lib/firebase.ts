import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAR1EurRPXs7GzKzf6NobmGDh9d5WqPOCg",
  authDomain: "jobizy-8a101.firebaseapp.com",
  projectId: "jobizy-8a101",
  storageBucket: "jobizy-8a101.firebasestorage.app",
  messagingSenderId: "437915475563",
  appId: "1:437915475563:web:bdb536ce2eef519e2f9b2e",
  measurementId: "G-FET184N9FZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error('Firebase persistence error:', err);
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

export default app;