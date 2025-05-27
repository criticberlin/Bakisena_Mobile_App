import { ParkingLocation, ParkingSlot, SlotStatus, PricingPlan, Reservation, Vehicle, User } from '../types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: 'Ahmed Ibrahim',
    email: 'ahmed@example.com',
    phone: '+20123456789',
    isAdmin: false,
  },
  {
    id: 'user2',
    name: 'Fatima Hassan',
    email: 'fatima@example.com',
    phone: '+20111234567',
    isAdmin: true,
  },
];

// Mock Parking Locations
export const MOCK_LOCATIONS: ParkingLocation[] = [
  {
    id: 'loc1',
    name: 'Cairo Festival City',
    address: '5th Settlement, New Cairo',
    totalSlots: 50,
    availableSlots: 12,
    pricePerHour: 20,
    pricePerDay: 150,
    pricePerMonth: 2500,
    coordinates: {
      latitude: 30.0286,
      longitude: 31.4121,
    },
  },
  {
    id: 'loc2',
    name: 'Mall of Egypt',
    address: '6th of October City, Giza',
    totalSlots: 200,
    availableSlots: 85,
    pricePerHour: 15,
    pricePerDay: 120,
    pricePerMonth: 2000,
    coordinates: {
      latitude: 29.9738,
      longitude: 30.9268,
    },
  },
  {
    id: 'loc3',
    name: 'Cairo International Airport',
    address: 'Airport Road, Heliopolis',
    totalSlots: 300,
    availableSlots: 45,
    pricePerHour: 30,
    pricePerDay: 200,
    pricePerMonth: 3000,
    coordinates: {
      latitude: 30.1219,
      longitude: 31.4056,
    },
  },
];

// Mock Parking Slots
export const MOCK_SLOTS: ParkingSlot[] = [
  {
    id: 'slot1',
    locationId: 'loc1',
    slotNumber: 'A-1',
    status: SlotStatus.AVAILABLE,
  },
  {
    id: 'slot2',
    locationId: 'loc1',
    slotNumber: 'A-2',
    status: SlotStatus.OCCUPIED,
    vehicleId: 'vehicle1',
    reservationId: 'res1',
  },
  {
    id: 'slot3',
    locationId: 'loc1',
    slotNumber: 'A-3',
    status: SlotStatus.RESERVED,
    reservationId: 'res2',
  },
  {
    id: 'slot4',
    locationId: 'loc2',
    slotNumber: 'B-1',
    status: SlotStatus.AVAILABLE,
  },
  {
    id: 'slot5',
    locationId: 'loc2',
    slotNumber: 'B-2',
    status: SlotStatus.OUT_OF_SERVICE,
  },
];

// Mock Pricing Plans
export const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan1',
    locationId: 'loc1',
    name: 'Standard',
    hourlyRate: 20,
    dailyRate: 150,
    monthlyRate: 2500,
    isActive: true,
  },
  {
    id: 'plan2',
    locationId: 'loc1',
    name: 'Premium',
    hourlyRate: 30,
    dailyRate: 200,
    monthlyRate: 3000,
    isActive: true,
  },
  {
    id: 'plan3',
    locationId: 'loc2',
    name: 'Economy',
    hourlyRate: 15,
    dailyRate: 120,
    monthlyRate: 2000,
    discountPercent: 10,
    isActive: true,
  },
  {
    id: 'plan4',
    locationId: 'loc3',
    name: 'Long-term',
    hourlyRate: 30,
    dailyRate: 180,
    monthlyRate: 2800,
    discountPercent: 15,
    isActive: true,
  },
];

// Mock Reservations
export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res1',
    userId: 'user1',
    slotId: 'slot2',
    locationId: 'loc1',
    vehicleId: 'vehicle1',
    startTime: '2023-04-07T10:00:00',
    endTime: '2023-04-07T15:00:00',
    status: 'ACTIVE',
    totalCost: 100,
    paymentStatus: 'PAID',
  },
  {
    id: 'res2',
    userId: 'user1',
    slotId: 'slot3',
    locationId: 'loc1',
    vehicleId: 'vehicle2',
    startTime: '2023-04-08T08:00:00',
    endTime: '2023-04-08T12:00:00',
    status: 'ACTIVE',
    totalCost: 80,
    paymentStatus: 'PENDING',
  },
  {
    id: 'res3',
    userId: 'user1',
    slotId: 'slot4',
    locationId: 'loc2',
    vehicleId: 'vehicle1',
    startTime: '2023-04-01T09:00:00',
    endTime: '2023-04-01T14:00:00',
    status: 'COMPLETED',
    totalCost: 75,
    paymentStatus: 'PAID',
  },
];

// Mock Vehicles
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'vehicle1',
    userId: 'user1',
    licensePlate: 'ق أ د 1234',
    make: 'Hyundai',
    model: 'Tucson',
    color: 'White',
    type: 'CAR',
  },
  {
    id: 'vehicle2',
    userId: 'user1',
    licensePlate: 'س ص ع 5678',
    make: 'Nissan',
    model: 'Sunny',
    color: 'Silver',
    type: 'CAR',
  },
]; 