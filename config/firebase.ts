import { initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Firebase Authentication
// For Expo projects, we need to use @react-native-firebase/auth for proper persistence
// Since we're using firebase/auth, we'll use memory persistence for now
const auth = getAuth(app);

// Set persistence to memory persistence as a fallback
// Note: To implement AsyncStorage persistence properly, we would need to use @react-native-firebase/auth
setPersistence(auth, inMemoryPersistence)
  .then(() => {
    console.log('Firebase Auth using memory persistence');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Export auth
export { auth };

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app; 