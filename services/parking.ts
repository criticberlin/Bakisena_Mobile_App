import { auth, firestore } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { 
  ParkingLocation, 
  ParkingLevel, 
  ParkingSection, 
  ParkingSlot 
} from '../types';

export const parkingService = {
  // Get all parking locations
  async getParkingLocations(): Promise<ParkingLocation[]> {
    try {
      const locationsQuery = query(
        collection(firestore, 'parkingLocations'),
        orderBy('name')
      );
      
      const snapshot = await getDocs(locationsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ParkingLocation);
    } catch (error) {
      console.error('Error getting parking locations:', error);
      throw error;
    }
  },
  
  // Get popular parking locations
  async getPopularLocations(count: number = 3): Promise<ParkingLocation[]> {
    try {
      // This would normally be based on booking frequency, ratings, etc.
      // For now, we'll just return the first few locations
      const locationsQuery = query(
        collection(firestore, 'parkingLocations'),
        orderBy('name'),
        limit(count)
      );
      
      const snapshot = await getDocs(locationsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ParkingLocation);
    } catch (error) {
      console.error('Error getting popular locations:', error);
      throw error;
    }
  },
  
  // Get a single parking location by ID
  async getParkingLocation(id: string): Promise<ParkingLocation | null> {
    try {
      const locationDoc = await getDoc(doc(firestore, 'parkingLocations', id));
      
      if (locationDoc.exists()) {
        return { id: locationDoc.id, ...locationDoc.data() } as ParkingLocation;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting parking location:', error);
      throw error;
    }
  },
  
  // Get parking levels for a location
  async getParkingLevels(locationId: string): Promise<ParkingLevel[]> {
    try {
      const levelsQuery = query(
        collection(firestore, 'parkingLevels'),
        where('locationId', '==', locationId),
        orderBy('number')
      );
      
      const snapshot = await getDocs(levelsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ParkingLevel);
    } catch (error) {
      console.error('Error getting parking levels:', error);
      throw error;
    }
  },
  
  // Get parking sections for a level
  async getParkingSections(levelId: string): Promise<ParkingSection[]> {
    try {
      const sectionsQuery = query(
        collection(firestore, 'parkingSections'),
        where('levelId', '==', levelId),
        orderBy('name')
      );
      
      const snapshot = await getDocs(sectionsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ParkingSection);
    } catch (error) {
      console.error('Error getting parking sections:', error);
      throw error;
    }
  },
  
  // Get parking slots for a section
  async getParkingSlots(sectionId: string): Promise<ParkingSlot[]> {
    try {
      const slotsQuery = query(
        collection(firestore, 'parkingSlots'),
        where('sectionId', '==', sectionId),
        orderBy('number')
      );
      
      const snapshot = await getDocs(slotsQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastUpdated: data.lastUpdated instanceof Timestamp ? 
            data.lastUpdated.toDate() : data.lastUpdated,
          createdAt: data.createdAt instanceof Timestamp ? 
            data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? 
            data.updatedAt.toDate() : data.updatedAt
        } as ParkingSlot;
      });
    } catch (error) {
      console.error('Error getting parking slots:', error);
      throw error;
    }
  },
  
  // Get available parking slots for a location
  async getAvailableSlots(locationId: string): Promise<ParkingSlot[]> {
    try {
      const slotsQuery = query(
        collection(firestore, 'parkingSlots'),
        where('location', '==', locationId),
        where('status', '==', 'available'),
        orderBy('number')
      );
      
      const snapshot = await getDocs(slotsQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastUpdated: data.lastUpdated instanceof Timestamp ? 
            data.lastUpdated.toDate() : data.lastUpdated,
          createdAt: data.createdAt instanceof Timestamp ? 
            data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? 
            data.updatedAt.toDate() : data.updatedAt
        } as ParkingSlot;
      });
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  },
  
  // Get parking slot statistics for a location
  async getSlotStatistics(locationId: string): Promise<{ 
    available: number, 
    occupied: number, 
    reserved: number, 
    maintenance: number, 
    total: number 
  }> {
    try {
      // Get the location first to get the total slots
      const location = await this.getParkingLocation(locationId);
      const totalSlots = location?.totalSlots || 0;
      
      // Query for different slot statuses
      const availableQuery = query(
        collection(firestore, 'parkingSlots'),
        where('location', '==', locationId),
        where('status', '==', 'available')
      );
      
      const occupiedQuery = query(
        collection(firestore, 'parkingSlots'),
        where('location', '==', locationId),
        where('status', '==', 'occupied')
      );
      
      const reservedQuery = query(
        collection(firestore, 'parkingSlots'),
        where('location', '==', locationId),
        where('status', '==', 'reserved')
      );
      
      const maintenanceQuery = query(
        collection(firestore, 'parkingSlots'),
        where('location', '==', locationId),
        where('status', '==', 'maintenance')
      );
      
      // Get the counts
      const availableSnapshot = await getDocs(availableQuery);
      const occupiedSnapshot = await getDocs(occupiedQuery);
      const reservedSnapshot = await getDocs(reservedQuery);
      const maintenanceSnapshot = await getDocs(maintenanceQuery);
      
      return {
        available: availableSnapshot.size,
        occupied: occupiedSnapshot.size,
        reserved: reservedSnapshot.size,
        maintenance: maintenanceSnapshot.size,
        total: totalSlots
      };
    } catch (error) {
      console.error('Error getting slot statistics:', error);
      throw error;
    }
  }
}; 