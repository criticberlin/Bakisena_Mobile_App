import { db } from '../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const initializeParkingData = async () => {
  try {
    // Create a test location
    const locationRef = doc(collection(db, 'parking_locations'), 'loc1');
    await setDoc(locationRef, {
      name: 'Cairo Festival City',
      address: '5th Settlement, New Cairo',
      coordinates: {
        latitude: 30.0286,
        longitude: 31.4121,
      },
      totalSlots: 100,
      availableSlots: 60,
      priceRange: {
        min: 10,
        max: 30,
      },
      operatingHours: {
        open: '06:00',
        close: '00:00',
      },
      amenities: ['Security', 'CCTV', 'Lighting'],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create test levels with equal distribution
    const levels = [
      {
        id: 'level1',
        name: 'Ground Floor',
        number: 1,
        totalSlots: 50,
        availableSlots: 30
      },
      {
        id: 'level2',
        name: 'First Floor',
        number: 2,
        totalSlots: 50,
        availableSlots: 30
      }
    ];

    for (const level of levels) {
      const levelRef = doc(collection(db, 'parking_levels'), level.id);
      await setDoc(levelRef, {
        ...level,
        locationId: 'loc1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Create test sections with equal distribution
    const sections = [
      {
        id: 'section1',
        name: 'Section A',
        levelId: 'level1',
        totalSlots: 25,
        availableSlots: 15
      },
      {
        id: 'section2',
        name: 'Section B',
        levelId: 'level1',
        totalSlots: 25,
        availableSlots: 15
      },
      {
        id: 'section3',
        name: 'Section A',
        levelId: 'level2',
        totalSlots: 25,
        availableSlots: 15
      },
      {
        id: 'section4',
        name: 'Section B',
        levelId: 'level2',
        totalSlots: 25,
        availableSlots: 15
      }
    ];

    for (const section of sections) {
      const sectionRef = doc(collection(db, 'parking_sections'), section.id);
      await setDoc(sectionRef, {
        ...section,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Create test slots with consistent numbering
    const createSlotsForSection = (sectionId: string, levelId: string, startNumber: number, count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: `slot_${sectionId}_${i + 1}`,
        sectionId,
        levelId,
        number: `${startNumber + i}`,
        status: i < Math.ceil(count * 0.6) ? 'available' : 'occupied',
        type: i % 10 === 0 ? 'handicap' : i % 5 === 0 ? 'electric' : 'standard',
        coordinates: {
          x: (i % 5) * 2,
          y: Math.floor(i / 5) * 2,
        },
        pricePerHour: 15,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    };

    // Create 25 slots per section (total 100 slots)
    const allSlots = [
      ...createSlotsForSection('section1', 'level1', 101, 25),
      ...createSlotsForSection('section2', 'level1', 126, 25),
      ...createSlotsForSection('section3', 'level2', 201, 25),
      ...createSlotsForSection('section4', 'level2', 226, 25)
    ];

    for (const slot of allSlots) {
      const { id, ...slotData } = slot;
      const slotRef = doc(collection(db, 'parking_slots'), id);
      await setDoc(slotRef, slotData);
    }

    console.log('Successfully initialized parking test data');
    return { success: true };
  } catch (error) {
    console.error('Error initializing parking test data:', error);
    return { success: false, error };
  }
};

export const runInitialization = async () => {
  try {
    const result = await initializeParkingData();
    if (result.success) {
      console.log('✅ Parking data initialization complete');
    } else {
      console.error('❌ Failed to initialize parking data');
    }
  } catch (error) {
    console.error('❌ Error running initialization:', error);
  }
};

// Run the initialization if this file is executed directly
if (require.main === module) {
  runInitialization();
} 