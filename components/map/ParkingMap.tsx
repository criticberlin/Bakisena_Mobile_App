// ParkingMap.tsx
// This is the main entry point for the parking map component
// The actual implementation is in ParkingMap.web.tsx and ParkingMap.native.tsx
// React Native will automatically choose the right one based on platform

// Import types and constants from shared file
import { ParkingMapProps, ParkingSpot, cairoParkingSpots, COLORS } from './constants';

// Re-export everything from constants for components that import from ParkingMap
export { ParkingMapProps, ParkingSpot, cairoParkingSpots, COLORS };

// Import platform-specific components
import { Platform } from 'react-native';
import ParkingMapNative from './ParkingMap.native';
import ParkingMapWeb from './ParkingMap.web';

// Export the appropriate component based on platform
export default Platform.OS === 'web' ? ParkingMapWeb : ParkingMapNative;