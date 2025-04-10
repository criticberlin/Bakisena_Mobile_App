import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Define parking spot data directly instead of importing
const cairoParkingSpots = [
  {
    id: 1,
    latitude: 30.0444,
    longitude: 31.2357,
    status: 'available' as 'available' | 'reserved',
    name: 'Downtown Cairo'
  },
  {
    id: 2,
    latitude: 30.0484,
    longitude: 31.2387,
    status: 'reserved' as 'available' | 'reserved',
    name: 'Cairo Mall'
  },
  {
    id: 3,
    latitude: 30.0404,
    longitude: 31.2327,
    status: 'available' as 'available' | 'reserved',
    name: 'Cairo Station'
  },
  {
    id: 4,
    latitude: 30.0464,
    longitude: 31.2307,
    status: 'available' as 'available' | 'reserved',
    name: 'Cairo Tower'
  },
  {
    id: 5,
    latitude: 30.0424,
    longitude: 31.2417,
    status: 'reserved' as 'available' | 'reserved',
    name: 'City Center'
  }
];

// Define types for props and parking spot data
type ParkingSpot = {
  id: number;
  latitude: number;
  longitude: number;
  status: 'available' | 'reserved';
  name?: string;
};

type ParkingMapProps = {
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

// Default parking spots data - use Cairo parking spots
const defaultParkingSpots: ParkingSpot[] = cairoParkingSpots;

// Default map region - Cairo, Egypt
const defaultRegion = {
  latitude: 30.0444,
  longitude: 31.2357,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Default times
const defaultEntryTime = '10:00 AM';
const defaultExitTime = '01:00 PM';

// Modern color scheme
const COLORS = {
  primary: '#1E3A8A', // Deep blue
  secondary: '#F59E0B', // Amber
  accent: '#3B82F6', // Sky blue
  background: '#0F172A', // Very dark blue
  card: '#1E293B', // Dark slate
  text: '#F1F5F9', // Light gray
  subtext: '#94A3B8', // Slate
  reserved: '#F59E0B', // Amber
  available: '#10B981', // Emerald
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  success: '#10B981', // Emerald
  error: '#EF4444', // Red
  warning: '#F59E0B', // Amber
};

// Map style to make it look like Google Maps but more modern
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

// Native implementation of ParkingMap using react-native-maps
const ParkingMap: React.FC<ParkingMapProps> = ({
  initialRegion = defaultRegion,
  parkingSpots = defaultParkingSpots,
  onSpotPress,
  userLocation = { latitude: 30.0454, longitude: 31.2347 }, // Default user location near the spots
  entryTime = defaultEntryTime,
  estimatedExitTime = defaultExitTime,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Use simplified grid layout rather than actual map
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Smart Parking System</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Parking dots labeled with a "*" are{"\n"}
          marked as available or reserved
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </View>
      </View>
      
      {/* Simplified Parking Grid Map */}
      <View style={styles.parkingGridContainer}>
        <View style={styles.parkingGrid}>
          {/* Row 1 */}
          <View style={styles.gridRow}>
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
          </View>
          
          {/* Row 2 */}
          <View style={styles.gridRow}>
            <View style={styles.emptyGridCell} />
            <View style={[styles.parkingSpot, styles.availableSpot]}>
              <Text style={styles.spotLabel}>P</Text>
            </View>
            <View style={styles.carLocation}>
              <Ionicons name="car" size={22} color="#333" />
            </View>
            <View style={[styles.parkingSpot, styles.availableSpot]}>
              <Text style={styles.spotLabel}>P</Text>
            </View>
            <View style={styles.emptyGridCell} />
          </View>
          
          {/* Row 3 */}
          <View style={styles.gridRow}>
            <View style={[styles.parkingSpot, styles.availableSpot]}>
              <Text style={styles.spotLabel}>P</Text>
            </View>
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
          </View>
          
          {/* Row 4 */}
          <View style={styles.gridRow}>
            <View style={styles.emptyGridCell} />
            <View style={[styles.parkingSpot, styles.reservedSpot]}>
              <Text style={styles.spotLabel}>P</Text>
            </View>
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
          </View>
          
          {/* Row 5 */}
          <View style={styles.gridRow}>
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
            <View style={[styles.parkingSpot, styles.reservedSpot]}>
              <Text style={styles.spotLabel}>P</Text>
            </View>
            <View style={styles.emptyGridCell} />
            <View style={styles.emptyGridCell} />
          </View>
        </View>
        
        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="remove" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Time Information Footer */}
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeInfoSection}>
          <Ionicons name="arrow-up" size={18} color="#333" />
          <Text style={styles.timeInfoLabel}>Entry Time</Text>
          <Text style={styles.timeInfoValue}>{entryTime}</Text>
        </View>
        
        <View style={styles.timeInfoDivider} />
        
        <View style={styles.timeInfoSection}>
          <Text style={styles.timeInfoLabel}>Estimated Exit</Text>
          <Text style={styles.timeInfoValue}>{estimatedExitTime}</Text>
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="car" size={24} color="white" />
          <Text style={styles.navButtonText}>Monitor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="compass" size={24} color="white" />
          <Text style={styles.navButtonText}>Parking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="link" size={24} color="white" />
          <Text style={styles.navButtonText}>Connected</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person" size={24} color="white" />
          <Text style={styles.navButtonText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Adjust sizes based on screen dimensions for responsiveness
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Based on standard iPhone 8 width

const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(newSize);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
  },
  arrowContainer: {
    padding: 5,
  },
  parkingGridContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    margin: 10,
    position: 'relative',
    padding: 10,
  },
  parkingGrid: {
    flex: 1,
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  emptyGridCell: {
    width: 40,
    height: 40,
    margin: 5,
  },
  parkingSpot: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  availableSpot: {
    backgroundColor: '#FFD700',
  },
  reservedSpot: {
    backgroundColor: '#FF9800',
  },
  spotLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carLocation: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  mapControls: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  controlButton: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    marginTop: 0,
    padding: 15,
  },
  timeInfoSection: {
    flex: 1,
    alignItems: 'center',
  },
  timeInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  timeInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeInfoDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
    alignSelf: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  // Preserve any existing styles below
  // ... existing code ...
});

export default ParkingMap; 