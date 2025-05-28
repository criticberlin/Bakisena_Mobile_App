export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  profileImage?: string | null;
  isAdmin?: boolean;
  deleted?: boolean;
}

export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  type: 'CAR' | 'SUV' | 'TRUCK' | 'MOTORCYCLE';
  year?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  slotId: string;
  locationId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  totalCost: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  totalSlots: number;
  availableSlots: number;
  priceRange: {
    min: number;
    max: number;
  };
  operatingHours: {
    open: string;
    close: string;
  };
  amenities: string[];
  images: string[];
  levels?: ParkingLevel[];
}

export interface ParkingLevel {
  id: string;
  name: string;
  number: number;
  locationId: string;
  totalSlots: number;
  availableSlots: number;
  sections?: ParkingSection[];
}

export interface ParkingSection {
  id: string;
  name: string;
  levelId: string;
  totalSlots: number;
  availableSlots: number;
  level: number;
  slots?: ParkingSlot[];
}

export interface ParkingSlot {
  id: string;
  number: string;
  type: 'standard' | 'handicap' | 'electric' | 'vip';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  sectionId: string;
  section: string;
  level: number;
  location: string;
  coordinates: {
    x: number;
    y: number;
  };
  pricePerHour: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  locationId: string;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate: number;
  discountPercent?: number;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  LoginOptions: undefined;
  EditProfile: undefined;
  Settings: undefined;
  About: undefined;
  MyVehicles: undefined;
  PaymentMethods: undefined;
  PastBookings: undefined;
  UserDashboard: undefined;
  AdminDashboard: undefined;
  Home: undefined;
  Parking: undefined;
  Monitor: undefined;
  Account: undefined;
  Connected: undefined;
  PricesPage: undefined;
  SlotManagement: undefined;
  UserManagement: undefined;
  Reports: undefined;
  ParkingManagement: undefined;
  MakeReservation: undefined;
  BookingDetails: { id: string };
  AddVehicle: undefined;
  EditVehicle: { id: string };
  AddPaymentMethod: undefined;
  SelectLocation: undefined;
  SelectSlot: { locationId: string };
  SelectVehicle: { locationId: string, slotId: string };
  SelectDateTime: { locationId: string, slotId: string, vehicleId: string };
  PaymentConfirmation: { bookingData: Partial<Reservation> };
  SuccessPage: { bookingId: string };
}; 