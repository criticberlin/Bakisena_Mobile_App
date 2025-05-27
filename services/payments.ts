import { auth, firestore } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  writeBatch
} from 'firebase/firestore';

// Payment method interface
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  name: string;
  details: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const paymentService = {
  // Get all payment methods for current user
  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];
    
    try {
      const paymentsQuery = query(
        collection(firestore, 'paymentMethods'),
        where('userId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(paymentsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PaymentMethod);
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  },
  
  // Add a new payment method
  async addPaymentMethod(paymentData: Omit<PaymentMethod, 'id' | 'userId'>): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      // Check if this is the first payment method (make it default)
      const existingMethods = await this.getUserPaymentMethods();
      const isDefault = existingMethods.length === 0;
      
      const paymentWithUser = {
        ...paymentData,
        userId: currentUser.uid,
        isDefault,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(firestore, 'paymentMethods'), paymentWithUser);
      return docRef.id;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },
  
  // Set a payment method as default
  async setDefaultPaymentMethod(id: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      // Get all payment methods for the user
      const methods = await this.getUserPaymentMethods();
      
      // Use a batch to update all methods
      const batch = writeBatch(firestore);
      
      // Set all methods to non-default
      methods.forEach(method => {
        const methodRef = doc(firestore, 'paymentMethods', method.id);
        batch.update(methodRef, { isDefault: method.id === id });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  },
  
  // Delete a payment method
  async deletePaymentMethod(id: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      // Check if this is the default method
      const methodRef = doc(firestore, 'paymentMethods', id);
      const methodSnap = await getDoc(methodRef);
      
      if (methodSnap.exists() && methodSnap.data().isDefault) {
        throw new Error('Cannot delete default payment method');
      }
      
      await deleteDoc(methodRef);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }
}; 