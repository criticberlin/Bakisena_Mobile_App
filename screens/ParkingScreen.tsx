import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../components/ActionButton';
import ParkingMap, { ParkingSpot } from '../components/ParkingMap';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

// Define types for our data structures
type ParkingLocation = {
  id: string;
  name: string;
  slots: string[];
  totalSlots: number;
  availableSlots: number;
};

type ParkingSlot = {
  id: string;
  status: 'available' | 'occupied' | 'reserved' | 'out-of-service';
};

// Mock data for parking locations and slots
const MOCK_LOCATIONS: ParkingLocation[] = [
  {
    id: 'loc1',
    name: 'Main Building',
    slots: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
    totalSlots: 6,
    availableSlots: 3,
  },
  {
    id: 'loc2',
    name: 'West Wing',
    slots: ['B1', 'B2', 'B3', 'B4'],
    totalSlots: 4,
    availableSlots: 2,
  },
  {
    id: 'loc3',
    name: 'East Parking',
    slots: ['C1', 'C2', 'C3', 'C4', 'C5'],
    totalSlots: 5,
    availableSlots: 1,
  }
];

const MOCK_PARKING_SLOTS: ParkingSlot[] = [
  { id: 'A1', status: 'available' },
  { id: 'A2', status: 'occupied' },
  { id: 'A3', status: 'reserved' },
  { id: 'A4', status: 'available' },
  { id: 'A5', status: 'available' },
  { id: 'A6', status: 'out-of-service' },
  { id: 'B1', status: 'available' },
  { id: 'B2', status: 'available' },
  { id: 'B3', status: 'occupied' },
  { id: 'B4', status: 'reserved' },
  { id: 'C1', status: 'available' },
  { id: 'C2', status: 'occupied' },
  { id: 'C3', status: 'occupied' },
  { id: 'C4', status: 'out-of-service' },
  { id: 'C5', status: 'occupied' },
];

