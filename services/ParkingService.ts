import { collection, doc, getDocs, getDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ParkingSlot, ParkingSection, ParkingLevel, ParkingLocation } from '../types';

class ParkingService {
  private readonly SLOTS_COLLECTION = 'parkingSlots';
  private readonly SECTIONS_COLLECTION = 'parkingSections';
  private readonly LEVELS_COLLECTION = 'parkingLevels';
  private readonly LOCATIONS_COLLECTION = 'parkingLocations';

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
}

export const parkingService = new ParkingService(); 