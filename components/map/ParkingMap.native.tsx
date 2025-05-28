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
import MapView, { Marker, Callout } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ParkingMapProps, cairoParkingSpots, ParkingSpot } from './constants';
import { useTheme } from '../../theme/ThemeContext';

// Map style to make it look modern and dark
const darkMapStyle = [
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

// Light map style to make the map match the light theme
const lightMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
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
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
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

// Define marker and badge sizes at the top
const MARKER_SIZE = 27; // 36 * 0.75
const BADGE_SIZE = 16;

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
  themeMode = 'dark', // Default to dark mode if not provided
  colors, // Use passed colors if available
}) => {
  // Get theme if not provided through props
  const themeContext = useTheme();
  const currentThemeMode = themeMode || themeContext.themeMode;
  const currentColors = colors || (currentThemeMode === 'dark' ? themeContext.colors.dark : themeContext.colors.light);
  
  // Ensure status colors exist with fallbacks
  const statusColors = {
    available: currentColors?.status?.available || '#00C853',
    reserved: currentColors?.status?.reserved || '#FF9D00'
  };
  
  // Use the appropriate map style based on theme
  const mapStyle = currentThemeMode === 'dark' ? darkMapStyle : lightMapStyle;
  
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
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Main Content - Parking Map */}
      <View style={styles.mapContainer}>
        {Platform.OS !== 'web' && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            // Explicitly use the default provider by not specifying a provider
            customMapStyle={mapStyle}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={true}
            showsIndoors={false}
            loadingEnabled={true}
            onMapReady={() => setMapReady(true)}
            rotateEnabled={true}
            pitchEnabled={true}
          >
            {parkingSpots.map((spot) => (
              <Marker
                key={spot.id}
                coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                onPress={() => handleSpotPress(spot)}
                style={{ width: 44, height: 44 }} // ensure touch area
              >
                <View style={[
                  styles.markerContainer,
                  {
                    width: MARKER_SIZE,
                    height: MARKER_SIZE,
                    borderRadius: MARKER_SIZE / 2,
                    backgroundColor: spot.status === 'available' ? statusColors.available : statusColors.reserved,
                    borderColor: currentColors.secondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                  <Text style={styles.markerText}>P</Text>
                  {spot.status === 'available' && (
                    <View style={[
                      styles.badge,
                      {
                        position: 'absolute',
                        top: -BADGE_SIZE / 2 + 4,
                        right: -BADGE_SIZE / 2 + 4,
                        width: BADGE_SIZE,
                        height: BADGE_SIZE,
                        borderRadius: BADGE_SIZE / 2,
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: statusColors.available,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: statusColors.available }}>{spot.availableSpots ?? 1}</Text>
                    </View>
                  )}
                </View>
                <Callout tooltip>
                  <View style={[
                    styles.calloutContainer, 
                    { 
                      backgroundColor: currentColors.surface,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8 
                    }
                  ]}>
                    <Text style={[
                      styles.calloutTitle,
                      { color: currentColors.text.primary }
                    ]}>{spot.name || `Spot ${spot.id}`}</Text>
                    
                    <View style={styles.calloutStatusContainer}>
                      <View style={[
                        styles.calloutStatusIndicator, 
                        { backgroundColor: spot.status === 'available' ? statusColors.available : currentColors.accent }
                      ]} />
                      <Text style={styles.calloutStatus}>
                        {spot.status === 'available' ? 'Available' : 'Reserved'}
                      </Text>
                    </View>
                    
                    <View style={styles.calloutDetailsGrid}>
                      {spot.floor && (
                        <View style={styles.calloutDetailItem}>
                          <Ionicons name="layers-outline" size={16} color={currentColors.text.secondary} />
                          <Text style={[
                            styles.calloutDetail,
                            { color: currentColors.text.secondary }
                          ]}>Floor {spot.floor}</Text>
                        </View>
                      )}
                      
                      {spot.price && (
                        <View style={styles.calloutDetailItem}>
                          <Ionicons name="cash-outline" size={16} color={currentColors.text.secondary} />
                          <Text style={[
                            styles.calloutDetail,
                            { color: currentColors.text.secondary }
                          ]}>${spot.price}/hr</Text>
                        </View>
                      )}
                      
                      {spot.distance && (
                        <View style={styles.calloutDetailItem}>
                          <Ionicons name="location-outline" size={16} color={currentColors.text.secondary} />
                          <Text style={[
                            styles.calloutDetail,
                            { color: currentColors.text.secondary }
                          ]}>{spot.distance} km</Text>
                        </View>
                      )}
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.reserveButton,
                        { 
                          backgroundColor: spot.status === 'available' ? currentColors.accent : 'rgba(255, 255, 255, 0.2)',
                          borderWidth: 1,
                          borderColor: spot.status === 'available' ? 'transparent' : currentColors.divider
                        }
                      ]}
                      onPress={() => handleReserveSpot(spot)}
                      disabled={spot.status === 'reserved'}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.reserveButtonText,
                        { color: spot.status === 'available' ? currentColors.text.primary : currentColors.text.disabled }
                      ]}>
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
        
        {/* Map Controls: vertical stack on right side above nav bar */}
        <View style={styles.mapControlsSide}>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: currentThemeMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }]} onPress={handleZoomIn} activeOpacity={0.7}>
            <Ionicons name="add" size={24} color={currentColors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: currentThemeMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }]} onPress={handleZoomOut} activeOpacity={0.7}>
            <Ionicons name="remove" size={24} color={currentColors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: currentThemeMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }]} onPress={() => mapRef.current?.animateToRegion(initialRegion, 500)} activeOpacity={0.7}>
            <Ionicons name="locate" size={24} color={currentColors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Only keep the legend in the top left */}
      <View style={styles.legendTopLeft}>
        <BlurView intensity={20} tint={currentThemeMode === 'dark' ? 'dark' : 'light'} style={styles.legendPanel}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: statusColors.available }]} />
            <Text style={[styles.legendLabel, { color: currentThemeMode === 'dark' ? '#fff' : '#333' }]}>Available</Text>
            <View style={[styles.legendDot, { backgroundColor: currentColors.accent, marginLeft: 12 }]} />
            <Text style={[styles.legendLabel, { color: currentThemeMode === 'dark' ? '#fff' : '#333' }]}>Full</Text>
          </View>
        </BlurView>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  marker: {
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
  markerText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  calloutContainer: {
    width: 220,
    backgroundColor: 'white',
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
    color: 'black',
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
    color: 'black',
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
    color: 'black',
    marginLeft: 8,
  },
  reserveButton: {
    backgroundColor: 'white',
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
    color: 'black',
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
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
  },
  userMarkerRing: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.5,
  },
  mapControlsSide: {
    position: 'absolute',
    right: 16,
    bottom: 96, // just above the nav bar and a bit above the bottom
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 101,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legendTopLeft: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 200,
  },
  legendPanel: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(42, 42, 79, 0.7)',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  badge: {
    minWidth: BADGE_SIZE,
    minHeight: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 1,
    borderColor: '#4CAF50',
    position: 'absolute',
    top: -BADGE_SIZE / 2 + 4,
    right: -BADGE_SIZE / 2 + 4,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
});

export default ParkingMap; 