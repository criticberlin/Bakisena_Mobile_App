import { db } from '../config/firebase';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Generic type for document data
interface DocumentData {
  [key: string]: any;
}

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Try to write a test document
    const testDoc = await db.collection('test').add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      test: true
    });
    
    // Try to read it back
    const doc = await testDoc.get();
    
    // Delete the test document
    await testDoc.delete();
    
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

// Create a new document
export const createDocument = async (collection: string, data: DocumentData) => {
  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async (collection: string, docId: string) => {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collection: string, docId: string, data: DocumentData) => {
  try {
    await db.collection(collection).doc(docId).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collection: string, docId: string) => {
  try {
    await db.collection(collection).doc(docId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Get all documents in a collection
export const getCollection = async (collection: string) => {
  try {
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
};

// Query documents with filters
export const queryDocuments = async (
  collection: string,
  field: string,
  operator: FirebaseFirestoreTypes.WhereFilterOp,
  value: any
) => {
  try {
    const snapshot = await db.collection(collection)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}; 