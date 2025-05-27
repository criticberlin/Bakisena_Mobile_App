import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { parkingService } from '../services/ParkingService';
import { ParkingLocation, ParkingLevel, ParkingSection, ParkingSlot } from '../types';
import { AppTextWrapper } from '../theme';
import AppLayout from '../components/layout/AppLayout';

const { width } = Dimensions.get('window');

const ParkingManagementScreen: React.FC = () => {
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ParkingLevel | null>(null);
  const [selectedSection, setSelectedSection] = useState<ParkingSection | null>(null);

  useEffect(() => {
    loadParkingLocations();
  }, []);

  const loadParkingLocations = async () => {
    try {
      setLoading(true);
      const parkingLocations = await parkingService.getParkingLocations();
      setLocations(parkingLocations);
      if (parkingLocations.length > 0) {
        setSelectedLocation(parkingLocations[0]);
      }
    } catch (error) {
      console.error('Error loading parking locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location: ParkingLocation) => {
    try {
      setLoading(true);
      const fullLocation = await parkingService.getParkingLocation(location.id);
      if (fullLocation) {
        setSelectedLocation(fullLocation);
        if (fullLocation.levels.length > 0) {
          setSelectedLevel(fullLocation.levels[0]);
          if (fullLocation.levels[0].sections.length > 0) {
            setSelectedSection(fullLocation.levels[0].sections[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading location details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelSelect = (level: ParkingLevel) => {
    setSelectedLevel(level);
    if (level.sections.length > 0) {
      setSelectedSection(level.sections[0]);
    }
  };

  const handleSectionSelect = (section: ParkingSection) => {
    setSelectedSection(section);
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

  if (loading) {
    return (
      <AppLayout scrollable={false} containerType="screen">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout scrollable={false} containerType="screen">
      <View style={styles.container}>
        {/* Location Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.locationSelector}
        >
          {locations.map(location => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationButton,
                {
                  backgroundColor: selectedLocation?.id === location.id 
                    ? colors.accent 
                    : colors.surface
                }
              ]}
              onPress={() => handleLocationSelect(location)}
            >
              <AppTextWrapper
                style={[
                  styles.locationButtonText,
                  {
                    color: selectedLocation?.id === location.id 
                      ? colors.primary.toString()
                      : colors.text.toString()
                  }
                ]}
              >
                {location.name}
              </AppTextWrapper>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedLocation && (
          <>
            {/* Level Selector */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.levelSelector}
            >
              {selectedLocation.levels.map(level => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelButton,
                    {
                      backgroundColor: selectedLevel?.id === level.id 
                        ? colors.accent 
                        : colors.surface
                    }
                  ]}
                  onPress={() => handleLevelSelect(level)}
                >
                  <AppTextWrapper
                    style={[
                      styles.levelButtonText,
                      {
                        color: selectedLevel?.id === level.id 
                          ? colors.primary.toString()
                          : colors.text.toString()
                      }
                    ]}
                  >
                    {level.name}
                  </AppTextWrapper>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedLevel && (
              <>
                {/* Section Selector */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.sectionSelector}
                >
                  {selectedLevel.sections.map(section => (
                    <TouchableOpacity
                      key={section.id}
                      style={[
                        styles.sectionButton,
                        {
                          backgroundColor: selectedSection?.id === section.id 
                            ? colors.accent 
                            : colors.surface
                        }
                      ]}
                      onPress={() => handleSectionSelect(section)}
                    >
                      <AppTextWrapper
                        style={[
                          styles.sectionButtonText,
                          {
                            color: selectedSection?.id === section.id 
                              ? colors.primary.toString()
                              : colors.text.toString()
                          }
                        ]}
                      >
                        {section.name}
                      </AppTextWrapper>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedSection && (
                  <ScrollView style={styles.slotsContainer}>
                    <View style={styles.slotsGrid}>
                      {selectedSection.slots.map(slot => (
                        <TouchableOpacity
                          key={slot.id}
                          style={[
                            styles.slotButton,
                            {
                              backgroundColor: getSlotColor(slot.status)
                            }
                          ]}
                        >
                          <AppTextWrapper style={styles.slotNumber}>
                            {slot.number}
                          </AppTextWrapper>
                          <AppTextWrapper style={styles.slotStatus}>
                            {t(slot.status)}
                          </AppTextWrapper>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </>
            )}
          </>
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationSelector: {
    marginBottom: 16,
  },
  locationButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  levelSelector: {
    marginBottom: 16,
  },
  levelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSelector: {
    marginBottom: 16,
  },
  sectionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slotsContainer: {
    flex: 1,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  slotButton: {
    width: (width - 48) / 3,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  slotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  slotStatus: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default ParkingManagementScreen; 