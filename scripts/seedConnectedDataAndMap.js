// This script seeds sample data for connected devices, parking statistics, notifications, and parking spots
// Run with: node scripts/seedConnectedDataAndMap.js

const { firestore } = require('../config/firebase');
const { 
  collection,
  doc, 
  setDoc, 
  serverTimestamp 
} = require('firebase/firestore');

// Sample data for parking statistics
const parkingStatisticsSample = {
  current: {
    totalSpaces: 120,
    occupiedSpaces: 78,
    reservedSpaces: 12,
    availableSpaces: 30,
    lastUpdated: new Date().toISOString()
  },
  usage: {
    peakHours: '08:00 - 10:00, 17:00 - 19:00',
    occupancyRate: '65%',
    averageDuration: 3.2
  }
};

// Sample notifications data
const notificationsSample = [
  {
    id: 'notification1',
    message: 'New parking promotions available!',
    timestamp: new Date(),
    read: false,
    type: 'parking'
  },
  {
    id: 'notification2',
    message: 'Your reservation is about to expire',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: false,
    type: 'parking'
  }
];

// Sample connected devices data - for a demo user
const DEMO_USER_ID = "demoUserId123"; // You need to replace this with an actual userId

const connectedDevicesSample = [
  {
    id: 'device1',
    name: 'Tesla Model 3',
    type: 'vehicle',
    status: 'connected',
    lastConnected: new Date().toISOString(),
    isActive: true,
    userId: DEMO_USER_ID
  },
  {
    id: 'device2',
    name: 'Home Smart System',
    type: 'smart_home',
    status: 'connected',
    lastConnected: new Date().toISOString(),
    isActive: true,
    userId: DEMO_USER_ID
  },
  {
    id: 'device3',
    name: 'Apple Pay',
    type: 'payment',
    status: 'disconnected',
    lastConnected: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isActive: false,
    userId: DEMO_USER_ID
  },
  {
    id: 'device4',
    name: 'Apple Watch',
    type: 'wearable',
    status: 'connected',
    lastConnected: new Date().toISOString(),
    isActive: true,
    userId: DEMO_USER_ID
  }
];

// Sample parking spots data for the map
const parkingSpotsSample = [
  {
    id: 'spot1',
    name: 'Downtown A1',
    latitude: 30.0444,
    longitude: 31.2357,
    status: 'available',
    floor: 1,
    price: 15,
    distance: '0.2km',
    availableSpots: 45
  },
  {
    id: 'spot2',
    name: 'Mall Parking B2',
    latitude: 30.0484,
    longitude: 31.2387,
    status: 'available',
    floor: 2,
    price: 20,
    distance: '1.5km',
    availableSpots: 120
  },
  {
    id: 'spot3',
    name: 'Airport Long-term',
    latitude: 30.1114,
    longitude: 31.3997,
    status: 'available',
    floor: 1,
    price: 25,
    distance: '3.8km',
    availableSpots: 200
  },
  {
    id: 'spot4',
    name: 'City Center A4',
    latitude: 30.0464,
    longitude: 31.2347,
    status: 'occupied',
    floor: 1,
    price: 18,
    distance: '0.5km',
    availableSpots: 12
  },
  {
    id: 'spot5',
    name: 'Tahrir Square P1',
    latitude: 30.0444,
    longitude: 31.2337,
    status: 'available',
    floor: 2,
    price: 22,
    distance: '0.8km',
    availableSpots: 35
  }
];

// Function to seed data
async function seedData() {
  try {
    console.log('Seeding parking statistics...');
    
    // Set parking statistics
    await setDoc(doc(firestore, 'parkingStatistics', 'current'), parkingStatisticsSample.current);
    await setDoc(doc(firestore, 'parkingStatistics', 'usage'), parkingStatisticsSample.usage);
    console.log('Added parking statistics');
    
    // Set notifications
    console.log('Seeding notifications...');
    for (const notification of notificationsSample) {
      await setDoc(doc(firestore, 'notifications', notification.id), {
        ...notification,
        timestamp: serverTimestamp()
      });
      console.log(`Added notification: ${notification.id}`);
    }
    
    // Set connected devices (if demo user ID is valid)
    console.log('Seeding connected devices...');
    for (const device of connectedDevicesSample) {
      await setDoc(doc(firestore, 'connectedDevices', device.id), device);
      console.log(`Added connected device: ${device.name}`);
    }
    
    // Set parking spots
    console.log('Seeding parking spots...');
    for (const spot of parkingSpotsSample) {
      await setDoc(doc(firestore, 'parkingSpots', spot.id), spot);
      console.log(`Added parking spot: ${spot.name}`);
    }
    
    console.log('Data seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seeding function
seedData(); 