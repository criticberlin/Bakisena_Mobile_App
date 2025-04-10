import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated, 
  Platform,
  ScrollView,
  Image
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ParkingMapProps, cairoParkingSpots, COLORS, ParkingSpot } from './constants';

// Map style to make it look modern
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

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

// Native implementation of ParkingMap
const ParkingMap: React.FC<ParkingMapProps> = ({
  initialRegion = defaultRegion,
  parkingSpots = cairoParkingSpots,
  onSpotPress,
  onReserveSpot,
  userLocation = { latitude: 30.0454, longitude: 31.2347 }, // Default user location
  entryTime = defaultEntryTime,
  estimatedExitTime = defaultExitTime,
  isRealTime = true,
  onZoomIn,
  onZoomOut,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeTab, setActiveTab] = useState('Parking');
  const mapRef = useRef<MapView>(null);
  
  // Function to handle spot selection
  const handleSpotPress = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    if (onSpotPress) {
      onSpotPress(spot);
    }
  };
  
  // Function to reserve a spot
  const handleReserveSpot = (spot: ParkingSpot) => {
    if (onReserveSpot) {
      onReserveSpot(spot);
    }
  };
  
  // Functions to handle zoom
  const handleZoomIn = () => {
    if (mapRef.current && mapReady) {
      const region = {
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta / 2,
        longitudeDelta: initialRegion.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(region, 300);
    }
    if (onZoomIn) {
      onZoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef.current && mapReady) {
      const region = {
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta * 2,
        longitudeDelta: initialRegion.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(region, 300);
    }
    if (onZoomOut) {
      onZoomOut();
    }
  };

  // Handle tab navigation
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  // Mock real-time updates for parking spot status
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        // Simulate real-time updates by randomly changing spot status
        if (Math.random() > 0.8) {
          const randomIndex = Math.floor(Math.random() * parkingSpots.length);
          const updatedSpots = [...parkingSpots];
          updatedSpots[randomIndex] = {
            ...updatedSpots[randomIndex],
            status: updatedSpots[randomIndex].status === 'available' ? 'reserved' : 'available'
          };
          // We would typically update the spots here through a prop or context
        }
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isRealTime, parkingSpots]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Smart Parking System</Text>
      </View>
      
      {/* Parking Info Banner */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Parking dots labeled with a "P"{"\n"}
          are marked as available or reserved
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </View>
      </View>
      
      {/* Main Content - Parking Grid Map */}
      <View style={styles.mapContainer}>
        {/* Option 1: Use a real map with MapView */}
        {Platform.OS !== 'web' && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            onMapReady={() => setMapReady(true)}
          >
            {parkingSpots.map((spot) => (
              <Marker
                key={spot.id}
                coordinate={{
                  latitude: spot.latitude,
                  longitude: spot.longitude,
                }}
                onPress={() => handleSpotPress(spot)}
              >
                <View style={[
                  styles.markerContainer,
                  { backgroundColor: spot.status === 'available' ? COLORS.available : COLORS.reserved }
                ]}>
                  <Text style={styles.markerText}>P</Text>
                </View>
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{spot.name}</Text>
                    <Text style={styles.calloutDetail}>Status: {spot.status}</Text>
                    {spot.floor && <Text style={styles.calloutDetail}>Floor: {spot.floor}</Text>}
                    {spot.price && <Text style={styles.calloutDetail}>Price: ${spot.price}/hr</Text>}
                    {spot.distance && <Text style={styles.calloutDetail}>Distance: {spot.distance} km</Text>}
                    <TouchableOpacity
                      style={[
                        styles.reserveButton,
                        spot.status === 'reserved' && styles.reservedButton
                      ]}
                      onPress={() => handleReserveSpot(spot)}
                      disabled={spot.status === 'reserved'}
                    >
                      <Text style={styles.reserveButtonText}>
                        {spot.status === 'available' ? 'Reserve' : 'Reserved'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            ))}
            {/* User location marker */}
            <Marker
              coordinate={userLocation}
            >
              <View style={styles.userMarker}>
                <Ionicons name="car" size={20} color="white" />
              </View>
            </Marker>
          </MapView>
        )}
        
        {/* Option 2: Simplified Grid View (similar to image) */}
        {Platform.OS === 'web' && (
          <View style={styles.gridContainer}>
            <View style={styles.parkingGrid}>
              {/* Row 1 */}
              <View style={styles.gridRow}>
                <View style={styles.gridCell} />
                <View style={[styles.parkingSpot, styles.availableSpot]}>
                  <Text style={styles.spotLabel}>P</Text>
                </View>
                <View style={styles.gridCell} />
                <View style={[styles.parkingSpot, styles.availableSpot]}>
                  <Text style={styles.spotLabel}>P</Text>
                </View>
                <View style={styles.gridCell} />
              </View>
              
              {/* Row 2 */}
              <View style={styles.gridRow}>
                <View style={styles.gridCell} />
                <View style={styles.gridCell} />
                <View style={styles.userLocation}>
                  <Ionicons name="car" size={22} color="#333" />
                </View>
                <View style={styles.gridCell} />
                <View style={styles.gridCell} />
              </View>
              
              {/* Row 3 */}
              <View style={styles.gridRow}>
                <View style={[styles.parkingSpot, styles.availableSpot]}>
                  <Text style={styles.spotLabel}>P</Text>
                </View>
                <View style={styles.gridCell} />
                <View style={styles.gridCell} />
                <View style={styles.gridCell} />
                <View style={[styles.parkingSpot, styles.availableSpot]}>
                  <Text style={styles.spotLabel}>P</Text>
                </View>
              </View>
              
              {/* Row 4 */}
              <View style={styles.gridRow}>
                <View style={styles.gridCell} />
                <View style={[styles.parkingSpot, styles.reservedSpot]}>
                  <Text style={styles.spotLabel}>P</Text>
                </View>
                <View style={styles.gridCell} />
                <View style={[styles.parkingSpot, styles.reservedSpot]}>
                  <Text style={styles.spotLabel}>P</Text>
                </View>
                <View style={styles.gridCell} />
              </View>
            </View>
          </View>
        )}
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleZoomIn}
          >
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleZoomOut}
          >
            <Ionicons name="remove" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Features Bar */}
      <View style={styles.featuresBar}>
        <View style={styles.featureItem}>
          <Ionicons name="bookmark" size={18} color="white" />
          <Text style={styles.featureText}>Reserve Your Spot: Allows{"\n"}users to pre-book a parking space.</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="time" size={18} color="white" />
          <Text style={styles.featureText}>Entry Time: Shows{"\n"}expected entry time.</Text>
        </View>
      </View>
      
      {/* Time Information */}
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeInfoSection}>
          <Ionicons name="arrow-up" size={18} color="black" />
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
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'Monitor' && styles.activeNavButton]}
          onPress={() => handleTabPress('Monitor')}
        >
          <Ionicons 
            name="car" 
            size={24} 
            color={activeTab === 'Monitor' ? "white" : "#94A3B8"} 
          />
          <Text style={[styles.navButtonText, activeTab === 'Monitor' && styles.activeNavText]}>
            Monitor
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'Parking' && styles.activeNavButton]}
          onPress={() => handleTabPress('Parking')}
        >
          <Ionicons 
            name="compass" 
            size={24} 
            color={activeTab === 'Parking' ? "white" : "#94A3B8"} 
          />
          <Text style={[styles.navButtonText, activeTab === 'Parking' && styles.activeNavText]}>
            Parking
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'Connected' && styles.activeNavButton]}
          onPress={() => handleTabPress('Connected')}
        >
          <Ionicons 
            name="link" 
            size={24} 
            color={activeTab === 'Connected' ? "white" : "#94A3B8"} 
          />
          <Text style={[styles.navButtonText, activeTab === 'Connected' && styles.activeNavText]}>
            Connected
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'Account' && styles.activeNavButton]}
          onPress={() => handleTabPress('Account')}
        >
          <Ionicons 
            name="person" 
            size={24} 
            color={activeTab === 'Account' ? "white" : "#94A3B8"} 
          />
          <Text style={[styles.navButtonText, activeTab === 'Account' && styles.activeNavText]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Adjust sizes based on screen dimensions for responsiveness
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Based on standard iPhone dimensions

const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(Platform.OS === 'ios' ? newSize : newSize - 2);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: COLORS.white,
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
    color: COLORS.white,
    fontSize: 12,
  },
  arrowContainer: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15,
    margin: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.black,
  },
  calloutDetail: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 3,
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  reservedButton: {
    backgroundColor: COLORS.disabled,
  },
  reserveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  gridContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  gridCell: {
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  availableSpot: {
    backgroundColor: COLORS.available,
  },
  reservedSpot: {
    backgroundColor: COLORS.reserved,
  },
  spotLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userLocation: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
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
  featuresBar: {
    backgroundColor: 'rgba(30, 58, 138, 0.9)',
    margin: 10,
    marginTop: 0,
    borderRadius: 8,
    padding: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  featureText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 8,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeNavButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  navButtonText: {
    color: COLORS.subtext,
    fontSize: 12,
    marginTop: 5,
  },
  activeNavText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default ParkingMap; 