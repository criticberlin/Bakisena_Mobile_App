import { db } from '../config/firebase';
import { collection, addDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Try to write a test document
    const testDoc = await addDoc(collection(db, 'test'), {
      timestamp: serverTimestamp(),
      test: true
    });
    
    // Try to read it back
    const doc = await getDoc(testDoc);
    
    // Delete the test document
    await deleteDoc(testDoc);
    
    return {
      success: true,
      message: 'Firebase connection successful',
      docId: doc.id
    };
  } catch (error: any) {
    console.error('Firebase connection test failed:', error);
    return {
      success: false,
      message: error?.message || 'Unknown error occurred',
      error
    };
  }
}; 