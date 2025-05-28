// This script seeds sample data for the Bakisena app
// Run with: node scripts/seedData.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwfoy03S86JGRXcUT00Pvn1mnw95QiS7g",
  authDomain: "bakisena-8a91e.firebaseapp.com",
  projectId: "bakisena-8a91e",
  storageBucket: "bakisena-8a91e.appspot.com",
  messagingSenderId: "111841920377",
  appId: "1:111841920377:web:c464b74b5b635cb5de7a99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample parking locations data
const parkingLocations = [
  {
    id: 'loc1',
    name: 'Downtown Parking',
    address: '123 Main St, Cairo',
    coordinates: {
      latitude: 30.0444,
      longitude: 31.2357
    },
    totalSlots: 150,
    availableSlots: 45,
    priceRange: {
      min: 10,
      max: 25
    },
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    amenities: ['Security', 'CCTV', 'EV Charging'],
    images: []
  },
  {
    id: 'loc2',
    name: 'Mall Parking',
    address: '456 Commerce Blvd, Cairo',
    coordinates: {
      latitude: 30.0484,
      longitude: 31.2387
    },
    totalSlots: 300,
    availableSlots: 120,
    priceRange: {
      min: 15,
      max: 30
    },
    operatingHours: {
      open: '09:00',
      close: '23:00'
    },
    amenities: ['Security', 'CCTV', 'Car Wash', 'EV Charging'],
    images: []
  },
  {
    id: 'loc3',
    name: 'Airport Parking',
    address: 'Cairo International Airport',
    coordinates: {
      latitude: 30.1114,
      longitude: 31.3997
    },
    totalSlots: 500,
    availableSlots: 200,
    priceRange: {
      min: 20,
      max: 50
    },
    operatingHours: {
      open: '00:00',
      close: '23:59'
    },
    amenities: ['24/7 Security', 'CCTV', 'Shuttle Service'],
    images: []
  }
];

// Sample pricing plans data
const pricingPlans = [
  {
    id: 'plan1',
    locationId: 'loc1',
    name: 'Standard Hourly',
    hourlyRate: 15,
    dailyRate: 120,
    monthlyRate: 2500,
    isActive: true
  },
  {
    id: 'plan2',
    locationId: 'loc2',
    name: 'Premium Hourly',
    hourlyRate: 20,
    dailyRate: 150,
    monthlyRate: 3000,
    discountPercent: 5,
    isActive: true
  },
  {
    id: 'plan3',
    locationId: 'loc3',
    name: 'Airport Long-term',
    hourlyRate: 25,
    dailyRate: 200,
    monthlyRate: 4000,
    discountPercent: 10,
    isActive: true
  }
];

// Function to seed data
async function seedData() {
  try {
    console.log('Seeding parking locations...');
    for (const location of parkingLocations) {
      await setDoc(doc(db, 'parkingLocations', location.id), location);
      console.log(`Added location: ${location.name}`);
    }

    console.log('Seeding pricing plans...');
    for (const plan of pricingPlans) {
      await setDoc(doc(db, 'pricingPlans', plan.id), plan);
      console.log(`Added pricing plan: ${plan.name}`);
    }

    console.log('Data seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seeding function
seedData(); 