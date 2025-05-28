import { collection, doc, getDocs, getDoc, updateDoc, query, where, orderBy, Timestamp, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { firestore as db } from '../config/firebase';
import { ParkingSlot, ParkingSection, ParkingLevel, ParkingLocation } from '../types';
import { limit } from 'firebase/firestore';

class ParkingService {
  private readonly SLOTS_COLLECTION = 'parking_slots';
  private readonly SECTIONS_COLLECTION = 'parking_sections';
  private readonly LEVELS_COLLECTION = 'parking_levels';
  private readonly LOCATIONS_COLLECTION = 'parking_locations';

  // Get all parking locations
  async getParkingLocations(): Promise<ParkingLocation[]> {
    try {
      const locationsSnapshot = await getDocs(collection(db, this.LOCATIONS_COLLECTION));
      return locationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingLocation[];
    } catch (error) {
      console.error('Error fetching parking locations:', error);
      throw error;
    }
  }

  // Get a specific parking location with all its levels and sections
  async getParkingLocation(locationId: string): Promise<ParkingLocation | null> {
    try {
      const locationDoc = await getDoc(doc(db, this.LOCATIONS_COLLECTION, locationId));
      if (!locationDoc.exists()) return null;

      const location = { id: locationDoc.id, ...locationDoc.data() } as ParkingLocation;
      
      // Get all levels for this location
      const levelsQuery = query(
        collection(db, this.LEVELS_COLLECTION),
        where('locationId', '==', locationId),
        orderBy('number')
      );
      const levelsSnapshot = await getDocs(levelsQuery);
      
      location.levels = await Promise.all(
        levelsSnapshot.docs.map(async levelDoc => {
          const level = { id: levelDoc.id, ...levelDoc.data() } as ParkingLevel;
          
          // Get all sections for this level
          const sectionsQuery = query(
            collection(db, this.SECTIONS_COLLECTION),
            where('levelId', '==', level.id),
            orderBy('name')
          );
          const sectionsSnapshot = await getDocs(sectionsQuery);
          
          level.sections = await Promise.all(
            sectionsSnapshot.docs.map(async sectionDoc => {
              const section = { id: sectionDoc.id, ...sectionDoc.data() } as ParkingSection;
              
              // Get all slots for this section
              const slotsQuery = query(
                collection(db, this.SLOTS_COLLECTION),
                where('sectionId', '==', section.id),
                orderBy('number')
              );
              const slotsSnapshot = await getDocs(slotsQuery);
              
              section.slots = slotsSnapshot.docs.map(slotDoc => ({
                id: slotDoc.id,
                ...slotDoc.data()
              })) as ParkingSlot[];
              
              return section;
            })
          );
          
          return level;
        })
      );
      
      return location;
    } catch (error) {
      console.error('Error fetching parking location:', error);
      throw error;
    }
  }

  // Update slot status
  async updateSlotStatus(slotId: string, status: ParkingSlot['status']): Promise<void> {
    try {
      const slotRef = doc(db, this.SLOTS_COLLECTION, slotId);
      await updateDoc(slotRef, {
        status,
        lastUpdated: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating slot status:', error);
      throw error;
    }
  }

  // Get available slots for a specific location
  async getAvailableSlots(locationId: string): Promise<ParkingSlot[]> {
    try {
      const slotsQuery = query(
        collection(db, this.SLOTS_COLLECTION),
        where('locationId', '==', locationId),
        where('status', '==', 'available')
      );
      const slotsSnapshot = await getDocs(slotsQuery);
      
      return slotsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSlot[];
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  // Get slots by type
  async getSlotsByType(locationId: string, type: ParkingSlot['type']): Promise<ParkingSlot[]> {
    try {
      const slotsQuery = query(
        collection(db, this.SLOTS_COLLECTION),
        where('locationId', '==', locationId),
        where('type', '==', type)
      );
      const slotsSnapshot = await getDocs(slotsQuery);
      
      return slotsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSlot[];
    } catch (error) {
      console.error('Error fetching slots by type:', error);
      throw error;
    }
  }

  // Get slots by level
  async getSlotsByLevel(levelId: string): Promise<ParkingSlot[]> {
    try {
      const slotsQuery = query(
        collection(db, this.SLOTS_COLLECTION),
        where('levelId', '==', levelId)
      );
      const slotsSnapshot = await getDocs(slotsQuery);
      
      return slotsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSlot[];
    } catch (error) {
      console.error('Error fetching slots by level:', error);
      throw error;
    }
  }

  // Get slots by section
  async getSlotsBySection(sectionId: string): Promise<ParkingSlot[]> {
    try {
      const slotsQuery = query(
        collection(db, this.SLOTS_COLLECTION),
        where('sectionId', '==', sectionId)
      );
      const slotsSnapshot = await getDocs(slotsQuery);
      
      return slotsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSlot[];
    } catch (error) {
      console.error('Error fetching slots by section:', error);
      throw error;
    }
  }

  // Add a new location
  async addLocation(locationData: Omit<ParkingLocation, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.LOCATIONS_COLLECTION), {
        ...locationData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  // Add a new level to a location
  async addLevel(levelData: Omit<ParkingLevel, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.LEVELS_COLLECTION), {
        ...levelData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding level:', error);
      throw error;
    }
  }

  // Add a new section to a level
  async addSection(sectionData: Omit<ParkingSection, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.SECTIONS_COLLECTION), {
        ...sectionData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding section:', error);
      throw error;
    }
  }

  // Add a new slot to a section
  async addSlot(slotData: Omit<ParkingSlot, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.SLOTS_COLLECTION), {
        ...slotData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding slot:', error);
      throw error;
    }
  }

  // Update slot type
  async updateSlotType(slotId: string, type: ParkingSlot['type']): Promise<void> {
    try {
      const slotRef = doc(db, this.SLOTS_COLLECTION, slotId);
      await updateDoc(slotRef, {
        type,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating slot type:', error);
      throw error;
    }
  }

  // Get parking statistics
  async getParkingStatistics(): Promise<{
    totalLocations: number;
    totalLevels: number;
    totalSections: number;
    totalSlots: number;
    availableSlots: number;
    occupiedSlots: number;
    reservedSlots: number;
    maintenanceSlots: number;
    slotsByType: Record<ParkingSlot['type'], number>;
  }> {
    try {
      const [locationsSnap, levelsSnap, sectionsSnap, slotsSnap] = await Promise.all([
        getDocs(collection(db, this.LOCATIONS_COLLECTION)),
        getDocs(collection(db, this.LEVELS_COLLECTION)),
        getDocs(collection(db, this.SECTIONS_COLLECTION)),
        getDocs(collection(db, this.SLOTS_COLLECTION))
      ]);

      const slots = slotsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ParkingSlot[];

      return {
        totalLocations: locationsSnap.size,
        totalLevels: levelsSnap.size,
        totalSections: sectionsSnap.size,
        totalSlots: slotsSnap.size,
        availableSlots: slots.filter(s => s.status === 'available').length,
        occupiedSlots: slots.filter(s => s.status === 'occupied').length,
        reservedSlots: slots.filter(s => s.status === 'reserved').length,
        maintenanceSlots: slots.filter(s => s.status === 'maintenance').length,
        slotsByType: {
          standard: slots.filter(s => s.type === 'standard').length,
          handicap: slots.filter(s => s.type === 'handicap').length,
          electric: slots.filter(s => s.type === 'electric').length,
          vip: slots.filter(s => s.type === 'vip').length
        }
      };
    } catch (error) {
      console.error('Error getting parking statistics:', error);
      throw error;
    }
  }

  // Reset all parking data
  async resetParkingData(): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete all existing data
      const [slotsSnap, sectionsSnap, levelsSnap, locationsSnap] = await Promise.all([
        getDocs(collection(db, this.SLOTS_COLLECTION)),
        getDocs(collection(db, this.SECTIONS_COLLECTION)),
        getDocs(collection(db, this.LEVELS_COLLECTION)),
        getDocs(collection(db, this.LOCATIONS_COLLECTION))
      ]);

      slotsSnap.docs.forEach(doc => batch.delete(doc.ref));
      sectionsSnap.docs.forEach(doc => batch.delete(doc.ref));
      levelsSnap.docs.forEach(doc => batch.delete(doc.ref));
      locationsSnap.docs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();
    } catch (error) {
      console.error('Error resetting parking data:', error);
      throw error;
    }
  }

  // Get nearby parking locations based on coordinates
  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusInKm = 5,
    count = 10
  ): Promise<ParkingLocation[]> {
    try {
      const locations = await this.getParkingLocations();
      
      // Sort by a rough approximation of distance
      const sortedLocations = locations.sort((a, b) => {
        const distA = this.calculateDistance(
          latitude, 
          longitude, 
          a.coordinates.latitude, 
          a.coordinates.longitude
        );
        
        const distB = this.calculateDistance(
          latitude, 
          longitude, 
          b.coordinates.latitude, 
          b.coordinates.longitude
        );
        
        return distA - distB;
      });
      
      return sortedLocations.slice(0, count);
    } catch (error) {
      console.error('Failed to get nearby parking locations', error);
      return [];
    }
  }

  /**
   * Calculate rough distance between two coordinates
   * This is a simplified version using the Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Get available locations
   */
  async getAvailableLocations(count = 10): Promise<ParkingLocation[]> {
    try {
      const locations = await this.getParkingLocations();
      return locations
        .filter(location => location.availableSlots > 0)
        .sort((a, b) => b.availableSlots - a.availableSlots)
        .slice(0, count);
    } catch (error) {
      console.error('Failed to get available parking locations', error);
      return [];
    }
  }

  /**
   * Update available slots for a parking location
   */
  async updateAvailableSlots(
    locationId: string,
    availableSlots: number
  ): Promise<boolean> {
    try {
      const locationRef = doc(db, this.LOCATIONS_COLLECTION, locationId);
      await updateDoc(locationRef, { availableSlots });
      return true;
    } catch (error) {
      console.error('Failed to update available slots', error);
      return false;
    }
  }
}

/**
 * Singleton instance of ParkingService
 */
export const parkingService = new ParkingService(); 