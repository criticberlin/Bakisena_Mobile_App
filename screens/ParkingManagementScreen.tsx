import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Alert,
  Animated
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { parkingService } from '../services/ParkingService';
import { ParkingLocation, ParkingLevel, ParkingSection, ParkingSlot } from '../types';
import { AppTextWrapper } from '../theme';
import AppLayout from '../components/layout/AppLayout';
import { Ionicons } from '@expo/vector-icons';
import { runInitialization } from '../scripts/initializeParkingData';
import { useAuth } from '../components/AuthContext';

const { width } = Dimensions.get('window');

const RETRY_DELAY = 5000; // 5 seconds

const ParkingManagementScreen: React.FC = () => {
  console.log('ParkingManagementScreen: Initializing...');
  
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isIndexBuilding, setIsIndexBuilding] = useState(false);
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ParkingLevel | null>(null);
  const [selectedSection, setSelectedSection] = useState<ParkingSection | null>(null);

  useEffect(() => {
    loadParkingLocations();
  }, []);

  // Add auto-retry when indexes are building
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    if (isIndexBuilding) {
      retryTimeout = setTimeout(() => {
        console.log('ParkingManagementScreen: Retrying after index building delay...');
        loadParkingLocations();
      }, RETRY_DELAY);
    }
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [isIndexBuilding]);

  const isIndexBuildingError = (error: any) => {
    return error?.message?.includes('index is currently building');
  };

  const loadParkingLocations = async () => {
    console.log('ParkingManagementScreen: Loading parking locations...');
    try {
      setLoading(true);
      setError(null);
      setIsIndexBuilding(false);
      const parkingLocations = await parkingService.getParkingLocations();
      console.log('ParkingManagementScreen: Loaded locations:', parkingLocations);
      setLocations(parkingLocations);
      if (parkingLocations.length > 0) {
        handleLocationSelect(parkingLocations[0]);
      }
    } catch (error: any) {
      console.error('ParkingManagementScreen: Error loading parking locations:', error);
      if (isIndexBuildingError(error)) {
        setIsIndexBuilding(true);
        setError('Initializing database indexes... This may take a few minutes.');
      } else {
        setError(error?.message || 'Failed to load parking locations');
      }
    } finally {
      if (!isIndexBuildingError(error)) {
        setLoading(false);
      }
    }
  };

  const handleLocationSelect = async (location: ParkingLocation) => {
    console.log('ParkingManagementScreen: Selecting location:', location.id);
    try {
      setLoading(true);
      setError(null);
      setIsIndexBuilding(false);
      const fullLocation = await parkingService.getParkingLocation(location.id);
      console.log('ParkingManagementScreen: Loaded full location details:', fullLocation);
      if (fullLocation) {
        setSelectedLocation(fullLocation);
        if (fullLocation.levels && fullLocation.levels.length > 0) {
          handleLevelSelect(fullLocation.levels[0]);
        }
      }
    } catch (error: any) {
      console.error('ParkingManagementScreen: Error loading location details:', error);
      if (isIndexBuildingError(error)) {
        setIsIndexBuilding(true);
        setError('Initializing database indexes... This may take a few minutes.');
      } else {
        setError(error?.message || 'Failed to load location details');
        Alert.alert(
          'Error',
          'Failed to load location details. Please try again.',
          [{ text: 'OK', onPress: () => setError(null) }]
        );
      }
    } finally {
      if (!isIndexBuildingError(error)) {
        setLoading(false);
      }
    }
  };

  const handleLevelSelect = (level: ParkingLevel) => {
    console.log('ParkingManagementScreen: Selecting level:', level.id);
    setSelectedLevel(level);
    if (level.sections && level.sections.length > 0) {
      handleSectionSelect(level.sections[0]);
    }
  };

  const handleSectionSelect = (section: ParkingSection) => {
    console.log('ParkingManagementScreen: Selecting section:', section.id);
    setSelectedSection(section);
  };

  const handleSlotStatusUpdate = async (slot: ParkingSlot, newStatus: ParkingSlot['status']) => {
    try {
      setLoading(true);
      await parkingService.updateSlotStatus(slot.id, newStatus);
      // Refresh the location data to get updated slot statuses
      if (selectedLocation) {
        await handleLocationSelect(selectedLocation);
      }
    } catch (error: any) {
      console.error('ParkingManagementScreen: Error updating slot status:', error);
      Alert.alert(
        'Error',
        'Failed to update slot status. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const getSlotColor = (status: ParkingSlot['status']) => {
    switch (status) {
      case 'available':
        return colors.success;
      case 'occupied':
        return colors.error;
      case 'reserved':
        return colors.warning;
      case 'maintenance':
        return colors.info;
      default:
        return colors.surface;
    }
  };

  // Add Location Handler
  const handleAddLocation = async () => {
    try {
      const locationData = {
        name: 'New Location',
        address: '',
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
        totalSlots: 0,
        availableSlots: 0,
        priceRange: {
          min: 10,
          max: 30,
        },
        operatingHours: {
          open: '06:00',
          close: '00:00',
        },
        amenities: ['Security', 'CCTV', 'Lighting'],
        images: [],
        levels: []
      };

      const locationId = await parkingService.addLocation(locationData);
      console.log('Added new location:', locationId);
      loadParkingLocations(); // Refresh the list
    } catch (error) {
      console.error('Error adding location:', error);
      Alert.alert('Error', 'Failed to add location');
    }
  };

  // Add Level Handler
  const handleAddLevel = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location first');
      return;
    }

    try {
      const levelData = {
        name: `Level ${selectedLocation.levels?.length + 1 || 1}`,
        number: selectedLocation.levels?.length + 1 || 1,
        locationId: selectedLocation.id,
        totalSlots: 0,
        availableSlots: 0,
        sections: []
      };

      const levelId = await parkingService.addLevel(levelData);
      console.log('Added new level:', levelId);
      handleLocationSelect(selectedLocation); // Refresh the location data
    } catch (error) {
      console.error('Error adding level:', error);
      Alert.alert('Error', 'Failed to add level');
    }
  };

  // Add Section Handler
  const handleAddSection = async () => {
    if (!selectedLevel) {
      Alert.alert('Error', 'Please select a level first');
      return;
    }

    try {
      const sectionData = {
        name: `Section ${String.fromCharCode(65 + (selectedLevel.sections?.length || 0))}`,
        levelId: selectedLevel.id,
        totalSlots: 0,
        availableSlots: 0,
        level: selectedLevel.number,
        slots: []
      };

      const sectionId = await parkingService.addSection(sectionData);
      console.log('Added new section:', sectionId);
      handleLocationSelect(selectedLocation!); // Refresh all data
    } catch (error) {
      console.error('Error adding section:', error);
      Alert.alert('Error', 'Failed to add section');
    }
  };

  // Add Slot Handler
  const handleAddSlot = async () => {
    if (!selectedSection) {
      Alert.alert('Error', 'Please select a section first');
      return;
    }

    try {
      setLoading(true);
      const currentSlots = selectedSection.slots || [];
      const nextSlotNumber = (currentSlots.length + 1).toString().padStart(2, '0');
      
      const slotData = {
        number: nextSlotNumber,
        type: 'standard' as const,
        status: 'available' as const,
        sectionId: selectedSection.id,
        section: selectedSection.name,
        level: selectedLevel?.number || 0,
        location: selectedLocation?.name || '',
        coordinates: { x: 0, y: 0 },
        pricePerHour: 10,
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await parkingService.addSlot(slotData);
      handleLocationSelect(selectedLocation!); // Refresh all data
      Alert.alert('Success', 'New slot added successfully');
    } catch (error) {
      console.error('Error adding slot:', error);
      Alert.alert('Error', 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  // Update Manage Types Handler
  const handleManageTypes = () => {
    if (!selectedSection) {
      Alert.alert('Error', 'Please select a section first');
      return;
    }

    Alert.alert(
      'Section Management',
      'Choose an action:',
      [
        { 
          text: 'Add New Slot',
          onPress: handleAddSlot
        },
        { 
          text: 'Change Slot Types',
          onPress: () => {
            Alert.alert(
              'Change Slot Types',
              'Select type to apply to all slots in this section:',
              [
                { text: 'Standard', onPress: () => updateSelectedSlotsType('standard') },
                { text: 'Handicap', onPress: () => updateSelectedSlotsType('handicap') },
                { text: 'Electric', onPress: () => updateSelectedSlotsType('electric') },
                { text: 'VIP', onPress: () => updateSelectedSlotsType('vip') },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Update slot types
  const updateSelectedSlotsType = async (type: ParkingSlot['type']) => {
    if (!selectedSection?.slots) return;

    try {
      setLoading(true);
      const updatePromises = selectedSection.slots.map(slot => 
        parkingService.updateSlotType(slot.id, type)
      );
      await Promise.all(updatePromises);
      handleLocationSelect(selectedLocation!); // Refresh data
    } catch (error) {
      console.error('Error updating slot types:', error);
      Alert.alert('Error', 'Failed to update slot types');
    } finally {
      setLoading(false);
    }
  };

  // Export Report Handler
  const handleExportReport = async () => {
    try {
      setLoading(true);
      const stats = await parkingService.getParkingStatistics();
      
      // Format the statistics
      const report = `
Parking Management Report
Generated: ${new Date().toLocaleString()}

Summary:
- Total Locations: ${stats.totalLocations}
- Total Levels: ${stats.totalLevels}
- Total Sections: ${stats.totalSections}
- Total Slots: ${stats.totalSlots}

Slot Status:
- Available: ${stats.availableSlots}
- Occupied: ${stats.occupiedSlots}
- Reserved: ${stats.reservedSlots}
- Maintenance: ${stats.maintenanceSlots}

Slot Types:
- Standard: ${stats.slotsByType.standard}
- Handicap: ${stats.slotsByType.handicap}
- Electric: ${stats.slotsByType.electric}
- VIP: ${stats.slotsByType.vip}
      `;

      // In a real app, we would save this to a file or send it to an email
      Alert.alert('Report Generated', report);
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Reset Data Handler
  const handleResetData = async () => {
    try {
      setLoading(true);
      await parkingService.resetParkingData();
      
      // Reinitialize with default data
      await runInitialization();
      
      // Refresh the UI with new data
      await loadParkingLocations();
      
      Alert.alert('Success', 'Parking data has been reset and reinitialized successfully');
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert('Error', 'Failed to reset parking data');
    } finally {
      setLoading(false);
    }
  };

  // Add handleLogout function
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (loading || isIndexBuilding) {
    return (
      <AppLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.text, { color: colors.text.primary }]}>
            {isIndexBuilding ? 'Initializing database indexes...' : 'Loading parking data...'}
          </Text>
          {isIndexBuilding && (
            <Text style={[styles.subText, { color: colors.text.secondary }]}>
              This may take a few minutes
            </Text>
          )}
        </View>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <View style={styles.centerContainer}>
          <Text style={[styles.text, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={loadParkingLocations}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  // Removed early return for empty locations to ensure admin buttons are always visible

  return (
    <AppLayout>
      <Animated.View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Parking Management</Text>
            
            {/* Admin Action Buttons - Always visible */}
            <View style={styles.adminActions}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddLocation}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Add Location</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.adminButton,
                    { 
                      backgroundColor: colors.primary,
                      opacity: selectedLocation ? 1 : 0.6 
                    }
                  ]}
                  onPress={handleAddLevel}
                  disabled={!selectedLocation}
                >
                  <Ionicons name="layers-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Add Level</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.adminButton,
                    { 
                      backgroundColor: colors.primary,
                      opacity: selectedLevel ? 1 : 0.6 
                    }
                  ]}
                  onPress={handleAddSection}
                  disabled={!selectedLevel}
                >
                  <Ionicons name="grid-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Add Section</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.adminButton,
                    { 
                      backgroundColor: colors.accent,
                      opacity: selectedSection ? 1 : 0.6 
                    }
                  ]}
                  onPress={handleManageTypes}
                  disabled={!selectedSection}
                >
                  <Ionicons name="options-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Manage Types</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.adminButton,
                    { 
                      backgroundColor: colors.success,
                      opacity: selectedSection ? 1 : 0.6 
                    }
                  ]}
                  onPress={handleAddSlot}
                  disabled={!selectedSection}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Add Slot</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: colors.success }]}
                  onPress={handleExportReport}
                >
                  <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Export Report</Text>
                </TouchableOpacity>
                
                                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: colors.error }]}
                  onPress={() => {
                    Alert.alert(
                      'Reset Data',
                      'Are you sure you want to reset all parking data? This action cannot be undone.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Reset',
                          style: 'destructive',
                          onPress: handleResetData
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Reset Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.adminButton, { backgroundColor: colors.warning }]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                  <Text style={[styles.adminButtonText, { color: '#FFFFFF' }]}>Logout</Text>
                </TouchableOpacity>
                </ScrollView>
            </View>
          </View>
          
          {/* Locations */}
          {locations.length === 0 ? (
            <View style={[styles.section, styles.emptyState]}>
              <Text style={[styles.text, { color: colors.text.primary }]}>No parking locations found</Text>
              <Text style={[styles.subText, { color: colors.text.secondary }]}>
                Click 'Add Location' above to create your first parking location
              </Text>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Locations</Text>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.locationCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: selectedLocation?.id === location.id ? colors.primary : colors.divider
                    }
                  ]}
                  onPress={() => handleLocationSelect(location)}
                >
                  <Text style={[styles.locationName, { color: colors.text.primary }]}>{location.name}</Text>
                  <Text style={[styles.locationDetails, { color: colors.text.secondary }]}>
                    Available: {location.availableSlots} / {location.totalSlots}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Levels */}
          {selectedLocation?.levels && selectedLocation.levels.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Levels</Text>
              <Animated.View style={styles.horizontalList}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedLocation.levels.map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: selectedLevel?.id === level.id ? colors.primary : colors.divider
                        }
                      ]}
                      onPress={() => handleLevelSelect(level)}
                    >
                      <Text style={[styles.levelName, { color: colors.text.primary }]}>{level.name}</Text>
                      <Text style={[styles.levelDetails, { color: colors.text.secondary }]}>
                        Available: {level.availableSlots} / {level.totalSlots}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </View>
          )}

          {/* Sections */}
          {selectedLevel?.sections && selectedLevel.sections.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Sections</Text>
              <Animated.View style={styles.horizontalList}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedLevel.sections.map((section) => (
                    <TouchableOpacity
                      key={section.id}
                      style={[
                        styles.sectionCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: selectedSection?.id === section.id ? colors.primary : colors.divider
                        }
                      ]}
                      onPress={() => handleSectionSelect(section)}
                    >
                      <Text style={[styles.sectionName, { color: colors.text.primary }]}>{section.name}</Text>
                      <Text style={[styles.sectionDetails, { color: colors.text.secondary }]}>
                        Available: {section.availableSlots} / {section.totalSlots}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </View>
          )}

          {/* Slots */}
          {selectedSection?.slots && selectedSection.slots.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Slots</Text>
              <View style={styles.slotsGrid}>
                {selectedSection.slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.divider,
                        borderLeftWidth: 4,
                        borderLeftColor: getSlotColor(slot.status)
                      }
                    ]}
                    onPress={() => {
                      Alert.alert(
                        'Update Slot Status',
                        `Current status: ${slot.status}\nSelect new status:`,
                        [
                          { text: 'Available', onPress: () => handleSlotStatusUpdate(slot, 'available') },
                          { text: 'Occupied', onPress: () => handleSlotStatusUpdate(slot, 'occupied') },
                          { text: 'Reserved', onPress: () => handleSlotStatusUpdate(slot, 'reserved') },
                          { text: 'Maintenance', onPress: () => handleSlotStatusUpdate(slot, 'maintenance') },
                          { text: 'Cancel', style: 'cancel' }
                        ]
                      );
                    }}
                  >
                    <Text style={[styles.slotNumber, { color: colors.text.primary }]}>{slot.number}</Text>
                    <Text style={[styles.slotStatus, { color: colors.text.secondary }]}>{slot.status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  adminActions: {
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: -8,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adminButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginVertical: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  horizontalList: {
    flexGrow: 0,
    marginHorizontal: -8,
  },
  locationCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 14,
  },
  levelCard: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    minWidth: 120,
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelDetails: {
    fontSize: 12,
  },
  sectionCard: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    minWidth: 120,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDetails: {
    fontSize: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
  },
  slotCard: {
    padding: 12,
    borderRadius: 8,
    margin: 8,
    borderWidth: 1,
    width: (width - 64) / 3,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  slotStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
});

export default ParkingManagementScreen; 