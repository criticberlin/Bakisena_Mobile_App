import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import { ParkingMap, LoadingScreen } from '../components';
import { ParkingSpot, cairoParkingSpots } from '../components/map/constants';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import { firestore } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import FallbackParkingMap from '../components/map/FallbackParkingMap';

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
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [useMapFallback, setUseMapFallback] = useState(false);

  // Default region (Cairo)
  const defaultRegion = {
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Check if we need to use the map fallback (e.g., in Expo Go)
  useEffect(() => {
    const checkMapAvailability = () => {
      try {
        // This specifically targets the error we're seeing in Expo Go
        const isExpoGo = Platform.OS === 'android' && !!(global as any).__expo;
        if (isExpoGo) {
          console.log('Running in Expo Go - Using map fallback');
          setUseMapFallback(true);
        }
      } catch (error) {
        console.error('Error checking map availability:', error);
        setUseMapFallback(true);
      }
    };

    checkMapAvailability();
  }, []);

  // Get user's location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError('Error getting location');
      }
    };

    if (Platform.OS !== 'web') {
      getUserLocation();
    }
  }, []);
  
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
            if (snapshot.empty) {
              console.log('No parking spots found, using default spots data');
              setParkingSpots(cairoParkingSpots);
              setIsUsingMockData(true);
            } else {
              const spots = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  latitude: data.latitude ?? 30.0444,
                  longitude: data.longitude ?? 31.2357,
                  status: data.status ?? 'available',
                  name: data.name ?? `Spot ${doc.id}`,
                  floor: data.floor,
                  price: data.price,
                  distance: data.distance,
                  availableSpots: data.availableSpots ?? 0
                } as ParkingSpot;
              });
              
              console.log(`Fetched ${spots.length} parking spots`);
              setParkingSpots(spots);
              setIsUsingMockData(false);
            }
          } catch (error) {
            console.error('Error processing parking spots data:', error);
            setParkingSpots(cairoParkingSpots);
            setIsUsingMockData(true);
          } finally {
            setLoading(false);
          }
        }, (error) => {
          console.error('Error in parking spots snapshot listener:', error);
          setParkingSpots(cairoParkingSpots);
          setIsUsingMockData(true);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up parking spots listener:', error);
        setParkingSpots(cairoParkingSpots);
        setIsUsingMockData(true);
        setLoading(false);
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
      Alert.alert(t('error'), 'Please login to reserve a parking spot');
      return;
    }
    
    if (spot.status === 'reserved') {
      Alert.alert(t('error'), 'This spot is already reserved');
      return;
    }
    
    try {
      if (isUsingMockData) {
        // Update the state for mock data
        setParkingSpots(prevSpots => 
          prevSpots.map(s => 
            s.id === spot.id ? { ...s, status: 'reserved' } : s
          )
        );
        Alert.alert(t('confirmBooking'), `${t('bookingId')}: ${spot.name || spot.id}`);
        return;
      }

      // Update the spot status in Firestore
      const spotRef = doc(firestore, 'parkingSpots', String(spot.id));
      await updateDoc(spotRef, {
        status: 'reserved',
        reservedBy: user.uid,
        reservedAt: serverTimestamp()
      });
      
      // Create a booking record
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
      
      Alert.alert(t('confirmBooking'), `${t('bookingId')}: ${spot.name || spot.id}`);
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
          <ActivityIndicator size="large" color={currentColors.primary} />
          <Text style={[styles.loadingText, { color: currentColors.text.primary }]}>
            {t('loading')}...
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout containerType="screen" scrollable={false}>
      <View style={styles.container}>
        {useMapFallback ? (
          <FallbackParkingMap
            parkingSpots={parkingSpots}
            onSpotPress={handleSpotPress}
            onReserveSpot={handleReserveSpot}
            entryTime={entryTime}
            estimatedExitTime={estimatedExitTime}
            isRealTime={true}
            themeMode={themeMode}
            colors={currentColors}
          />
        ) : (
          <ParkingMap
            parkingSpots={parkingSpots}
            onSpotPress={handleSpotPress}
            onReserveSpot={handleReserveSpot}
            userLocation={userLocation ?? undefined}
            entryTime={entryTime}
            estimatedExitTime={estimatedExitTime}
            isRealTime={true}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onNavigate={handleTabNavigation}
            themeMode={themeMode}
            colors={currentColors}
            initialRegion={defaultRegion}
          />
        )}

        {/* Mock Data Indicator */}
        {isUsingMockData && (
          <View style={styles.mockDataBadge}>
            <Text style={styles.mockDataText}>{t('usingDemoData' as any)}</Text>
          </View>
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  mockDataBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mockDataText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ParkingScreen; 