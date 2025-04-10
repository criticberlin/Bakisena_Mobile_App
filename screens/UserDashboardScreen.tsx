import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  SlideInRight,
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate
} from 'react-native-reanimated';

import { useTheme } from '../theme/ThemeContext';
import ActionButton from '../components/ActionButton';
import ReservationCard from '../components/dashboard/ReservationCard';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';
import { MOCK_RESERVATIONS, MOCK_USERS } from '../constants/mockData';
import AppLayout from '../components/layout/AppLayout';

type UserDashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserDashboard'>;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const UserDashboardScreen: React.FC = () => {
  const { themeMode, colors } = useTheme();
  
  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const navigation = useNavigation<UserDashboardScreenNavigationProp>();
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const actionsOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const cardsTranslateY = useSharedValue(30);
  
  // Get user data (in a real app, this would come from authentication context)
  const user = MOCK_USERS[0]; // Non-admin user
  
  // Filter reservations to show only this user's
  const userReservations = MOCK_RESERVATIONS.filter(res => res.userId === user.id);
  
  // Get active and past reservations
  const activeReservations = userReservations.filter(res => res.status === 'ACTIVE');
  const pastReservations = userReservations.filter(res => res.status === 'COMPLETED');

  // Animations setup
  useEffect(() => {
    // Animate header
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withTiming(0, { duration: 800 });
    
    // Animate actions with delay
    actionsOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    
    // Animate cards with more delay
    cardsOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    cardsTranslateY.value = withDelay(600, withSpring(0, { damping: 14 }));
  }, []);
  
  // Animated styles
  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));
  
  const actionsAnimStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
  }));
  
  const cardsAnimStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsTranslateY.value }]
  }));

  const handleLogout = () => {
    // In a real app, you would clear the authentication token here
    navigation.navigate('MainTabs');
  };

  return (
    <AppLayout>
      <Animated.View style={[styles.header, headerAnimStyle]}>
        <LinearGradient
          colors={[
            themeMode === 'dark' ? 'rgba(20, 20, 50, 0.95)' : 'rgba(248, 248, 252, 0.95)',
            themeMode === 'dark' ? 'rgba(26, 26, 56, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          ]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Image 
                source={require('../assets/images/avatar-placeholder.png')}
                style={styles.avatar}
              />
              <View style={styles.userTextContainer}>
                <Text style={[styles.welcomeText, { color: currentColors.text.secondary }]}>
                  Welcome back,
                </Text>
                <Text style={[styles.userName, { color: currentColors.text.primary }]}>
                  {user.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.accent} />
              <Text style={[styles.logoutText, { color: colors.accent }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={[styles.container, { backgroundColor: currentColors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Animated.View style={[styles.quickActionsContainer, actionsAnimStyle]}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <AnimatedTouchable 
              style={[
                styles.quickActionButton, 
                { backgroundColor: currentColors.surface, ...theme.shadows.md }
              ]}
              onPress={() => navigation.navigate('MakeReservation')}
              entering={SlideInRight.delay(300).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="car" size={26} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: currentColors.text.primary }]}>
                New Booking
              </Text>
            </AnimatedTouchable>
            
            <AnimatedTouchable 
              style={[
                styles.quickActionButton, 
                { backgroundColor: currentColors.surface, ...theme.shadows.md }
              ]}
              onPress={() => navigation.navigate('PastBookings')}
              entering={SlideInRight.delay(400).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="calendar" size={26} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: currentColors.text.primary }]}>
                View History
              </Text>
            </AnimatedTouchable>
            
            <AnimatedTouchable 
              style={[
                styles.quickActionButton, 
                { backgroundColor: currentColors.surface, ...theme.shadows.md }
              ]}
              onPress={() => navigation.navigate('EditProfile')}
              entering={SlideInRight.delay(500).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="person" size={26} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: currentColors.text.primary }]}>
                Edit Profile
              </Text>
            </AnimatedTouchable>
            
            <AnimatedTouchable 
              style={[
                styles.quickActionButton, 
                { backgroundColor: currentColors.surface, ...theme.shadows.md }
              ]}
              onPress={() => navigation.navigate('PricesPage')}
              entering={SlideInRight.delay(600).duration(500)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="cash" size={26} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: currentColors.text.primary }]}>
                View Rates
              </Text>
            </AnimatedTouchable>
          </View>
        </Animated.View>

        {/* Active Reservations */}
        <Animated.View 
          style={[styles.sectionContainer, cardsAnimStyle]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
              Active Reservations
            </Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('PastBookings')}
            >
              <Text style={[styles.viewAllText, { color: colors.accent }]}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
          
          {activeReservations.length > 0 ? (
            activeReservations.map((reservation, index) => (
              <Animated.View 
                key={reservation.id}
                entering={FadeIn.delay(800 + index * 100).duration(500)}
              >
                <ReservationCard 
                  reservation={reservation} 
                  onPress={() => {
                    // Navigate to reservation details in a real app
                    console.log(`View reservation ${reservation.id}`);
                  }}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View 
              style={[
                styles.emptyStateContainer, 
                { backgroundColor: currentColors.surface, ...theme.shadows.md }
              ]}
              entering={FadeIn.delay(800).duration(500)}
            >
              <Ionicons 
                name="car-outline" 
                size={48} 
                color={themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} 
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyStateText, { color: currentColors.text.secondary }]}>
                No active reservations
              </Text>
              <ActionButton 
                title="Book a Spot" 
                onPress={() => navigation.navigate('MakeReservation')}
                style={styles.emptyStateButton}
                icon={<Ionicons name="add-circle-outline" size={18} color="white" />}
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View 
          style={[styles.sectionContainer, cardsAnimStyle]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: currentColors.text.primary }]}>
              Recent Activity
            </Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('PastBookings')}
            >
              <Text style={[styles.viewAllText, { color: colors.accent }]}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
          
          {pastReservations.length > 0 ? (
            pastReservations.slice(0, 2).map((reservation, index) => (
              <Animated.View 
                key={reservation.id}
                entering={FadeIn.delay(1000 + index * 100).duration(500)}
              >
                <ReservationCard 
                  reservation={reservation} 
                  onPress={() => {
                    // Navigate to reservation details in a real app
                    console.log(`View reservation ${reservation.id}`);
                  }}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View 
              style={[
                styles.emptyStateContainer, 
                { backgroundColor: currentColors.surface, ...theme.shadows.md }
              ]}
              entering={FadeIn.delay(1000).duration(500)}
            >
              <Ionicons 
                name="time-outline" 
                size={48} 
                color={themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} 
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyStateText, { color: currentColors.text.secondary }]}>
                No past reservations
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    overflow: 'hidden',
    borderBottomLeftRadius: theme.borders.radius.xl,
    borderBottomRightRadius: theme.borders.radius.xl,
    ...theme.shadows.md,
    marginBottom: theme.spacing[4],
    zIndex: 10,
  },
  headerGradient: {
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[5],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing[3],
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.sm,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borders.radius.full,
  },
  logoutText: {
    marginLeft: theme.spacing[1],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  quickActionsContainer: {
    padding: theme.spacing[6],
    paddingBottom: theme.spacing[3],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing[3],
  },
  quickActionButton: {
    width: '48%',
    borderRadius: theme.borders.radius.xl,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  quickActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  sectionContainer: {
    padding: theme.spacing[6],
    paddingTop: theme.spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
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
    marginRight: theme.spacing[1],
  },
  emptyStateContainer: {
    borderRadius: theme.borders.radius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  emptyIcon: {
    marginBottom: theme.spacing[2],
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing[4],
  },
  emptyStateButton: {
    minWidth: 180,
    ...theme.shadows.sm,
  },
});

export default UserDashboardScreen; 