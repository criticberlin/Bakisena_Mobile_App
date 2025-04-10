import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  StatusBar,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import ParkingStatusCard from '../components/home/ParkingStatusCard';
import ActionButton from '../components/ActionButton';
import { MOCK_LOCATIONS, MOCK_PRICING_PLANS } from '../constants/mockData';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';
import { TabParamList } from '../navigation/TabNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList & TabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Show just top 3 locations for the home view
  const topLocations = MOCK_LOCATIONS.slice(0, 3);
  
  // Get the first pricing plan for basic info
  const featuredPricingPlan = MOCK_PRICING_PLANS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header with Blur Effect */}
        <View style={styles.headerContainer}>
          <BlurView intensity={30} tint="dark" style={styles.headerBlur}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/images/Logo_With_Border.png')}
                  style={styles.logo} 
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity 
                style={styles.profileButton} 
                onPress={() => navigation.navigate('Account')}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../assets/images/avatar-placeholder.png')} 
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Smart Parking</Text>
          <Text style={styles.heroSubtitle}>Made Simple</Text>
          <Text style={styles.heroDescription}>
            Find and reserve parking spaces in real-time. Save time and enjoy seamless
            parking management.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionItem} 
            onPress={() => navigation.navigate('Parking')}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="car" size={26} color={theme.colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Find Spot</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem} 
            onPress={() => navigation.navigate('Monitor')}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="time" size={26} color={theme.colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Book Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem} 
            onPress={() => navigation.navigate('Connected')}
            activeOpacity={0.8}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="map" size={26} color={theme.colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Navigate</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Slot Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Real-time Availability</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Parking')}
            activeOpacity={0.7}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.parkingCardsContainer}>
          {topLocations.map(location => (
            <ParkingStatusCard 
              key={location.id} 
              location={location} 
              onPress={() => {
                // Navigate to make reservation when logged in
                // For now just go to login
                navigation.navigate('Login');
              }}
            />
          ))}
        </View>

        {/* Pricing Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pricing Overview</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('PricesPage')}
            activeOpacity={0.7}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>Details</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.pricingOverview}>
          <View style={styles.pricingRow}>
            <View style={styles.pricingItem}>
              <Text style={styles.pricingValue}>LE {featuredPricingPlan.hourlyRate}</Text>
              <Text style={styles.pricingLabel}>per hour</Text>
            </View>
            <View style={styles.pricingDivider} />
            <View style={styles.pricingItem}>
              <Text style={styles.pricingValue}>LE {featuredPricingPlan.dailyRate}</Text>
              <Text style={styles.pricingLabel}>per day</Text>
            </View>
            <View style={styles.pricingDivider} />
            <View style={styles.pricingItem}>
              <Text style={styles.pricingValue}>LE {featuredPricingPlan.monthlyRate}</Text>
              <Text style={styles.pricingLabel}>per month</Text>
            </View>
          </View>
        </View>

        {/* Call-to-Action Buttons */}
        <View style={styles.ctaContainer}>
          <ActionButton 
            title="Login" 
            onPress={() => navigation.navigate('Login')}
            style={styles.ctaButton}
            size="large"
            icon={<Ionicons name="log-in-outline" size={22} color="white" />}
            iconPosition="left"
          />
          <ActionButton 
            title="Register" 
            variant="outline"
            onPress={() => navigation.navigate('Register')}
            style={styles.ctaButton}
            size="large"
            icon={<Ionicons name="person-add-outline" size={22} color={theme.colors.accent} />}
            iconPosition="left"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: theme.spacing['20'],
  },
  headerContainer: {
    zIndex: 10,
  },
  headerBlur: {
    overflow: 'hidden',
    borderBottomLeftRadius: theme.borders.radius['2xl'],
    borderBottomRightRadius: theme.borders.radius['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['6'],
    paddingVertical: theme.spacing['4'],
    backgroundColor: 'rgba(28, 28, 60, 0.7)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 60,
    marginRight: theme.spacing['2'],
  },
  profileButton: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(42, 42, 79, 0.6)',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  heroSection: {
    padding: theme.spacing['8'],
    marginTop: theme.spacing['6'],
    marginHorizontal: theme.spacing['4'],
    borderRadius: theme.borders.radius['2xl'],
    backgroundColor: theme.colors.surface,
    ...theme.shadows.lg,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.accent,
    marginBottom: theme.spacing['4'],
  },
  heroDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing['4'],
    marginTop: theme.spacing['8'],
    marginBottom: theme.spacing['4'],
  },
  quickActionItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius['2xl'],
    padding: theme.spacing['5'],
    flex: 1,
    marginHorizontal: theme.spacing['1'],
    ...theme.shadows.md,
  },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(249, 178, 51, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing['2'],
  },
  quickActionText: {
    marginTop: theme.spacing['2'],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
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
    color: theme.colors.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.accent,
    marginRight: 4,
  },
  parkingCardsContainer: {
    marginHorizontal: theme.spacing['4'],
  },
  pricingOverview: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius['2xl'],
    marginHorizontal: theme.spacing['4'],
    padding: theme.spacing['5'],
    ...theme.shadows.md,
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
    color: theme.colors.accent,
    marginBottom: theme.spacing['1'],
  },
  pricingLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  pricingDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.divider,
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