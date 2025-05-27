import { collection, doc, getDocs, getDoc, updateDoc, query, where, orderBy, Timestamp, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ParkingSlot, ParkingSection, ParkingLevel, ParkingLocation } from '../types';

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
}

export const parkingService = new ParkingService(); 