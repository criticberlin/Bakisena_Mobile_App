import { auth, firestore } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Reservation } from '../types';

export const bookingService = {
  // Get all bookings for current user
  async getUserBookings(): Promise<Reservation[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];
    
    try {
      const bookingsQuery = query(
        collection(firestore, 'bookings'),
        where('userId', '==', currentUser.uid),
        orderBy('startTime', 'desc')
      );
      
      const snapshot = await getDocs(bookingsQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore timestamps to strings for consistent format
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime instanceof Timestamp ? 
            data.startTime.toDate().toISOString() : data.startTime,
          endTime: data.endTime instanceof Timestamp ? 
            data.endTime.toDate().toISOString() : data.endTime,
          createdAt: data.createdAt instanceof Timestamp ? 
            data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? 
            data.updatedAt.toDate() : data.updatedAt
        } as Reservation;
      });
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  },
  
  // Get bookings by status
  async getBookingsByStatus(status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): Promise<Reservation[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];
    
    try {
      const bookingsQuery = query(
        collection(firestore, 'bookings'),
        where('userId', '==', currentUser.uid),
        where('status', '==', status),
        orderBy('startTime', 'desc')
      );
      
      const snapshot = await getDocs(bookingsQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime instanceof Timestamp ? 
            data.startTime.toDate().toISOString() : data.startTime,
          endTime: data.endTime instanceof Timestamp ? 
            data.endTime.toDate().toISOString() : data.endTime,
          createdAt: data.createdAt instanceof Timestamp ? 
            data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? 
            data.updatedAt.toDate() : data.updatedAt
        } as Reservation;
      });
    } catch (error) {
      console.error('Error getting bookings by status:', error);
      throw error;
    }
  },
  
  // Cancel a booking
  async cancelBooking(id: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      await updateDoc(doc(firestore, 'bookings', id), {
        status: 'CANCELLED',
        updatedAt: new Date(),
        paymentStatus: 'REFUNDED' // In a real system, this would be a separate flow
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },
  
  // Create a new booking
  async createBooking(bookingData: Omit<Reservation, 'id' | 'userId' | 'status' | 'paymentStatus'>): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      const newBooking = {
        ...bookingData,
        userId: currentUser.uid,
        status: 'ACTIVE',
        paymentStatus: 'PAID',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(firestore, 'bookings'), newBooking);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
}; 