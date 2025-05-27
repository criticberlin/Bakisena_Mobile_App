// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

// Parking location types
export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  levels: ParkingLevel[];
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
}

// Parking slot types
export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface ParkingSlot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'standard' | 'handicap' | 'electric' | 'vip';
  level: number;
  section: string;
  coordinates: {
    x: number;
    y: number;
  };
  pricePerHour: number;
  lastUpdated: Date;
  currentBooking?: string; // Booking ID if slot is reserved/occupied
}

export interface ParkingSection {
  id: string;
  name: string;
  level: number;
  totalSlots: number;
  availableSlots: number;
  slots: ParkingSlot[];
}

export interface ParkingLevel {
  id: string;
  number: number;
  name: string;
  sections: ParkingSection[];
  totalSlots: number;
  availableSlots: number;
}

// Reservation types
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
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
}

// Vehicle types
export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  type: 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'OTHER';
}

// Pricing types
export interface PricingPlan {
  id: string;
  locationId: string;
  name: string;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  discountPercent?: number;
  isActive: boolean;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  LoginOptions: undefined;
  Login: undefined;
  Register: undefined;
  UserDashboard: undefined;
  AdminDashboard: undefined;
  UserManagement: undefined;
  SlotManagement: undefined;
  Reports: undefined;
  PricesPage: undefined;
  MainTabs: undefined;
  Settings: undefined;
  EditProfile: undefined;
  MyVehicles: undefined;
  PaymentMethods: undefined;
  PastBookings: undefined;
  About: undefined;
  MakeReservation: undefined;
};

// Component prop types
export interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface ParkingStatusCardProps {
  location: ParkingLocation;
  onPress?: () => void;
}

export interface PricingCardProps {
  plan: PricingPlan;
  onPress?: () => void;
}

export interface ReservationCardProps {
  reservation: Reservation;
  onPress?: () => void;
} 