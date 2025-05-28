import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay,
  FadeIn,
  SlideInUp
} from 'react-native-reanimated';

import ParkingStatusCard from '../components/home/ParkingStatusCard';
import ActionButton from '../components/ActionButton';
import AppLayout from '../components/layout/AppLayout';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { TabParamList } from '../navigation/TabNavigator';
import theme from '../theme/theme';
import RTLWrapper from '../components/layout/RTLWrapper';
import { firestore } from '../config/firebase';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { ParkingLocation, PricingPlan } from '../types';
import { navigateTo } from '../navigation/NavigationHelper';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList & TabParamList, 'Home'>;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, themeMode } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // State for data
  const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [featuredPricingPlan, setFeaturedPricingPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.95);
  const heroOpacity = useSharedValue(0);
  const quickActionsTranslateY = useSharedValue(20);
  const quickActionsOpacity = useSharedValue(0);
  
  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create sample data if collections don't exist or are empty
        // First, check if collections exist and have data
        try {
          // Fetch parking locations
          const locationsRef = collection(firestore, 'parkingLocations');
          const q = query(locationsRef, orderBy('name'), limit(3));
          
          const locationsSnapshot = await getDocs(q);
          
          // If no locations, use default data
          if (locationsSnapshot.empty) {
            // Use hard-coded demo data as fallback
            const demoLocations: ParkingLocation[] = [
              {
                id: 'demo-loc1',
                name: 'Downtown Parking',
                address: '123 Main St, Cairo',
                coordinates: {
                  latitude: 30.0444,
                  longitude: 31.2357
                },
                totalSlots: 150,
                availableSlots: 45,
                priceRange: {
                  min: 10,
                  max: 25
                },
                operatingHours: {
                  open: '06:00',
                  close: '22:00'
                },
                amenities: ['Security', 'CCTV', 'EV Charging'],
                images: [],
                levels: [] // Empty array to satisfy the type
              },
              {
                id: 'demo-loc2',
                name: 'Mall Parking',
                address: '456 Commerce Blvd, Cairo',
                coordinates: {
                  latitude: 30.0484,
                  longitude: 31.2387
                },
                totalSlots: 300,
                availableSlots: 120,
                priceRange: {
                  min: 15,
                  max: 30
                },
                operatingHours: {
                  open: '09:00',
                  close: '23:00'
                },
                amenities: ['Security', 'CCTV', 'Car Wash'],
                images: [],
                levels: [] // Empty array to satisfy the type
              }
            ];
            
            setParkingLocations(demoLocations);
            console.log('Using demo parking location data');
          } else {
            // Use real data from Firebase
            const locations = locationsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as ParkingLocation[];
            
            setParkingLocations(locations);
            console.log(`Fetched ${locations.length} parking locations`);
          }
          
          // Fetch pricing plans
          const pricingRef = collection(firestore, 'pricingPlans');
          const pricingQuery = query(pricingRef, orderBy('hourlyRate'));
          
          const pricingSnapshot = await getDocs(pricingQuery);
          
          // If no pricing plans, use default data
          if (pricingSnapshot.empty) {
            // Use hard-coded demo data as fallback
            const demoPlans: PricingPlan[] = [
              {
                id: 'demo-plan1',
                locationId: 'demo-loc1',
                name: 'Standard Hourly',
                hourlyRate: 15,
                dailyRate: 120,
                monthlyRate: 2500,
                isActive: true
              },
              {
                id: 'demo-plan2',
                locationId: 'demo-loc2',
                name: 'Premium Hourly',
                hourlyRate: 20,
                dailyRate: 150,
                monthlyRate: 3000,
                discountPercent: 5,
                isActive: true,
              }
            ];
            
            setPricingPlans(demoPlans);
            
            // Set the featured pricing plan
            if (demoPlans.length > 0) {
              setFeaturedPricingPlan(demoPlans[0]);
            }
            
            console.log('Using demo pricing plan data');
          } else {
            // Use real data from Firebase
            const plans = pricingSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as PricingPlan[];
            
            setPricingPlans(plans);
            
            // Get the featured pricing plan
            if (plans.length > 0) {
              setFeaturedPricingPlan(plans[0]);
            }
            
            console.log(`Fetched ${plans.length} pricing plans`);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in data loading process:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Set up animations on mount
  useEffect(() => {
    // Animate header
    headerOpacity.value = withTiming(1, { duration: 800 });
    
    // Animate hero section
    heroScale.value = withDelay(300, withSpring(1, { damping: 12 }));
    heroOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    
    // Animate quick actions
    quickActionsTranslateY.value = withDelay(500, withSpring(0, { damping: 12 }));
    quickActionsOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
  }, []);
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
    opacity: heroOpacity.value,
  }));
  
  const quickActionsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: quickActionsTranslateY.value }],
    opacity: quickActionsOpacity.value,
  }));

  if (loading) {
    return (
      <AppLayout>
        <View style={[
          styles.loadingContainer, 
          { backgroundColor: colors.background }
        ]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[
            styles.loadingText, 
            { color: colors.text.primary, marginTop: 16 }
          ]}>
            {t('loading')}
          </Text>
        </View>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <View style={[
          styles.loadingContainer, 
          { backgroundColor: colors.background }
        ]}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[
            styles.loadingText, 
            { color: colors.text.primary, marginTop: 16 }
          ]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.accent }]}
            onPress={() => navigateTo(navigation, 'Home')}
          >
            <Text style={{ color: 'white' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={[styles.contentContainer, { paddingBottom: theme.spacing['20'] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header with Blur Effect */}
        <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
          <BlurView 
            intensity={70} 
            tint={themeMode === 'dark' ? "dark" : "light"} 
            style={[styles.headerBlur, {
              borderBottomLeftRadius: theme.borders.radius['2xl'],
              borderBottomRightRadius: theme.borders.radius['2xl'],
            }]}
          >
            <RTLWrapper
              style={[
                styles.header,
                { 
                  backgroundColor: themeMode === 'dark' ? 'rgba(28, 28, 60, 0.5)' : 'rgba(245, 247, 250, 0.5)',
                  paddingHorizontal: theme.spacing['6'],
                  paddingVertical: theme.spacing['4']
                }
              ]}
              ignoreArabic={true}
            >
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/images/Logo_With_Border.png')}
                  style={[styles.logo, { marginRight: theme.spacing['2'] }]} 
                  resizeMode="contain"
                />
              </View>
              <AnimatedTouchableOpacity 
                style={[styles.profileButton, { 
                  borderColor: colors.accent,
                  backgroundColor: themeMode === 'dark' ? 'rgba(42, 42, 79, 0.6)' : 'rgba(240, 240, 250, 0.6)'
                }]} 
                onPress={() => navigateTo(navigation, 'Account')}
                activeOpacity={0.7}
                entering={FadeIn.delay(800).duration(500)}
              >
                <Image 
                  source={require('../assets/images/avatar-placeholder.png')} 
                  style={styles.profileImage}
                />
              </AnimatedTouchableOpacity>
            </RTLWrapper>
          </BlurView>
        </Animated.View>

        {/* Hero Section */}
        <Animated.View style={[
          styles.heroSection,
          heroAnimatedStyle,
          { 
            backgroundColor: colors.surface,
            padding: theme.spacing['8'],
            marginTop: theme.spacing['6'],
            marginHorizontal: theme.spacing['4'],
            borderRadius: theme.borders.radius['2xl'],
            ...theme.shadows.xl,
          }
        ]}>
          <Text style={[
            styles.heroTitle,
            { color: colors.text.primary, textAlign: 'left' }
          ]}>{t('smartParking')}</Text>
          <Text style={[
            styles.heroSubtitle,
            { 
              color: colors.accent, 
              textAlign: 'left',
              marginBottom: theme.spacing['4']
            }
          ]}>{t('madeSimple')}</Text>
          <Text style={[
            styles.heroDescription,
            { color: colors.text.secondary, textAlign: 'left' }
          ]}>
            {t('homeDescription')}
          </Text>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[
          styles.quickActionsContainer, 
          quickActionsAnimatedStyle,
          {
            marginHorizontal: theme.spacing['4'],
            marginTop: theme.spacing['8'],
            marginBottom: theme.spacing['4'],
          }
        ]}>
          <RTLWrapper style={{ width: '100%' }} ignoreArabic={true}>
            <TouchableOpacity 
              style={[
                styles.quickActionItem,
                { 
                  backgroundColor: colors.surface,
                  padding: theme.spacing['5'],
                  marginHorizontal: theme.spacing['1'],
                  borderRadius: theme.borders.radius['2xl'],
                  ...theme.shadows.lg,
                }
              ]} 
              onPress={() => navigateTo(navigation, 'Parking')}
              activeOpacity={0.8}
              delayPressIn={0}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="car" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                {t('findSpot')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionItem,
                { 
                  backgroundColor: colors.surface,
                  padding: theme.spacing['5'],
                  marginHorizontal: theme.spacing['1'],
                  borderRadius: theme.borders.radius['2xl'],
                  ...theme.shadows.lg,
                }
              ]} 
              onPress={() => navigateTo(navigation, 'Monitor')}
              activeOpacity={0.8}
              delayPressIn={0}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="time" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                {t('bookNow')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionItem,
                { 
                  backgroundColor: colors.surface,
                  padding: theme.spacing['5'],
                  marginHorizontal: theme.spacing['1'],
                  borderRadius: theme.borders.radius['2xl'],
                  ...theme.shadows.lg,
                }
              ]} 
              onPress={() => navigateTo(navigation, 'Connected')}
              activeOpacity={0.8}
              delayPressIn={0}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="map" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                {t('navigate')}
              </Text>
            </TouchableOpacity>
          </RTLWrapper>
        </Animated.View>

        {/* Dynamic Slot Status */}
        <Animated.View 
          style={[
            styles.sectionHeader,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
          entering={FadeIn.delay(900).duration(500)}
        >
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.primary }
          ]}>{t('realTimeAvailability')}</Text>
          <TouchableOpacity 
            onPress={() => navigateTo(navigation, 'Parking')}
            activeOpacity={0.7}
            style={[
              styles.viewAllButton,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}
            delayPressIn={0}
          >
            <Text style={[
              styles.viewAllText,
              { color: colors.accent, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }
            ]}>{t('viewAll')}</Text>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={16} 
              color={colors.accent} 
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.parkingCardsContainer}>
          {parkingLocations.length > 0 ? (
            parkingLocations.map((location, index) => (
              <Animated.View 
                key={location.id}
                entering={SlideInUp.delay(1000 + index * 100).duration(500)}
              >
                <ParkingStatusCard  
                  location={location} 
                  onPress={() => {
                    navigateTo(navigation, 'Parking');
                  }}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View 
              style={[styles.emptyState, { backgroundColor: colors.surface + '80' }]}
              entering={FadeIn.delay(1000).duration(500)}
            >
              <Ionicons name="car-outline" size={48} color={colors.accent} />
              <Text style={[styles.emptyStateText, { color: colors.text.primary }]}>
                {t('noVehicles')}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Pricing Overview */}
        <Animated.View 
          style={[
            styles.sectionHeader,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
          entering={FadeIn.delay(1200).duration(500)}
        >
          <Text style={[
            styles.sectionTitle,
            { color: colors.text.primary }
          ]}>{t('pricingOverview')}</Text>
          <TouchableOpacity 
            onPress={() => navigateTo(navigation, 'PricesPage')}
            activeOpacity={0.7}
            style={[
              styles.viewAllButton,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}
            delayPressIn={0}
          >
            <Text style={[
              styles.viewAllText,
              { color: colors.accent, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }
            ]}>{t('details')}</Text>
            <Ionicons 
              name={isRTL ? "chevron-back" : "chevron-forward"} 
              size={16} 
              color={colors.accent} 
            />
          </TouchableOpacity>
        </Animated.View>

        {featuredPricingPlan && (
          <Animated.View 
            style={[
              styles.pricingOverview,
              { 
                backgroundColor: colors.surface,
                ...theme.shadows.lg,
              }
            ]}
            entering={SlideInUp.delay(1300).duration(500)}
          >
            <View style={styles.pricingRow}>
              <View style={styles.pricingItem}>
                <Text style={[
                  styles.pricingValue,
                  { color: colors.accent }
                ]}>LE {featuredPricingPlan.hourlyRate}</Text>
                <Text style={[
                  styles.pricingLabel,
                  { color: colors.text.secondary }
                ]}>{t('perHour')}</Text>
              </View>
              <View style={[
                styles.pricingDivider,
                { backgroundColor: colors.divider }
              ]} />
              <View style={styles.pricingItem}>
                <Text style={[
                  styles.pricingValue,
                  { color: colors.accent }
                ]}>LE {featuredPricingPlan.dailyRate}</Text>
                <Text style={[
                  styles.pricingLabel,
                  { color: colors.text.secondary }
                ]}>{t('perDay')}</Text>
              </View>
              <View style={[
                styles.pricingDivider,
                { backgroundColor: colors.divider }
              ]} />
              <View style={styles.pricingItem}>
                <Text style={[
                  styles.pricingValue,
                  { color: colors.accent }
                ]}>LE {featuredPricingPlan.monthlyRate}</Text>
                <Text style={[
                  styles.pricingLabel,
                  { color: colors.text.secondary }
                ]}>{t('perMonth')}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Call-to-Action Buttons */}
        <Animated.View 
          style={styles.ctaContainer}
          entering={SlideInUp.delay(1400).duration(500)}
        >
          <ActionButton 
            title={t('login')} 
            onPress={() => navigateTo(navigation, 'Login')}
            style={{
              ...styles.ctaButton,
              ...theme.shadows.md
            }}
            size="large"
            icon={<Ionicons name="log-in-outline" size={22} color="white" />}
            iconPosition={isRTL ? "right" : "left"}
          />
          <ActionButton 
            title={t('register')} 
            variant="outline"
            onPress={() => navigateTo(navigation, 'Register')}
            style={{
              ...styles.ctaButton,
              ...theme.shadows.sm
            }}
            size="large"
            icon={<Ionicons name="person-add-outline" size={22} color={colors.accent} />}
            iconPosition={isRTL ? "right" : "left"}
          />
        </Animated.View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {},
  headerContainer: {
    zIndex: 10,
  },
  headerBlur: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 60,
  },
  profileButton: {
    padding: 2,
    borderRadius: 20,
    borderWidth: 2,
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  heroSection: {
    // Basic layout - other properties should be inline
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
  },
  heroDescription: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing['1'],
  },
  quickActionIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing['6'],
    marginTop: theme.spacing['8'],
    marginBottom: theme.spacing['4'],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  parkingCardsContainer: {
    marginHorizontal: theme.spacing['4'],
  },
  emptyState: {
    height: 150,
    borderRadius: theme.borders.radius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  pricingOverview: {
    borderRadius: theme.borders.radius['2xl'],
    marginHorizontal: theme.spacing['4'],
    padding: theme.spacing['5'],
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingItem: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing['3'],
  },
  pricingValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: theme.spacing['1'],
  },
  pricingLabel: {
    fontSize: theme.typography.fontSize.sm,
  },
  pricingDivider: {
    width: 1,
    height: 40,
  },
  ctaContainer: {
    marginHorizontal: theme.spacing['4'],
    marginTop: theme.spacing['8'],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ctaButton: {
    flex: 1,
    marginHorizontal: theme.spacing['2'],
    height: 56,
    borderRadius: theme.borders.radius.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default HomeScreen; 