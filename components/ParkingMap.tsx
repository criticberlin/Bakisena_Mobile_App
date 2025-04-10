// This is just a basic entry point that defines the types
// The actual implementation is in ParkingMap.web.tsx and ParkingMap.native.tsx
// React Native will automatically choose the right one based on platform

// Define types for props and parking spot data
export type ParkingSpot = {
  id: number;
  latitude: number;
  longitude: number;
  status: 'available' | 'reserved';
  name?: string;
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
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  entryTime?: string;
  estimatedExitTime?: string;
};

// Re-export default from platform-specific files
// React Native's module resolution will handle the extension
export { default } from './ParkingMap.native';