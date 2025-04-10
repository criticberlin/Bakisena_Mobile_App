// Shared types and constants for the parking map components
import theme from '../../theme/theme';

// Define types for props and parking spot data
export type ParkingSpot = {
  id: number;
  latitude: number;
  longitude: number;
  status: 'available' | 'reserved';
  name?: string;
  floor?: string; // Optional floor information
  price?: number; // Optional price information
  distance?: number; // Optional distance from user
};

export type ParkingMapProps = {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  parkingSpots?: ParkingSpot[];
  onSpotPress?: (spot: ParkingSpot) => void;
  onReserveSpot?: (spot: ParkingSpot) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  entryTime?: string;
  estimatedExitTime?: string;
  isRealTime?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onNavigate?: (tab: string) => void;
  themeMode?: 'light' | 'dark'; // Add theme mode to props
  colors?: any; // Add colors to props
};

// Common parking spots data - Cairo parking spots
export const cairoParkingSpots: ParkingSpot[] = [
  {
    id: 1,
    latitude: 30.0444,
    longitude: 31.2357,
    status: 'available',
    name: 'Downtown Cairo',
    floor: 'G',
    price: 15,
    distance: 0.3
  },
  {
    id: 2,
    latitude: 30.0484,
    longitude: 31.2387,
    status: 'reserved',
    name: 'Cairo Mall',
    floor: '1',
    price: 20,
    distance: 0.5
  },
  {
    id: 3,
    latitude: 30.0404,
    longitude: 31.2327,
    status: 'available',
    name: 'Cairo Station',
    floor: 'B1',
    price: 10,
    distance: 0.7
  },
  {
    id: 4,
    latitude: 30.0464,
    longitude: 31.2307,
    status: 'available',
    name: 'Cairo Tower',
    floor: '2',
    price: 25,
    distance: 0.4
  },
  {
    id: 5,
    latitude: 30.0424,
    longitude: 31.2417,
    status: 'reserved',
    name: 'City Center',
    floor: 'G',
    price: 15,
    distance: 0.2
  }
];

// Export theme colors directly
export const COLORS = {
  ...theme.colors,
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
  accent: theme.colors.accent,
  background: theme.colors.background,
  card: theme.colors.surface,
  text: theme.colors.text.primary,
  subtext: theme.colors.text.secondary,
  reserved: theme.colors.accent,
  available: theme.colors.text.secondary,
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  success: theme.colors.success,
  error: theme.colors.error,
  warning: theme.colors.warning,
  disabled: theme.colors.text.disabled,
}; 