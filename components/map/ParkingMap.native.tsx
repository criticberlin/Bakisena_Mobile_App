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
import { BlurView } from 'expo-blur';
import { ParkingMapProps, cairoParkingSpots, COLORS, ParkingSpot } from './constants';

// Map style to make it look modern and dark
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
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
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
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
  const [activeTab, setActiveTab] = useState('map');
  const mapRef = useRef<MapView>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
  
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
      {/* Modern Header with Blur Effect */}
      <View style={styles.headerContainer}>
        <BlurView intensity={30} tint="dark" style={styles.headerBlur}>
          <Text style={styles.headerTitle}>Smart Parking</Text>
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={26} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="settings-outline" size={26} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
      
      {/* Parking Status Card */}
      <View style={styles.statusCardContainer}>
        <BlurView intensity={20} tint="dark" style={styles.statusCard}>
          <View style={styles.statusCardContent}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Entry Time</Text>
              <Text style={styles.statusValue}>{entryTime}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Exit Time</Text>
              <Text style={styles.statusValue}>{estimatedExitTime}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Live</Text>
              </View>
            </View>
          </View>
        </BlurView>
      </View>
      
      {/* Main Content - Parking Map */}
      <View style={styles.mapContainer}>
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
                  spot.status === 'available' ? styles.availableMarker : styles.reservedMarker
                ]}>
                  <Text style={styles.markerText}>P</Text>
                </View>
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{spot.name || `Spot ${spot.id}`}</Text>
                    <View style={styles.calloutStatusContainer}>
                      <View style={[
                        styles.calloutStatusIndicator, 
                        { backgroundColor: spot.status === 'available' ? COLORS.success : COLORS.accent }
                      ]} />
                      <Text style={styles.calloutStatus}>
                        {spot.status === 'available' ? 'Available' : 'Reserved'}
                      </Text>
                    </View>
                    
                    <View style={styles.calloutDetailsGrid}>
                      {spot.floor && (
                        <View style={styles.calloutDetailItem}>
                          <Ionicons name="layers-outline" size={16} color={COLORS.subtext} />
                          <Text style={styles.calloutDetail}>Floor {spot.floor}</Text>
                        </View>
                      )}
                      
                      {spot.price && (
                        <View style={styles.calloutDetailItem}>
                          <Ionicons name="cash-outline" size={16} color={COLORS.subtext} />
                          <Text style={styles.calloutDetail}>${spot.price}/hr</Text>
                        </View>
                      )}
                      
                      {spot.distance && (
                        <View style={styles.calloutDetailItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.subtext} />
                          <Text style={styles.calloutDetail}>{spot.distance} km</Text>
                        </View>
                      )}
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.reserveButton,
                        spot.status === 'reserved' && styles.reservedButton
                      ]}
                      onPress={() => handleReserveSpot(spot)}
                      disabled={spot.status === 'reserved'}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reserveButtonText}>
                        {spot.status === 'available' ? 'Reserve Spot' : 'Already Reserved'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            ))}
            
            {/* User location marker */}
            <Marker coordinate={userLocation}>
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
                <View style={styles.userMarkerRing} />
              </View>
            </Marker>
          </MapView>
        )}
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleZoomIn}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleZoomOut}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => mapRef.current?.animateToRegion(initialRegion, 500)}
            activeOpacity={0.7}
          >
            <Ionicons name="locate" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <BlurView intensity={20} tint="dark" style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.available }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.reserved }]} />
              <Text style={styles.legendText}>Reserved</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={styles.userMarkerDot} />
              <Text style={styles.legendText}>Your Location</Text>
            </View>
          </BlurView>
        </View>
      </View>
      
      {/* Bottom Action Button */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => {
            if (selectedSpot) {
              handleReserveSpot(selectedSpot);
            } else {
              // Show a message or navigate to spot selection
              handleTabPress('list');
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {selectedSpot ? 'Reserve Selected Spot' : 'Find Available Spot'}
          </Text>
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    zIndex: 10,
    width: '100%',
    overflow: 'hidden',
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusCardContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: 16,
  },
  statusCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(42, 42, 79, 0.6)',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(249, 178, 51, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  statusBadgeText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  availableMarker: {
    backgroundColor: COLORS.available,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  reservedMarker: {
    backgroundColor: COLORS.reserved,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  markerText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.background,
  },
  calloutContainer: {
    width: 220,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  calloutStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calloutStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  calloutStatus: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  calloutDetailsGrid: {
    marginBottom: 12,
  },
  calloutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  calloutDetail: {
    fontSize: 14,
    color: COLORS.subtext,
    marginLeft: 8,
  },
  reserveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  reservedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  reserveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  userMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userMarkerRing: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.5,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -75 }],
    backgroundColor: 'rgba(42, 42, 79, 0.8)',
    borderRadius: 16,
    padding: 8,
    elevation: 5,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 150,
    left: 16,
    right: 16,
    overflow: 'hidden',
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(42, 42, 79, 0.6)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  legendText: {
    color: COLORS.text,
    fontSize: 12,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  actionButton: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ParkingMap; 