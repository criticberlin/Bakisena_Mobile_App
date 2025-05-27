import { auth, firestore } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { Vehicle } from '../types';

export const vehicleService = {
  // Get all vehicles for current user
  async getUserVehicles(): Promise<Vehicle[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];
    
    try {
      const vehiclesQuery = query(
        collection(firestore, 'vehicles'),
        where('userId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(vehiclesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Vehicle);
    } catch (error) {
      console.error('Error getting user vehicles:', error);
      throw error;
    }
  },
  
  // Add a new vehicle
  async addVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      const vehicleWithUser = {
        ...vehicleData,
        userId: currentUser.uid,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(firestore, 'vehicles'), vehicleWithUser);
      return docRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  },
  
  // Update a vehicle
  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      await updateDoc(doc(firestore, 'vehicles', id), {
        ...vehicleData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },
  
  // Delete a vehicle
  async deleteVehicle(id: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      await deleteDoc(doc(firestore, 'vehicles', id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
}; 