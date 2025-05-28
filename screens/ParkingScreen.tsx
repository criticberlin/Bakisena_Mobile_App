import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { ParkingMap, LoadingScreen } from '../components';
import { ParkingSpot } from '../components/map/ParkingMap';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import { firestore } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';

const ParkingScreen: React.FC = () => {
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [entryTime, setEntryTime] = useState<string>('10:00 AM');
  const [estimatedExitTime, setEstimatedExitTime] = useState<string>('01:00 PM');
  const [loading, setLoading] = useState(true);
  
  // Fetch parking spots from Firebase
  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        setLoading(true);
        
        // Query Firebase for parking spots
        const spotsRef = collection(firestore, 'parkingSpots');
        const q = query(spotsRef, orderBy('name'));
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            // Use type assertion with unknown first to avoid TypeScript error
            const spots = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as unknown as ParkingSpot[];
            
            console.log(`Fetched ${spots.length} parking spots`);
            
            if (spots.length === 0) {
              // If no spots are found, we'll use default spots
              console.log('No parking spots found in Firestore, using defaults');
              // Default would be handled automatically
            } else {
              setParkingSpots(spots);
            }
          } catch (error) {
            console.error('Error processing parking spots data:', error);
            Alert.alert(t('error'), String(error));
          } finally {
            setLoading(false);
          }
        }, (error) => {
          console.error('Error in parking spots snapshot listener:', error);
          setLoading(false);
          Alert.alert(t('error'), String(error));
        });
        
        // Clean up listener on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up parking spots listener:', error);
        setLoading(false);
        Alert.alert(t('error'), String(error));
      }
    };
    
    fetchParkingSpots();
  }, []);
  
  // Handle spot selection
  const handleSpotPress = (spot: ParkingSpot) => {
    console.log('Selected spot:', spot);
  };
  
  // Handle spot reservation
  const handleReserveSpot = async (spot: ParkingSpot) => {
    if (!user) {
      Alert.alert(
        t('error'), 
        t('notImplemented'),
        [{ text: t('ok') }]
      );
      return;
    }
    
    if (spot.status === 'reserved') {
      Alert.alert(
        t('reservedSlots'),
        t('noBookings'),
        [{ text: t('ok') }]
      );
      return;
    }
    
    try {
      // Update the spot status in Firestore
      const spotRef = doc(firestore, 'parkingSpots', String(spot.id));
      await updateDoc(spotRef, {
        status: 'reserved',
        reservedBy: user.uid,
        reservedAt: serverTimestamp()
      });
      
      // The UI will update automatically through the snapshot listener
      
      // Also create a booking record
      const bookingsRef = collection(firestore, 'bookings');
      const bookingData = {
        userId: user.uid,
        spotId: spot.id,
        spotName: spot.name,
        status: 'active',
        entryTime: entryTime,
        estimatedExitTime: estimatedExitTime,
        createdAt: serverTimestamp()
      };
      
      // We'd normally add the booking to Firestore here
      // For this example, we'll just show a success message
      
      Alert.alert(
        t('confirmBooking'),
        `${t('bookingId')}: ${spot.name || spot.id}`,
        [{ text: t('ok') }]
      );
    } catch (error) {
      console.error('Error reserving spot:', error);
      Alert.alert(t('error'), String(error));
    }
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
  
  if (loading) {
    return (
      <AppLayout containerType="screen" scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: currentColors.text.primary }]}>
            {t('loading')}
          </Text>
        </View>
      </AppLayout>
    );
  }
  
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default ParkingScreen; 