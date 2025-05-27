import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  projectId: 'bakisena-8a91e',
  storageBucket: 'bakisena-8a91e.firebasestorage.app',
  apiKey: 'AIzaSyCIIWViiRz164iMQkaNQ4LoItfcXXTjeXM',
  appId: '1:111841920377:android:26e5355a2260aeee7c9ba8',
  authDomain: 'bakisena-8a91e.firebaseapp.com',
  messagingSenderId: '111841920377'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// TODO: To resolve the AsyncStorage warning, we need to properly set up persistence
// with AsyncStorage once we have the correct Firebase React Native SDK installed
export const auth = getAuth(app);

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app; 