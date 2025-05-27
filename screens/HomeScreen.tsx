import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { ParkingLocation, PricingPlan } from '../types';
import { parkingService } from '../services/parking';
import AppLayout from '../components/layout/AppLayout';
import Animated, { 
  FadeIn, 
  FadeInDown 
} from 'react-native-reanimated';
import { firestore } from '../config/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  const { width } = useWindowDimensions();
  
  const [popularLocations, setPopularLocations] = useState<ParkingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const textInputRef = useRef<TextInput>(null);
  
  // Map coordinates for the specified location in Egypt
  const mapRegion = {
    latitude: 30.233440346065482,
    longitude: 31.705995798063242,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  
  // Load popular parking locations from Firebase
  useEffect(() => {
    const fetchPopularLocations = async () => {
      try {
        setLoading(true);
        
        // Query Firebase directly
        const locationsRef = collection(firestore, 'parkingLocations');
        const q = query(
          locationsRef,
          orderBy('name'),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        const locations = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as ParkingLocation[];
        
        setPopularLocations(locations);
      } catch (error) {
        console.error('Error loading popular locations:', error);
        Alert.alert(t('error'), String(error));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularLocations();
  }, []);
  
  // Sample pricing plans
  const pricingPlans: PricingPlan[] = [
    {
      id: '1',
      name: 'Hourly',
      description: 'Pay as you go',
      locationId: 'all',
      hourlyRate: 5,
      dailyRate: 50,
      monthlyRate: 800,
      features: ['Flexible entry/exit', 'No commitment'],
      isPopular: false
    },
    {
      id: '2',
      name: 'Daily',
      description: 'For longer stays',
      locationId: 'all',
      hourlyRate: 0,
      dailyRate: 40,
      monthlyRate: 0,
      features: ['24 hour access', 'Save vs hourly rate'],
      isPopular: true
    },
    {
      id: '3',
      name: 'Monthly',
      description: 'Regular parkers',
      locationId: 'all',
      hourlyRate: 0,
      dailyRate: 0,
      monthlyRate: 600,
      features: ['Reserved spot', 'Best value'],
      isPopular: false
    }
  ];
  
  const renderLocationItem = ({ item }: { item: ParkingLocation }) => (
    <TouchableOpacity 
      style={[
        styles.locationCard, 
        { 
          backgroundColor: themeMode === 'dark' ? colors.dark.surface : colors.light.surface,
          width: width * 0.8,
          marginRight: 16
        }
      ]}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to parking details
        Alert.alert(
          t('parkingDetails'),
          t('notImplemented'),
          [{ text: t('ok') }]
        );
      }}
    >
      {item.images && item.images.length > 0 ? (
        <View style={styles.locationImage}>
          <MapView
            style={styles.mapPreview}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title={item.name}
              description={item.address}
            >
              <Ionicons name="location" size={24} color={colors.accent} />
            </Marker>
          </MapView>
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
            style={styles.mapGradient}
          />
        </View>
      ) : (
        <View style={[styles.placeholderImage, { backgroundColor: colors.accent + '30' }]}>
          <Ionicons name="car-outline" size={40} color={colors.accent} />
        </View>
      )}
      
      <View style={styles.locationInfo}>
        <Text 
          style={[
            styles.locationName, 
            { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        
        <Text 
          style={[
            styles.locationAddress, 
            { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
          ]}
          numberOfLines={2}
        >
          {item.address}
        </Text>
        
        <View style={styles.locationDetails}>
          <View style={styles.locationDetail}>
            <Ionicons 
              name="car-outline" 
              size={16} 
              color={colors.accent} 
              style={{ marginRight: 4 }}
            />
            <Text 
              style={[
                styles.locationDetailText, 
                { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
              ]}
            >
              {item.availableSlots}/{item.totalSlots} {t('available')}
            </Text>
          </View>
          
          <View style={styles.locationDetail}>
            <Ionicons 
              name="cash-outline" 
              size={16} 
              color={colors.accent} 
              style={{ marginRight: 4 }}
            />
            <Text 
              style={[
                styles.locationDetailText, 
                { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
              ]}
            >
              LE {item.priceRange.min}-{item.priceRange.max}/{t('perHour')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderPricingItem = ({ item }: { item: PricingPlan }) => (
    <TouchableOpacity 
      style={[
        styles.pricingCard, 
        { 
          backgroundColor: themeMode === 'dark' ? colors.dark.surface : colors.light.surface,
          borderColor: item.isPopular ? colors.accent : 'transparent',
        }
      ]}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to pricing details
        navigation.navigate('PricesPage');
      }}
    >
      {item.isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
          <Text style={styles.popularBadgeText}>
            Popular
          </Text>
        </View>
      )}
      
      <Text 
        style={[
          styles.pricingName, 
          { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
        ]}
      >
        {item.name}
      </Text>
      
      <Text 
        style={[
          styles.pricingDescription, 
          { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
        ]}
      >
        {item.description}
      </Text>
      
      <View style={styles.pricingPrices}>
        {item.hourlyRate > 0 && (
          <View style={styles.priceItem}>
            <Text 
              style={[
                styles.priceValue, 
                { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
              ]}
            >
              LE {item.hourlyRate}
            </Text>
            <Text 
              style={[
                styles.priceLabel, 
                { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
              ]}
            >
              {t('perHour')}
            </Text>
          </View>
        )}
        
        {item.dailyRate > 0 && (
          <View style={styles.priceItem}>
            <Text 
              style={[
                styles.priceValue, 
                { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
              ]}
            >
              LE {item.dailyRate}
            </Text>
            <Text 
              style={[
                styles.priceLabel, 
                { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
              ]}
            >
              {t('perDay')}
            </Text>
          </View>
        )}
        
        {item.monthlyRate > 0 && (
          <View style={styles.priceItem}>
            <Text 
              style={[
                styles.priceValue, 
                { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
              ]}
            >
              LE {item.monthlyRate}
            </Text>
            <Text 
              style={[
                styles.priceLabel, 
                { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
              ]}
            >
              {t('perMonth')}
            </Text>
          </View>
        )}
      </View>
      
      {item.features.length > 0 && (
        <View style={styles.featuresList}>
          {item.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={14} 
                color={colors.accent} 
                style={{ marginRight: 6 }}
              />
              <Text 
                style={[
                  styles.featureText, 
                  { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.detailsButton, { backgroundColor: colors.accent + '20' }]}
      >
        <Text style={[styles.detailsButtonText, { color: colors.accent }]}>
          {t('details')}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleTextInputChange = (text: string) => {
    setMessage(text);
  };

  const handleProfilePress = () => {
    navigation.navigate('Account');
  };

  if (loading) {
    return (
      <AppLayout 
        showLogo={true}
        showProfileButton={true}
        onProfilePress={handleProfilePress}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[
            styles.loadingText, 
            { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
          ]}>
            {t('loading')}
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      showLogo={true}
      showProfileButton={true}
      onProfilePress={handleProfilePress}
    >
      <View style={styles.container}>
        {/* Hero Section */}
        <Animated.View 
          style={styles.heroSection}
          entering={FadeInDown.duration(800).delay(300)}
        >
          <Text style={[
            styles.heroTitle, 
            { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
          ]}>
            {t('smartParking')}
          </Text>
          <Text style={[
            styles.heroSubtitle, 
            { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
          ]}>
            {t('madeSimple')}
          </Text>
          <Text style={[
            styles.heroDescription, 
            { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
          ]}>
            {t('homeDescription')}
          </Text>
          
          <View style={[
            styles.actionButtons,
            { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
          ]}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.accent }]}
              onPress={() => {
                // Navigate to find parking
                navigation.navigate('Parking');
              }}
            >
              <Text style={styles.primaryButtonText}>
                {t('findSpot')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: colors.accent }]}
              onPress={() => {
                // Navigate to my bookings
                navigation.navigate('PastBookings');
              }}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
                {t('myBookings')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Map Section */}
        <Animated.View 
          style={styles.mapContainer}
          entering={FadeInDown.duration(800).delay(400)}
        >
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
          >
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="Bakisena Parking"
              description="6PM4+7C, Cairo Governorate Desert, Al-Sharqia Governorate 7060010"
            >
              <Ionicons name="location" size={30} color={colors.accent} />
            </Marker>
          </MapView>
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
            style={styles.mapGradient}
          />
        </Animated.View>
        
        {/* Message Input */}
        <Animated.View 
          style={[
            styles.messageInputContainer,
            { backgroundColor: themeMode === 'dark' ? colors.dark.surface : colors.light.surface }
          ]}
          entering={FadeInDown.duration(800).delay(500)}
        >
          <TextInput
            ref={textInputRef}
            style={[
              styles.messageInput,
              { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
            ]}
            placeholder="Type a message..."
            placeholderTextColor={themeMode === 'dark' ? colors.dark.text.hint : colors.light.text.hint}
            value={message}
            onChangeText={handleTextInputChange}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              if (message.trim()) {
                // Process message here
                Alert.alert('Message', 'Your message has been sent!');
                setMessage('');
                Keyboard.dismiss();
              }
            }}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Locations Section */}
        <Animated.View 
          style={styles.sectionContainer}
          entering={FadeInDown.duration(800).delay(600)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle, 
              { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
            ]}>
              {t('realTimeAvailability')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to all locations
                navigation.navigate('Parking');
              }}
            >
              <Text style={[styles.viewAllText, { color: colors.accent }]}>
                {t('viewAll')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularLocations.length > 0 ? popularLocations : mockLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ListEmptyComponent={
              <View style={styles.emptyLocations}>
                <Text style={[
                  styles.emptyText, 
                  { color: themeMode === 'dark' ? colors.dark.text.secondary : colors.light.text.secondary }
                ]}>
                  No locations available
                </Text>
              </View>
            }
          />
        </Animated.View>
        
        {/* Pricing Section */}
        <Animated.View 
          style={styles.sectionContainer}
          entering={FadeInDown.duration(800).delay(700)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle, 
              { color: themeMode === 'dark' ? colors.dark.text.primary : colors.light.text.primary }
            ]}>
              {t('pricingOverview')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to all pricing plans
                navigation.navigate('PricesPage');
              }}
            >
              <Text style={[styles.viewAllText, { color: colors.accent }]}>
                {t('viewAll')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pricingContainer}>
            {pricingPlans.map((plan) => (
              <View key={plan.id} style={{ width: '100%', marginBottom: 16 }}>
                {renderPricingItem({ item: plan })}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </AppLayout>
  );
};

// Mock locations in case Firebase is not available
const mockLocations: ParkingLocation[] = [
  {
    id: '1',
    name: 'Downtown Parking',
    address: '6PM4+7C, Cairo Governorate Desert, Al-Sharqia Governorate 7060010',
    images: ['https://example.com/image1.jpg'],
    priceRange: { min: 5, max: 10 },
    availableSlots: 25,
    totalSlots: 50,
    coordinates: { latitude: 30.233440346065482, longitude: 31.705995798063242 },
    operatingHours: { open: '06:00', close: '22:00' },
    amenities: ['CCTV', 'Security Guard', 'Covered Parking']
  },
  {
    id: '2',
    name: 'Mall Parking',
    address: 'Mall of Egypt, 6th of October City',
    images: ['https://example.com/image2.jpg'],
    priceRange: { min: 10, max: 15 },
    availableSlots: 120,
    totalSlots: 300,
    coordinates: { latitude: 29.9626, longitude: 31.0891 },
    operatingHours: { open: '08:00', close: '23:00' },
    amenities: ['CCTV', 'Security Guard', 'Covered Parking', 'EV Charging']
  },
  {
    id: '3',
    name: 'Airport Parking',
    address: 'Cairo International Airport',
    images: ['https://example.com/image3.jpg'],
    priceRange: { min: 20, max: 40 },
    availableSlots: 80,
    totalSlots: 200,
    coordinates: { latitude: 30.1219, longitude: 31.4056 },
    operatingHours: { open: '00:00', close: '23:59' },
    amenities: ['CCTV', 'Security Guard', 'Covered Parking', '24/7 Service']
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    marginHorizontal: 24,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messageInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationImage: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  mapPreview: {
    height: 120,
    width: '100%',
  },
  placeholderImage: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    padding: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  locationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDetailText: {
    fontSize: 12,
  },
  pricingContainer: {
    paddingHorizontal: 16,
  },
  pricingCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pricingName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  pricingDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  pricingPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 12,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
  },
  detailsButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyLocations: {
    width: 300,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
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
});

export default HomeScreen;