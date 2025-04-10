import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';

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

// Default parking spots data - using Cairo parking spots
const defaultParkingSpots: ParkingSpot[] = cairoParkingSpots;

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

// Web implementation of ParkingMap (without using react-native-maps)
const ParkingMap: React.FC<ParkingMapProps> = ({
  parkingSpots = defaultParkingSpots,
  onSpotPress,
  entryTime = defaultEntryTime,
  estimatedExitTime = defaultExitTime,
}) => {
  // Adjust sizes based on screen dimensions for responsiveness
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 768;

  return (
    <View style={styles.webPlaceholder}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.webPlaceholderTitle}>Smart Parking System</Text>
        <Text style={styles.webPlaceholderSubTitle}>Find and reserve parking spaces in real-time. Save time and enjoy seamless parking management.</Text>
      </View>
      
      <View style={styles.contentContainer}>
        {/* Left Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendText}>Parking dots labeled with a "P":</Text>
          <View style={styles.legendItemsContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.available }]} />
              <Text style={styles.legendItemText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.reserved }]} />
              <Text style={styles.legendItemText}>Reserved</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.webMapContainer}>
          <View style={styles.webMapTitle}>
            <Text style={styles.webMapTitleText}>Parking Map</Text>
            <Text style={styles.webMapSubtitleText}>Map view available on mobile devices</Text>
          </View>
          
          <View style={styles.spotsContainer}>
            {parkingSpots.map(spot => (
              <TouchableOpacity 
                key={spot.id} 
                style={[
                  styles.spotItem,
                  { backgroundColor: spot.status === 'reserved' ? COLORS.reserved : COLORS.available }
                ]}
                onPress={() => onSpotPress?.(spot)}
              >
                <View style={styles.spotContent}>
                  <Text style={styles.spotText}>Spot {spot.name || spot.id}</Text>
                  <View style={styles.spotStatusContainer}>
                    <View style={[styles.statusIndicator, { 
                      backgroundColor: spot.status === 'available' ? COLORS.success : COLORS.error 
                    }]} />
                    <Text style={styles.spotStatus}>
                      {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      {/* Real-time availability section */}
      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Real-time Availability</Text>
        <Text style={styles.sectionSubtitle}>See available spots across locations</Text>
        
        <View style={styles.locationCards}>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationName}>Cairo Festival City</Text>
              <View style={styles.fillingTag}>
                <Text style={styles.fillingTagText}>Filling Up</Text>
              </View>
            </View>
            <Text style={styles.locationAddress}>5th Settlement, New Cairo</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Free Spots</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>50</Text>
                <Text style={styles.statLabel}>Total Spots</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>LE 20</Text>
                <Text style={styles.statLabel}>Per Hour</Text>
              </View>
            </View>
            
            <View style={styles.availabilityBar}>
              <View style={[styles.availabilityFill, { width: '24%' }]} />
            </View>
            <Text style={styles.availabilityText}>24% Available</Text>
          </View>
        </View>
      </View>
      
      {/* Time information card */}
      <View style={styles.timeCardContainer}>
        <View style={styles.timeCard}>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Entry Time</Text>
            <Text style={styles.timeValue}>{entryTime}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Estimated Exit</Text>
            <Text style={styles.timeValue}>{estimatedExitTime}</Text>
          </View>
        </View>
      </View>
      
      {/* Bottom navigation */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <View style={[styles.navIcon, styles.navIconActive]} />
          <Text style={[styles.navText, styles.navTextActive]}>Parking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Adjust sizes based on screen dimensions for responsiveness
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 1024; // Based on standard desktop width

const normalize = (size: number) => {
  const newSize = size * (scale > 1 ? 1 : scale);
  return Math.round(newSize);
};

const styles = StyleSheet.create({
  // Web placeholder styles
  webPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: normalize(20),
    height: '100%',
  },
  headerContainer: {
    marginBottom: normalize(30),
  },
  webPlaceholderTitle: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: normalize(10),
  },
  webPlaceholderSubTitle: {
    fontSize: normalize(16),
    color: COLORS.subtext,
    maxWidth: normalize(600),
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendContainer: {
    marginBottom: normalize(20),
    flexBasis: '100%',
  },
  legendText: {
    color: COLORS.text,
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(10),
  },
  legendItemsContainer: {
    flexDirection: 'row',
    marginTop: normalize(5),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(20),
  },
  legendDot: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    marginRight: normalize(8),
  },
  legendItemText: {
    color: COLORS.subtext,
    fontSize: normalize(14),
  },
  webMapContainer: {
    flexBasis: '50%',
    minWidth: normalize(300),
    marginRight: normalize(20),
    marginBottom: normalize(20),
  },
  webMapTitle: {
    marginBottom: normalize(15),
  },
  webMapTitleText: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  webMapSubtitleText: {
    fontSize: normalize(14),
    color: COLORS.subtext,
  },
  spotsContainer: {
    width: '100%',
  },
  spotItem: {
    borderRadius: normalize(12),
    marginBottom: normalize(10),
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
  spotContent: {
    padding: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.black,
  },
  spotStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginRight: normalize(6),
  },
  spotStatus: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: COLORS.black,
  },
  availabilitySection: {
    marginTop: normalize(20),
    marginBottom: normalize(30),
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: normalize(5),
  },
  sectionSubtitle: {
    fontSize: normalize(14),
    color: COLORS.subtext,
    marginBottom: normalize(15),
  },
  locationCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationCard: {
    backgroundColor: COLORS.card,
    borderRadius: normalize(12),
    padding: normalize(15),
    marginBottom: normalize(15),
    minWidth: normalize(300),
    maxWidth: normalize(450),
    marginRight: normalize(15),
    ...Platform.select({
      web: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(5),
  },
  locationName: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  fillingTag: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(4),
  },
  fillingTagText: {
    color: COLORS.black,
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  locationAddress: {
    fontSize: normalize(14),
    color: COLORS.subtext,
    marginBottom: normalize(15),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(15),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: normalize(4),
  },
  statLabel: {
    fontSize: normalize(12),
    color: COLORS.subtext,
  },
  availabilityBar: {
    height: normalize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: normalize(4),
    marginBottom: normalize(4),
    overflow: 'hidden',
  },
  availabilityFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: normalize(4),
  },
  availabilityText: {
    fontSize: normalize(12),
    color: COLORS.subtext,
    textAlign: 'right',
  },
  timeCardContainer: {
    marginBottom: normalize(30),
  },
  timeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: normalize(15),
    padding: normalize(20),
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLabel: {
    color: COLORS.subtext,
    fontSize: normalize(14),
    marginBottom: normalize(8),
  },
  timeValue: {
    color: COLORS.white,
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    marginHorizontal: normalize(10),
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: normalize(15),
    padding: normalize(10),
    ...Platform.select({
      web: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(10),
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: COLORS.secondary,
    marginTop: -2,
  },
  navIcon: {
    width: normalize(24),
    height: normalize(24),
    backgroundColor: COLORS.subtext,
    borderRadius: normalize(12),
    marginBottom: normalize(6),
  },
  navIconActive: {
    backgroundColor: COLORS.secondary,
  },
  navText: {
    fontSize: normalize(12),
    color: COLORS.subtext,
  },
  navTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export default ParkingMap; 