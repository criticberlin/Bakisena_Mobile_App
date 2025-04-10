import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParkingMapProps, cairoParkingSpots, ParkingSpot } from './constants';
import { useTheme } from '../../theme/ThemeContext';
import { AppTextWrapper } from '../../theme';
import theme from '../../theme/theme';

// Adjust sizes based on screen dimensions for responsiveness
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Apply global scaling factor
const SCALED_SCREEN_WIDTH = SCREEN_WIDTH * theme.GLOBAL_SCALE;
// Define isSmallScreen at module level for use in styles
const isSmallScreen = SCALED_SCREEN_WIDTH < 768 * theme.GLOBAL_SCALE;

// Custom normalize function that incorporates the global scale
const normalize = (size: number) => {
  // Apply responsive scaling based on screen size
  const baseScale = SCALED_SCREEN_WIDTH / 1024;
  const responsiveScale = baseScale > 1 ? 1 : baseScale;
  // Apply the theme's global scaling factor
  return Math.round(size * responsiveScale);
};

// Update all fixed dimensions in styles
const gridCellSize = theme.scale(40);
const gridCellMargin = theme.scale(8);
const iconSmall = theme.scale(14);
const iconMedium = theme.scale(20);
const iconLarge = theme.scale(24);
const paddingBase = theme.scale(15);
const borderRadiusMd = theme.scale(12);
const borderRadiusSm = theme.scale(8);
const borderRadiusCircle = theme.scale(20);

