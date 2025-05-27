import firestore from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

// Initialize Firestore with error handling
const initializeFirestore = () => {
  try {
    const db = firestore();
    
    // Set Firestore settings
    db.settings({
      persistence: true,
      cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
    });

    return db;
  } catch (error) {
    console.error('Firestore initialization error:', error);
    throw error;
  }
};

const db = initializeFirestore();

export { db }; 