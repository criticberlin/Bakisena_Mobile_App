import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ParkingMap, LoadingScreen } from '../components';
import { ParkingSpot, cairoParkingSpots } from '../components/map/ParkingMap';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';

const ParkingScreen: React.FC = () => {
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

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
        t('reservedSlots'),
        t('noBookings'),
        [{ text: t('ok') }]
      );
      return;
    }
    
    // Update the spot status to reserved
    const updatedSpots = parkingSpots.map(item => 
      item.id === spot.id ? { ...item, status: 'reserved' as const } : item
    );
    
    setParkingSpots(updatedSpots);
    
    Alert.alert(
      t('confirmBooking'),
      `${t('bookingId')}: ${spot.name || spot.id}`,
      [{ text: t('ok') }]
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
    <AppLayout containerType="screen" scrollable={false}>
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
        themeMode={themeMode}
        colors={currentColors}
      />
    </AppLayout>
  );
};

export default ParkingScreen; 