// Web implementation of ParkingMap (without using react-native-maps)
const ParkingMap: React.FC<ParkingMapProps> = ({
  parkingSpots = cairoParkingSpots,
  onSpotPress,
  onReserveSpot,
  entryTime = '10:00 AM',
  estimatedExitTime = '01:00 PM',
  isRealTime = true,
  onNavigate,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [activeTab, setActiveTab] = useState('Parking');
  const { colors, themeMode } = useTheme();

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <AppTextWrapper variant="title" style={styles.headerTitle}>Smart Parking System</AppTextWrapper>
        <AppTextWrapper variant="body" style={styles.headerSubtitle}>Find and reserve parking spaces in real-time</AppTextWrapper>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Left Side Content */}
          <View style={styles.leftContent}>
            {/* Legend */}
            <View style={[styles.legendContainer, { backgroundColor: colors.surface }]}>
              <AppTextWrapper variant="subtitle" style={styles.sectionTitle}>Parking Legend</AppTextWrapper>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.text.secondary }]} />
                <AppTextWrapper style={styles.legendText}>Available Spot</AppTextWrapper>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <AppTextWrapper style={styles.legendText}>Reserved Spot</AppTextWrapper>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.userLocationDot, { backgroundColor: colors.primary }]}>
                  <Ionicons name="car" size={14} color={colors.secondary} />
                </View>
                <AppTextWrapper style={styles.legendText}>Your Location</AppTextWrapper>
              </View>
            </View>
            
            {/* Timing Information */}
            <View style={[styles.timeCard, { backgroundColor: colors.surface }]}>
              <AppTextWrapper variant="subtitle" style={styles.sectionTitle}>Parking Times</AppTextWrapper>
              <View style={styles.timeRow}>
                <View style={styles.timeItem}>
                  <Ionicons name="time-outline" size={20} color={colors.text.primary} />
                  <AppTextWrapper style={styles.timeLabel}>Entry Time</AppTextWrapper>
                  <AppTextWrapper style={styles.timeValue}>{entryTime}</AppTextWrapper>
                </View>
                <View style={styles.timeItem}>
                  <Ionicons name="exit-outline" size={20} color={colors.text.primary} />
                  <AppTextWrapper style={styles.timeLabel}>Estimated Exit</AppTextWrapper>
                  <AppTextWrapper style={styles.timeValue}>{estimatedExitTime}</AppTextWrapper>
                </View>
              </View>
            </View>
            
            {/* Features */}
            <View style={[styles.featuresCard, { backgroundColor: colors.surface }]}>
              <AppTextWrapper variant="subtitle" style={styles.sectionTitle}>Features</AppTextWrapper>
              <View style={styles.featureItem}>
                <Ionicons name="bookmark" size={20} color={colors.text.primary} />
                <View style={styles.featureTextContainer}>
                  <AppTextWrapper variant="subtitle" style={styles.featureTitle}>Reserve Your Spot</AppTextWrapper>
                  <AppTextWrapper style={styles.featureDescription}>Pre-book parking spaces to save time</AppTextWrapper>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="notifications" size={20} color={colors.text.primary} />
                <View style={styles.featureTextContainer}>
                  <AppTextWrapper variant="subtitle" style={styles.featureTitle}>Real-time Updates</AppTextWrapper>
                  <AppTextWrapper style={styles.featureDescription}>Get alerts when spots become available</AppTextWrapper>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="navigate" size={20} color={colors.text.primary} />
                <View style={styles.featureTextContainer}>
                  <AppTextWrapper variant="subtitle" style={styles.featureTitle}>Navigation</AppTextWrapper>
                  <AppTextWrapper style={styles.featureDescription}>Get directions to your reserved spot</AppTextWrapper>
                </View>
              </View>
            </View>
          </View>
          
          {/* Right Side Content - Parking Grid Map */}
          <View style={styles.rightContent}>
            <View style={[styles.mapContainer, { backgroundColor: colors.surface }]}>
              <AppTextWrapper variant="subtitle" style={styles.sectionTitle}>Parking Map</AppTextWrapper>
              
              {/* Simplified Grid View for Web */}
              <View style={styles.gridContainer}>
                <View style={styles.parkingGrid}>
                  {/* Row 1 */}
                  <View style={styles.gridRow}>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, { backgroundColor: colors.text.secondary }]} 
                      onPress={() => handleSpotPress(parkingSpots[0])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, { backgroundColor: colors.text.secondary }]}
                      onPress={() => handleSpotPress(parkingSpots[3])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                  </View>
                  
                  {/* Row 2 */}
                  <View style={styles.gridRow}>
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                    <View style={[styles.userLocation, { backgroundColor: colors.primary }]}>
                      <Ionicons name="car" size={22} color={colors.secondary} />
                    </View>
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                  </View>
                  
                  {/* Row 3 */}
                  <View style={styles.gridRow}>
                    <TouchableOpacity 
                      style={[styles.parkingSpot, { backgroundColor: colors.text.secondary }]}
                      onPress={() => handleSpotPress(parkingSpots[2])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, { backgroundColor: colors.text.secondary }]}
                      onPress={() => handleSpotPress(parkingSpots[3])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Row 4 */}
                  <View style={styles.gridRow}>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, { backgroundColor: colors.accent }]}
                      onPress={() => handleSpotPress(parkingSpots[1])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, { backgroundColor: colors.accent }]}
                      onPress={() => handleSpotPress(parkingSpots[4])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                  </View>
                </View>
                
                {/* Map Controls */}
                <View style={styles.mapControls}>
                  <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="add" size={24} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="remove" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Selected Spot Information */}
            {selectedSpot && (
              <View style={styles.spotInfoCard}>
                <View style={styles.spotInfoHeader}>
                  <Text style={styles.spotInfoTitle}>{selectedSpot.name || `Spot ${selectedSpot.id}`}</Text>
                  <View style={[styles.statusBadge, {
                    backgroundColor: selectedSpot.status === 'available' ? colors.success : colors.accent
                  }]}>
                    <Text style={styles.statusBadgeText}>
                      {selectedSpot.status.charAt(0).toUpperCase() + selectedSpot.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.spotDetails}>
                  {selectedSpot.floor && (
                    <View style={styles.spotDetailItem}>
                      <Ionicons name="layers-outline" size={16} color={colors.text.secondary} />
                      <AppTextWrapper style={styles.spotDetailText}>Floor: {selectedSpot.floor}</AppTextWrapper>
                    </View>
                  )}
                  
                  {selectedSpot.price && (
                    <View style={styles.spotDetailItem}>
                      <Ionicons name="cash-outline" size={16} color={colors.text.secondary} />
                      <AppTextWrapper style={styles.spotDetailText}>Price: ${selectedSpot.price}/hr</AppTextWrapper>
                    </View>
                  )}
                  
                  {selectedSpot.distance && (
                    <View style={styles.spotDetailItem}>
                      <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                      <AppTextWrapper style={styles.spotDetailText}>Distance: {selectedSpot.distance} km</AppTextWrapper>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.reserveButton,
                    selectedSpot.status === 'reserved' && { backgroundColor: colors.text.disabled }
                  ]}
                  onPress={() => handleReserveSpot(selectedSpot)}
                  disabled={selectedSpot.status === 'reserved'}
                >
                  <AppTextWrapper style={styles.reserveButtonText}>
                    {selectedSpot.status === 'available' ? 'Reserve This Spot' : 'Spot Reserved'}
                  </AppTextWrapper>
                </TouchableOpacity>
              </View>
            )}

            {/* List of Available Spots */}
            <View style={styles.availableSpotsCard}>
              <AppTextWrapper variant="subtitle" style={styles.sectionTitle}>Available Spots</AppTextWrapper>
              <ScrollView style={styles.spotsScrollView}>
                {parkingSpots.map(spot => (
                  <TouchableOpacity 
                    key={spot.id}
                    style={[
                      styles.spotItem,
                      selectedSpot?.id === spot.id && styles.selectedSpotItem
                    ]}
                    onPress={() => handleSpotPress(spot)}
                  >
                    <View style={styles.spotItemLeft}>
                      <View style={[
                        styles.spotItemDot,
                        { backgroundColor: spot.status === 'available' ? colors.success : colors.accent }
                      ]} />
                      <AppTextWrapper style={styles.spotItemName}>{spot.name || `Spot ${spot.id}`}</AppTextWrapper>
                    </View>
                    
                    <View style={styles.spotItemRight}>
                      {spot.distance && (
                        <AppTextWrapper style={styles.spotItemDistance}>{spot.distance} km</AppTextWrapper>
                      )}
                      <AppTextWrapper style={[
                        styles.spotItemStatus,
                        { color: spot.status === 'available' ? colors.success : colors.accent }
                      ]}>
                        {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                      </AppTextWrapper>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    padding: theme.scale(24),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.scale(28),
    fontWeight: 'bold',
    marginBottom: theme.scale(5),
  },
  headerSubtitle: {
    fontSize: theme.scale(16),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    padding: isSmallScreen ? theme.scale(16) : theme.scale(24),
  },
  leftContent: {
    flex: isSmallScreen ? undefined : 1,
    marginRight: isSmallScreen ? 0 : theme.scale(16),
    marginBottom: isSmallScreen ? theme.scale(16) : 0,
  },
  rightContent: {
    flex: isSmallScreen ? undefined : 2,
  },
  sectionTitle: {
    fontSize: theme.scale(18),
    fontWeight: 'bold',
    marginBottom: theme.scale(12),
  },
  // Legend styles
  legendContainer: {
    borderRadius: borderRadiusMd,
    padding: paddingBase,
    marginBottom: paddingBase,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.scale(10),
  },
  legendDot: {
    width: theme.scale(16),
    height: theme.scale(16),
    borderRadius: theme.scale(8),
    marginRight: theme.scale(10),
  },
  userLocationDot: {
    width: theme.scale(24),
    height: theme.scale(24),
    borderRadius: theme.scale(12),
    marginRight: theme.scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    fontSize: theme.scale(14),
  },
  // Time card styles
  timeCard: {
    borderRadius: borderRadiusMd,
    padding: paddingBase,
    marginBottom: paddingBase,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.scale(5),
  },
  timeItem: {
    alignItems: 'flex-start',
    flex: 1,
  },
  timeLabel: {
    fontSize: theme.scale(14),
    marginVertical: theme.scale(6),
  },
  timeValue: {
    fontSize: theme.scale(18),
    fontWeight: 'bold',
  },
  // Features card styles
  featuresCard: {
    borderRadius: borderRadiusMd,
    padding: paddingBase,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: paddingBase,
  },
  featureTextContainer: {
    marginLeft: theme.scale(12),
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.scale(16),
    fontWeight: 'bold',
    marginBottom: theme.scale(3),
  },
  featureDescription: {
    fontSize: theme.scale(14),
  },
  // Map styles
  mapContainer: {
    borderRadius: borderRadiusMd,
    padding: paddingBase,
    marginBottom: theme.scale(20),
  },
  gridContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: theme.scale(10),
    padding: theme.scale(20),
    position: 'relative',
    height: theme.scale(320),
  },
  parkingGrid: {
    flex: 1,
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.scale(10),
  },
  gridCell: {
    width: gridCellSize,
    height: gridCellSize,
    margin: gridCellMargin,
  },
  parkingSpot: {
    width: gridCellSize,
    height: gridCellSize,
    borderRadius: theme.scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    margin: gridCellMargin,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: theme.scale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: theme.scale(3),
    elevation: 3,
  },
  availableSpot: {
    // Will be set dynamically
  },
  reservedSpot: {
    // Will be set dynamically
  },
  spotLabel: {
    fontSize: theme.scale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  userLocation: {
    width: gridCellSize,
    height: gridCellSize,
    borderRadius: borderRadiusCircle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Spot info styles
  spotInfoCard: {
    borderRadius: borderRadiusMd,
    padding: paddingBase,
    marginBottom: theme.scale(20),
  },
  spotInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.scale(12),
  },
  spotInfoTitle: {
    fontSize: theme.scale(18),
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: theme.scale(10),
    paddingVertical: theme.scale(3),
    borderRadius: theme.scale(12),
    alignSelf: 'flex-start',
    marginTop: theme.scale(5),
    marginBottom: theme.scale(10),
  },
  statusBadgeText: {
    fontSize: theme.scale(12),
    fontWeight: 'bold',
  },
  spotDetails: {
    marginVertical: theme.scale(10),
  },
  spotDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.scale(8),
  },
  spotDetailText: {
    fontSize: theme.scale(14),
    marginLeft: theme.scale(10),
  },
  reserveButton: {
    padding: theme.scale(12),
    borderRadius: borderRadiusSm,
    alignItems: 'center',
  },
  reservedButton: {
    // Will be set dynamically
  },
  reserveButtonText: {
    fontWeight: 'bold',
    fontSize: theme.scale(16),
  },
  // Available spots list
  availableSpotsCard: {
    borderRadius: borderRadiusMd,
    padding: paddingBase,
    marginBottom: theme.scale(20),
  },
  spotsScrollView: {
    maxHeight: theme.scale(250),
  },
  spotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.scale(10),
    borderRadius: borderRadiusSm,
    marginBottom: theme.scale(8),
  },
  selectedSpotItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Light blue background
    borderWidth: 1,
  },
  spotItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotItemDot: {
    width: theme.scale(10),
    height: theme.scale(10),
    borderRadius: theme.scale(5),
    marginRight: theme.scale(10),
  },
  spotItemName: {
    fontSize: theme.scale(14),
    fontWeight: '500',
  },
  spotItemRight: {
    alignItems: 'flex-end',
  },
  spotItemDistance: {
    fontSize: theme.scale(12),
    marginBottom: theme.scale(2),
  },
  spotItemStatus: {
    fontSize: theme.scale(12),
    fontWeight: 'bold',
  },
  mapControls: {
    position: 'absolute',
    right: paddingBase,
    bottom: paddingBase,
  },
  controlButton: {
    width: theme.scale(36),
    height: theme.scale(36),
    backgroundColor: 'white',
    borderRadius: theme.scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.scale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: theme.scale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: theme.scale(3),
    elevation: 3,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.scale(15),
    paddingVertical: theme.scale(10),
    borderBottomWidth: 1,
  },
  navTitle: {
    fontSize: theme.scale(18),
    fontWeight: 'bold',
  },
});

export default ParkingMap; 