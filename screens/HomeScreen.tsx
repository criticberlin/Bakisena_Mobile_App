import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView, 
  Image, 
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions
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
import { MOCK_LOCATIONS, MOCK_PRICING_PLANS } from '../constants/mockData';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { TabParamList } from '../navigation/TabNavigator';
import theme from '../theme/theme';
import RTLWrapper from '../components/layout/RTLWrapper';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList & TabParamList, 'Home'>;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, themeMode } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // Animation values
  const headerOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.95);
  const heroOpacity = useSharedValue(0);
  const quickActionsTranslateY = useSharedValue(20);
  const quickActionsOpacity = useSharedValue(0);
  
  // Show just top 3 locations for the home view
  const topLocations = MOCK_LOCATIONS.slice(0, 3);
  
  // Get the first pricing plan for basic info
  const featuredPricingPlan = MOCK_PRICING_PLANS[0];

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
                onPress={() => navigation.navigate('Account')}
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
            <AnimatedTouchableOpacity 
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
              onPress={() => navigation.navigate('Parking')}
              activeOpacity={0.8}
              entering={SlideInUp.delay(600).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="car" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                {t('findSpot')}
              </Text>
            </AnimatedTouchableOpacity>
            
            <AnimatedTouchableOpacity 
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
              onPress={() => navigation.navigate('Monitor')}
              activeOpacity={0.8}
              entering={SlideInUp.delay(650).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="time" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                {t('bookNow')}
              </Text>
            </AnimatedTouchableOpacity>
            
            <AnimatedTouchableOpacity 
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
              onPress={() => navigation.navigate('Connected')}
              activeOpacity={0.8}
              entering={SlideInUp.delay(700).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="map" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
                {t('navigate')}
              </Text>
            </AnimatedTouchableOpacity>
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
            onPress={() => navigation.navigate('Parking')}
            activeOpacity={0.7}
            style={[
              styles.viewAllButton,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}
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
          {topLocations.map((location, index) => (
            <Animated.View 
              key={location.id}
              entering={SlideInUp.delay(1000 + index * 100).duration(500)}
            >
              <ParkingStatusCard  
                location={location} 
                onPress={() => {
                  // Navigate to make reservation when logged in
                  // For now just go to login
                  navigation.navigate('Login');
                }}
              />
            </Animated.View>
          ))}
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
            onPress={() => navigation.navigate('PricesPage')}
            activeOpacity={0.7}
            style={[
              styles.viewAllButton,
              { flexDirection: isRTL ? 'row-reverse' : 'row' }
            ]}
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

        {/* Call-to-Action Buttons */}
        <Animated.View 
          style={styles.ctaContainer}
          entering={SlideInUp.delay(1400).duration(500)}
        >
          <ActionButton 
            title={t('login')} 
            onPress={() => navigation.navigate('Login')}
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
            onPress={() => navigation.navigate('Register')}
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
});

export default HomeScreen; 