const ParkingScreen = () => {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation>(MOCK_LOCATIONS[0]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  // Get slots for the selected location
  const locationSlots = MOCK_PARKING_SLOTS.filter(slot => 
    selectedLocation.slots.includes(slot.id)
  );

  // Handle slot selection
  const handleSlotPress = (slotId: string) => {
    setSelectedSlotId(slotId);
  };
  
  // Handle spot selection from map
  const handleSpotPress = (spot: ParkingSpot) => {
    // Convert the numeric id to string if needed
    const spotId = typeof spot.id === 'number' ? spot.id.toString() : String(spot.id);
    setSelectedSlotId(spotId);
  };
  
  // Handle booking/reservation
  const handleReservation = () => {
    // In a real app, you would do a reservation API call here
    // Then navigate to a confirmation screen
    
    // For now, just show a simple alert
    alert(`Slot ${selectedSlotId} reserved at ${selectedLocation.name}`);
    
    // Reset selection after booking
    setSelectedSlotId(null);
  };

  const renderLocationItem = ({ item }: { item: ParkingLocation }) => (
    <TouchableOpacity 
      style={[
        styles.locationItem, 
        selectedLocation.id === item.id && styles.selectedLocationItem
      ]}
      onPress={() => setSelectedLocation(item)}
    >
      <Text style={[
        styles.locationName, 
        selectedLocation.id === item.id && styles.selectedLocationName
      ]}>
        {item.name}
      </Text>
      <View style={styles.locationStatsRow}>
        <View style={styles.locationStatsItem}>
          <Text style={styles.statValue}>{item.availableSlots}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.locationStatsItem}>
          <Text style={styles.statValue}>{item.totalSlots}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderParkingSlotItem = ({ item }: { item: ParkingSlot }) => (
    <TouchableOpacity 
      style={[
        styles.slotItem, 
        item.status === 'available' && styles.availableSlot,
        item.status === 'occupied' && styles.occupiedSlot,
        item.status === 'reserved' && styles.reservedSlot,
        item.status === 'out-of-service' && styles.outOfServiceSlot,
        selectedSlotId === item.id && styles.selectedSlot
      ]}
      onPress={() => item.status === 'available' ? handleSlotPress(item.id) : null}
      disabled={item.status !== 'available'}
    >
      <View style={styles.slotContent}>
        <Text style={styles.slotId}>{item.id}</Text>
        <Text style={styles.slotStatus}>{item.status}</Text>
      </View>
      {selectedSlotId === item.id && (
        <View style={styles.slotSelectedIndicator}>
          <Ionicons name="checkmark-circle" size={22} color={theme.colors.accent} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      
      {/* Header with Tabs */}
      <View style={styles.headerContainer}>
        <View style={styles.headerBackground}>
          <View style={styles.header}>
            <Text style={styles.title}>Parking</Text>
            <View style={styles.viewModeToggle}>
              <TouchableOpacity 
                style={[styles.viewModeButton, viewMode === 'map' && styles.activeViewMode]}
                onPress={() => setViewMode('map')}
              >
                <Ionicons 
                  name="map" 
                  size={20} 
                  color={viewMode === 'map' ? theme.colors.accent : theme.colors.text.secondary} 
                />
                <Text style={[
                  styles.viewModeText, 
                  viewMode === 'map' && styles.activeViewModeText
                ]}>Map</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
                onPress={() => setViewMode('list')}
              >
                <Ionicons 
                  name="list" 
                  size={20} 
                  color={viewMode === 'list' ? theme.colors.accent : theme.colors.text.secondary} 
                />
                <Text style={[
                  styles.viewModeText, 
                  viewMode === 'list' && styles.activeViewModeText
                ]}>List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      {/* Locations Carousel */}
      <View style={styles.locationsContainer}>
        <FlatList
          data={MOCK_LOCATIONS}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsContent}
        />
      </View>
      
      {/* Main Content - Map or List View */}
      <View style={styles.mainContent}>
        {viewMode === 'map' ? (
          <View style={styles.mapContainer}>
            <ParkingMap onSpotPress={handleSpotPress} />
          </View>
        ) : (
          <FlatList
            data={locationSlots}
            renderItem={renderParkingSlotItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.slotsContainer}
          />
        )}
      </View>
      
      {/* Bottom Action Panel */}
      {selectedSlotId && (
        <BlurView intensity={25} tint="dark" style={styles.bottomPanelContainer}>
          <View style={styles.bottomPanel}>
            <View style={styles.selectedSlotInfo}>
              <Text style={styles.selectedSlotTitle}>Selected Spot</Text>
              <Text style={styles.selectedSlotId}>{selectedSlotId}</Text>
              <Text style={styles.selectedSlotLocation}>{selectedLocation.name}</Text>
            </View>
            
            <ActionButton
              title="Reserve Now"
              onPress={handleReservation}
              style={styles.reserveButton}
              icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
              iconPosition="left"
            />
          </View>
        </BlurView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    zIndex: 10,
  },
  headerBackground: {
    borderBottomLeftRadius: theme.borders.radius.xl,
    borderBottomRightRadius: theme.borders.radius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(42, 42, 79, 0.9)',
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['5'],
    paddingVertical: theme.spacing['4'],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(42, 42, 79, 0.6)',
    borderRadius: theme.borders.radius.full,
    padding: theme.spacing['1'],
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing['2'],
    paddingHorizontal: theme.spacing['3'],
    borderRadius: theme.borders.radius.full,
  },
  activeViewMode: {
    backgroundColor: 'rgba(249, 178, 51, 0.15)',
  },
  viewModeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing['1'],
  },
  activeViewModeText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  locationsContainer: {
    marginVertical: theme.spacing['4'],
  },
  locationsContent: {
    paddingHorizontal: theme.spacing['4'],
  },
  locationItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.xl,
    padding: theme.spacing['4'],
    marginRight: theme.spacing['3'],
    width: 170,
    ...theme.shadows.sm,
  },
  selectedLocationItem: {
    backgroundColor: 'rgba(249, 178, 51, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  locationName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing['2'],
  },
  selectedLocationName: {
    color: theme.colors.accent,
  },
  locationStatsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing['2'],
  },
  locationStatsItem: {
    marginRight: theme.spacing['3'],
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 79, 0.4)',
    borderTopLeftRadius: theme.borders.radius.xl,
    borderTopRightRadius: theme.borders.radius.xl,
    overflow: 'hidden',
  },
  mapContainer: {
    flex: 1,
  },
  slotsContainer: {
    padding: theme.spacing['4'],
  },
  slotItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing['2'],
    borderRadius: theme.borders.radius.xl,
    padding: theme.spacing['3'],
    height: 100,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  slotContent: {
    alignItems: 'center',
  },
  slotId: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing['1'],
  },
  slotStatus: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  availableSlot: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.available,
  },
  occupiedSlot: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.occupied,
    opacity: 0.7,
  },
  reservedSlot: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.reserved,
    opacity: 0.7,
  },
  outOfServiceSlot: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.outOfService,
    opacity: 0.5,
  },
  selectedSlot: {
    backgroundColor: 'rgba(249, 178, 51, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  slotSelectedIndicator: {
    position: 'absolute',
    top: theme.spacing['2'],
    right: theme.spacing['2'],
  },
  bottomPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: theme.borders.radius['2xl'],
    borderTopRightRadius: theme.borders.radius['2xl'],
    overflow: 'hidden',
  },
  bottomPanel: {
    backgroundColor: 'rgba(42, 42, 79, 0.9)',
    padding: theme.spacing['5'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: theme.borders.radius['2xl'],
    borderTopRightRadius: theme.borders.radius['2xl'],
    paddingBottom: Platform.OS === 'ios' ? theme.spacing['6'] : theme.spacing['5'],
  },
  selectedSlotInfo: {
    flex: 1,
  },
  selectedSlotTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  selectedSlotId: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  selectedSlotLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  reserveButton: {
    minWidth: 140,
  },
});

export default ParkingScreen; 