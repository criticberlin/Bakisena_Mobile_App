import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  projectId: 'bakisena-8a91e',
  storageBucket: 'bakisena-8a91e.firebasestorage.app',
  apiKey: 'AIzaSyCIIWViiRz164iMQkaNQ4LoItfcXXTjeXM',
  appId: '1:111841920377:android:26e5355a2260aeee7c9ba8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 