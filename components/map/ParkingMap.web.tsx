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
import { ParkingMapProps, cairoParkingSpots, COLORS, ParkingSpot } from './constants';

// Adjust sizes based on screen dimensions for responsiveness
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 1024; // Based on standard desktop width

const normalize = (size: number) => {
  const newSize = size * (scale > 1 ? 1 : scale);
  return Math.round(newSize);
};

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

  // Adjust sizes based on screen dimensions for responsiveness
  const isSmallScreen = SCREEN_WIDTH < 768;

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
        <Text style={styles.headerTitle}>Smart Parking System</Text>
        <Text style={styles.headerSubtitle}>Find and reserve parking spaces in real-time</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Left Side Content */}
          <View style={styles.leftContent}>
            {/* Legend */}
            <View style={styles.legendContainer}>
              <Text style={styles.sectionTitle}>Parking Legend</Text>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.available }]} />
                <Text style={styles.legendText}>Available Spot</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.reserved }]} />
                <Text style={styles.legendText}>Reserved Spot</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.userLocationDot}>
                  <Ionicons name="car" size={14} color="white" />
                </View>
                <Text style={styles.legendText}>Your Location</Text>
              </View>
            </View>
            
            {/* Timing Information */}
            <View style={styles.timeCard}>
              <Text style={styles.sectionTitle}>Parking Times</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeItem}>
                  <Ionicons name="time-outline" size={20} color={COLORS.white} />
                  <Text style={styles.timeLabel}>Entry Time</Text>
                  <Text style={styles.timeValue}>{entryTime}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Ionicons name="exit-outline" size={20} color={COLORS.white} />
                  <Text style={styles.timeLabel}>Estimated Exit</Text>
                  <Text style={styles.timeValue}>{estimatedExitTime}</Text>
                </View>
              </View>
            </View>
            
            {/* Features */}
            <View style={styles.featuresCard}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featureItem}>
                <Ionicons name="bookmark" size={20} color={COLORS.white} />
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Reserve Your Spot</Text>
                  <Text style={styles.featureDescription}>Pre-book parking spaces to save time</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="notifications" size={20} color={COLORS.white} />
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Real-time Updates</Text>
                  <Text style={styles.featureDescription}>Get alerts when spots become available</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="navigate" size={20} color={COLORS.white} />
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Navigation</Text>
                  <Text style={styles.featureDescription}>Get directions to your reserved spot</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Right Side Content - Parking Grid Map */}
          <View style={styles.rightContent}>
            <View style={styles.mapContainer}>
              <Text style={styles.sectionTitle}>Parking Map</Text>
              
              {/* Simplified Grid View for Web */}
              <View style={styles.gridContainer}>
                <View style={styles.parkingGrid}>
                  {/* Row 1 */}
                  <View style={styles.gridRow}>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, styles.availableSpot]} 
                      onPress={() => handleSpotPress(parkingSpots[0])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, styles.availableSpot]}
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
                    <View style={styles.userLocation}>
                      <Ionicons name="car" size={22} color="white" />
                    </View>
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                  </View>
                  
                  {/* Row 3 */}
                  <View style={styles.gridRow}>
                    <TouchableOpacity 
                      style={[styles.parkingSpot, styles.availableSpot]}
                      onPress={() => handleSpotPress(parkingSpots[2])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, styles.availableSpot]}
                      onPress={() => handleSpotPress(parkingSpots[3])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Row 4 */}
                  <View style={styles.gridRow}>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, styles.reservedSpot]}
                      onPress={() => handleSpotPress(parkingSpots[1])}
                    >
                      <Text style={styles.spotLabel}>P</Text>
                    </TouchableOpacity>
                    <View style={styles.gridCell} />
                    <TouchableOpacity 
                      style={[styles.parkingSpot, styles.reservedSpot]}
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
                    backgroundColor: selectedSpot.status === 'available' ? COLORS.success : COLORS.reserved
                  }]}>
                    <Text style={styles.statusBadgeText}>
                      {selectedSpot.status.charAt(0).toUpperCase() + selectedSpot.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.spotDetails}>
                  {selectedSpot.floor && (
                    <View style={styles.spotDetailItem}>
                      <Ionicons name="layers-outline" size={16} color={COLORS.subtext} />
                      <Text style={styles.spotDetailText}>Floor: {selectedSpot.floor}</Text>
                    </View>
                  )}
                  
                  {selectedSpot.price && (
                    <View style={styles.spotDetailItem}>
                      <Ionicons name="cash-outline" size={16} color={COLORS.subtext} />
                      <Text style={styles.spotDetailText}>Price: ${selectedSpot.price}/hr</Text>
                    </View>
                  )}
                  
                  {selectedSpot.distance && (
                    <View style={styles.spotDetailItem}>
                      <Ionicons name="location-outline" size={16} color={COLORS.subtext} />
                      <Text style={styles.spotDetailText}>Distance: {selectedSpot.distance} km</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.reserveButton,
                    selectedSpot.status === 'reserved' && { backgroundColor: COLORS.disabled }
                  ]}
                  onPress={() => handleReserveSpot(selectedSpot)}
                  disabled={selectedSpot.status === 'reserved'}
                >
                  <Text style={styles.reserveButtonText}>
                    {selectedSpot.status === 'available' ? 'Reserve This Spot' : 'Spot Reserved'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* List of Available Spots */}
            <View style={styles.availableSpotsCard}>
              <Text style={styles.sectionTitle}>Available Spots</Text>
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
                        { backgroundColor: spot.status === 'available' ? COLORS.available : COLORS.reserved }
                      ]} />
                      <Text style={styles.spotItemName}>{spot.name || `Spot ${spot.id}`}</Text>
                    </View>
                    
                    <View style={styles.spotItemRight}>
                      {spot.distance && (
                        <Text style={styles.spotItemDistance}>{spot.distance} km</Text>
                      )}
                      <Text style={[
                        styles.spotItemStatus,
                        { color: spot.status === 'available' ? COLORS.success : COLORS.reserved }
                      ]}>
                        {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'Monitor' && styles.activeNavButton]}
          onPress={() => handleTabPress('Monitor')}
        >
          <Ionicons 
            name="car" 
            size={24} 
            color={activeTab === 'Monitor' ? COLORS.white : COLORS.subtext} 
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
            color={activeTab === 'Parking' ? COLORS.white : COLORS.subtext} 
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
            color={activeTab === 'Connected' ? COLORS.white : COLORS.subtext} 
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
            color={activeTab === 'Account' ? COLORS.white : COLORS.subtext} 
          />
          <Text style={[styles.navButtonText, activeTab === 'Account' && styles.activeNavText]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.subtext,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  leftContent: {
    width: SCREEN_WIDTH < 1024 ? '100%' : '30%',
    marginRight: SCREEN_WIDTH < 1024 ? 0 : 20,
    marginBottom: SCREEN_WIDTH < 1024 ? 20 : 0,
  },
  rightContent: {
    width: SCREEN_WIDTH < 1024 ? '100%' : '65%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  // Legend styles
  legendContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legendText: {
    color: COLORS.text,
    fontSize: 14,
  },
  // Time card styles
  timeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    color: COLORS.subtext,
    fontSize: 14,
    marginVertical: 6,
  },
  timeValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Features card styles
  featuresCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  featureTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  featureDescription: {
    color: COLORS.subtext,
    fontSize: 14,
  },
  // Map styles
  mapContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  gridContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    position: 'relative',
    height: 320,
  },
  parkingGrid: {
    flex: 1,
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  gridCell: {
    width: 40,
    height: 40,
    margin: 8,
  },
  parkingSpot: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
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
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  // Spot info styles
  spotInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  spotInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  spotDetails: {
    marginBottom: 15,
  },
  spotDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotDetailText: {
    color: COLORS.text,
    fontSize: 14,
    marginLeft: 10,
  },
  reserveButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reservedButton: {
    backgroundColor: COLORS.disabled,
  },
  reserveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Available spots list
  availableSpotsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
  },
  spotsScrollView: {
    maxHeight: 200,
  },
  spotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedSpotItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Light blue background
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  spotItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotItemDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  spotItemName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  spotItemRight: {
    alignItems: 'flex-end',
  },
  spotItemDistance: {
    color: COLORS.subtext,
    fontSize: 12,
    marginBottom: 2,
  },
  spotItemStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Bottom navigation
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  activeNavButton: {
    borderTopWidth: 2,
    borderTopColor: COLORS.secondary,
    marginTop: -2,
  },
  navButtonText: {
    color: COLORS.subtext,
    fontSize: 14,
    marginTop: 5,
  },
  activeNavText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default ParkingMap; 