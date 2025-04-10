import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ActionButton from '../components/ActionButton';
import ReservationCard from '../components/dashboard/ReservationCard';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';
import { MOCK_RESERVATIONS, MOCK_USERS } from '../constants/mockData';
import AppLayout from '../components/layout/AppLayout';

type UserDashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserDashboard'>;

const UserDashboardScreen: React.FC = () => {
  const navigation = useNavigation<UserDashboardScreenNavigationProp>();
  
  // Get user data (in a real app, this would come from authentication context)
  const user = MOCK_USERS[0]; // Non-admin user
  
  // Filter reservations to show only this user's
  const userReservations = MOCK_RESERVATIONS.filter(res => res.userId === user.id);
  
  // Get active and past reservations
  const activeReservations = userReservations.filter(res => res.status === 'ACTIVE');
  const pastReservations = userReservations.filter(res => res.status === 'COMPLETED');

  const handleLogout = () => {
    // In a real app, you would clear the authentication token here
    navigation.navigate('MainTabs');
  };

  return (
    <AppLayout>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MakeReservation')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={styles.quickActionIconText}>🚗</Text>
              </View>
              <Text style={styles.quickActionText}>New Booking</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PastBookings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Text style={styles.quickActionIconText}>📅</Text>
              </View>
              <Text style={styles.quickActionText}>View History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                <Text style={styles.quickActionIconText}>👤</Text>
              </View>
              <Text style={styles.quickActionText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PricesPage')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.info + '20' }]}>
                <Text style={styles.quickActionIconText}>💰</Text>
              </View>
              <Text style={styles.quickActionText}>View Rates</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Reservations */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Reservations</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PastBookings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {activeReservations.length > 0 ? (
            activeReservations.map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                onPress={() => {
                  // Navigate to reservation details in a real app
                  console.log(`View reservation ${reservation.id}`);
                }}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No active reservations</Text>
              <ActionButton 
                title="Book a Spot" 
                onPress={() => navigation.navigate('MakeReservation')}
                style={styles.emptyStateButton}
              />
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PastBookings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {pastReservations.length > 0 ? (
            pastReservations.slice(0, 1).map(reservation => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation} 
                onPress={() => {
                  // Navigate to reservation details in a real app
                  console.log(`View reservation ${reservation.id}`);
                }}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No past reservations</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
  logoutText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  quickActionsContainer: {
    padding: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  sectionContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  emptyStateContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  emptyStateButton: {
    minWidth: 150,
  },
});

export default UserDashboardScreen; 