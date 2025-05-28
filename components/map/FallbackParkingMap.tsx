import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParkingSpot, ParkingMapProps } from './constants';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');

// Color constants for status indicators when theme colors don't include status
const STATUS_COLORS = {
  available: '#4CAF50', // Green
  reserved: '#FFA000',  // Amber
  occupied: '#F44336',  // Red
};

/**
 * A fallback map component that doesn't rely on react-native-maps
 * This provides a styled list of parking spots that can be used
 * when the map cannot be loaded
 */
const FallbackParkingMap: React.FC<ParkingMapProps> = ({
  parkingSpots = [],
  onSpotPress,
  onReserveSpot,
  entryTime,
  estimatedExitTime,
  isRealTime = true,
}) => {
  const { themeMode, colors } = useTheme();
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  
  // Organize spots by availability
  const availableSpots = parkingSpots.filter(spot => spot.status === 'available');
  const reservedSpots = parkingSpots.filter(spot => spot.status === 'reserved' || spot.status === 'occupied');

  // Get status color safely, using the constant fallbacks
  const getStatusColor = (status: string) => {
    // Always use the constant colors to avoid type errors
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.available;
  };

  // Render a single parking spot card
  const renderSpotCard = (spot: ParkingSpot) => {
    const isAvailable = spot.status === 'available';
    const statusColor = isAvailable ? getStatusColor('available') : getStatusColor('reserved');
    
    return (
      <TouchableOpacity 
        key={spot.id}
        style={[
          styles.spotCard,
          { backgroundColor: themeMode === 'dark' ? '#1E1E1E' : '#FFFFFF' }
        ]}
        onPress={() => onSpotPress && onSpotPress(spot)}
        activeOpacity={0.7}
      >
        <View style={styles.spotHeader}>
          <Text style={[
            styles.spotName,
            { color: currentColors.text.primary }
          ]}>
            {spot.name || `Parking Spot ${spot.id}`}
          </Text>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {isAvailable ? 'Available' : 'Reserved'}
            </Text>
          </View>
        </View>
        
        <View style={styles.spotDetails}>
          {spot.distance && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={currentColors.text.secondary} />
              <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
                {spot.distance}
              </Text>
            </View>
          )}
          
          {spot.price && (
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color={currentColors.text.secondary} />
              <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
                ${spot.price}/hr
              </Text>
            </View>
          )}
          
          {spot.availableSpots && (
            <View style={styles.detailItem}>
              <Ionicons name="car-outline" size={16} color={currentColors.text.secondary} />
              <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
                {spot.availableSpots} spots
              </Text>
            </View>
          )}
        </View>
        
        {isAvailable && (
          <TouchableOpacity
            style={[
              styles.reserveButton,
              { backgroundColor: currentColors.primary }
            ]}
            onPress={() => onReserveSpot && onReserveSpot(spot)}
            activeOpacity={0.8}
          >
            <Text style={styles.reserveButtonText}>Reserve</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: currentColors.background }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Parking Spots
        </Text>
        <Text style={[styles.subtitle, { color: currentColors.text.secondary }]}>
          Map view unavailable - showing list instead
        </Text>
      </View>
      
      <ScrollView style={styles.spotsContainer} contentContainerStyle={styles.spotsList}>
        {availableSpots.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
              Available Spots ({availableSpots.length})
            </Text>
            {availableSpots.map(renderSpotCard)}
          </View>
        )}
        
        {reservedSpots.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
              Reserved/Occupied Spots ({reservedSpots.length})
            </Text>
            {reservedSpots.map(renderSpotCard)}
          </View>
        )}
        
        {parkingSpots.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color={currentColors.text.secondary} />
            <Text style={[styles.emptyText, { color: currentColors.text.secondary }]}>
              No parking spots available
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Demo Mode Indicator */}
      <View style={styles.demoModeContainer}>
        <Text style={[styles.demoModeText, { color: STATUS_COLORS.available }]}>
          Using Demo Data
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  spotsContainer: {
    flex: 1,
  },
  spotsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  spotCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  spotDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  reserveButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  demoModeContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  demoModeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default FallbackParkingMap; 