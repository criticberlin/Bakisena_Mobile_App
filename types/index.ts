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
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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
  locationId: string;
  slotNumber: string;
  status: SlotStatus;
  vehicleId?: string;
  reservationId?: string;
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
  ForgotPassword: undefined;
  UserDashboard: undefined;
  AdminDashboard: undefined;
  PricesPage: undefined;
  MakeReservation: undefined;
  PastBookings: undefined;
  EditProfile: undefined;
  SlotManagement: undefined;
  UserManagement: undefined;
  Reports: undefined;
  MainTabs: undefined;
  MyVehicles: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  About: undefined;
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