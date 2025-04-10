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
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Modern Header with Blur Effect */}
        <View style={styles.headerContainer}>
          <BlurView intensity={20} tint="dark" style={styles.headerBlur}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/images/Logo_With_Border.png')}
                  style={styles.logo} 
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Account')}>
                <Ionicons name="person-circle-outline" size={32} color={theme.colors.accent} />
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
          <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate('Parking')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="car" size={24} color={theme.colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Find Spot</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate('Monitor')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="time" size={24} color={theme.colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Book Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate('Connected')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="map" size={24} color={theme.colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Navigate</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Slot Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Real-time Availability</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Parking')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

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

        {/* Pricing Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pricing Overview</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PricesPage')}>
            <Text style={styles.viewAllText}>Details</Text>
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
            icon={<Ionicons name="log-in-outline" size={20} color="white" />}
            iconPosition="left"
          />
          <ActionButton 
            title="Register" 
            variant="outline"
            onPress={() => navigation.navigate('Register')}
            style={styles.ctaButton}
            size="large"
            icon={<Ionicons name="person-add-outline" size={20} color={theme.colors.accent} />}
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
    paddingBottom: theme.spacing['16'],
  },
  headerContainer: {
    zIndex: 10,
  },
  headerBlur: {
    overflow: 'hidden',
    borderBottomLeftRadius: theme.borders.radius.xl,
    borderBottomRightRadius: theme.borders.radius.xl,
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
    height: 150,
    marginRight: theme.spacing['2'],
  },
  profileButton: {
    padding: theme.spacing['1'],
  },
  heroSection: {
    padding: theme.spacing['6'],
    marginTop: theme.spacing['4'],
    marginHorizontal: theme.spacing['4'],
    borderRadius: theme.borders.radius['2xl'],
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.accent,
    marginBottom: theme.spacing['3'],
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
    marginTop: theme.spacing['6'],
    marginBottom: theme.spacing['2'],
  },
  quickActionItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.xl,
    padding: theme.spacing['4'],
    flex: 1,
    marginHorizontal: theme.spacing['1'],
    ...theme.shadows.sm,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 178, 51, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing['2'],
  },
  quickActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing['1'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['5'],
    marginTop: theme.spacing['8'],
    marginBottom: theme.spacing['3'],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  pricingOverview: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing['4'],
    borderRadius: theme.borders.radius['2xl'],
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
    padding: theme.spacing['2'],
  },
  pricingValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  pricingLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing['1'],
  },
  pricingDivider: {
    width: 1,
    height: 50,
    backgroundColor: theme.colors.divider,
  },
  ctaContainer: {
    padding: theme.spacing['5'],
    marginTop: theme.spacing['4'],
  },
  ctaButton: {
    marginBottom: theme.spacing['3'],
    borderRadius: theme.borders.radius.xl,
  },
});

export default HomeScreen; 