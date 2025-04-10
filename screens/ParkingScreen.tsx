import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParkingMap } from '../components';
import { ParkingSpot, cairoParkingSpots } from '../components/map/ParkingMap';
import theme from '../theme/theme';

const ParkingScreen: React.FC = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(cairoParkingSpots);
  const [entryTime, setEntryTime] = useState<string>('10:00 AM');
  const [estimatedExitTime, setEstimatedExitTime] = useState<string>('01:00 PM');
  
  // Handle spot selection
  const handleSpotPress = (spot: ParkingSpot) => {
    console.log('Selected spot:', spot);
  };
  
  // Handle spot reservation
  const handleReserveSpot = (spot: ParkingSpot) => {
    if (spot.status === 'reserved') {
      Alert.alert(
        'Spot Reserved',
        'This parking spot is already reserved.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Update the spot status to reserved
    const updatedSpots = parkingSpots.map(item => 
      item.id === spot.id ? { ...item, status: 'reserved' as const } : item
    );
    
    setParkingSpots(updatedSpots);
    
    Alert.alert(
      'Spot Reserved',
      `You have successfully reserved spot ${spot.name || spot.id}.`,
      [{ text: 'OK' }]
    );
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    console.log('Zoom in');
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    console.log('Zoom out');
  };
  
  // Handle tab navigation
  const handleTabNavigation = (tab: string) => {
    console.log('Navigate to tab:', tab);
  };
  
  // Simulate real-time updates by randomly changing spot status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * parkingSpots.length);
        const updatedSpots = [...parkingSpots];
        updatedSpots[randomIndex] = {
          ...updatedSpots[randomIndex],
          status: updatedSpots[randomIndex].status === 'available' ? 'reserved' as const : 'available' as const
        };
        setParkingSpots(updatedSpots);
      }
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [parkingSpots]);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <ParkingMap 
        parkingSpots={parkingSpots}
        onSpotPress={handleSpotPress}
        onReserveSpot={handleReserveSpot}
        entryTime={entryTime}
        estimatedExitTime={estimatedExitTime}
        isRealTime={true}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onNavigate={handleTabNavigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default ParkingScreen; 