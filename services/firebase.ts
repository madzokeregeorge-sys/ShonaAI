/**
 * Firebase Configuration for ShonaAI
 * 
 * Firebase API keys are PUBLIC identifiers (not secrets).
 * Security comes from Firebase Security Rules, not key secrecy.
 * The Gemini API key is the only sensitive key — it stays in .env.local
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'shona-ai-official.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'shona-ai-official',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'shona-ai-official.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.warn('Firebase initialization failed:', error);
}

export { auth, db };
export default app!;
