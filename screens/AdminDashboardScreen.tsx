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
import { RootStackParamList } from '../types';
import theme from '../theme/theme';
import { MOCK_LOCATIONS, MOCK_SLOTS, MOCK_USERS } from '../constants/mockData';
import AppLayout from '../components/layout/AppLayout';

type AdminDashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;

// Helper function to get statistics
const getStatistics = () => {
  const totalSlots = MOCK_SLOTS.length;
  const availableSlots = MOCK_SLOTS.filter(slot => slot.status === 'AVAILABLE').length;
  const occupiedSlots = MOCK_SLOTS.filter(slot => slot.status === 'OCCUPIED').length;
  const reservedSlots = MOCK_SLOTS.filter(slot => slot.status === 'RESERVED').length;
  const outOfServiceSlots = MOCK_SLOTS.filter(slot => slot.status === 'OUT_OF_SERVICE').length;
  const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);
  
  return {
    totalSlots,
    availableSlots,
    occupiedSlots,
    reservedSlots,
    outOfServiceSlots,
    occupancyRate
  };
};

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  
  // Get admin user and stats
  const adminUser = MOCK_USERS.find(user => user.isAdmin);
  const stats = getStatistics();

  const handleLogout = () => {
    // In a real app, you would clear the authentication token here
    navigation.navigate('MainTabs');
  };

  return (
    <AppLayout>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Admin Panel</Text>
          <Text style={styles.userName}>{adminUser?.name || 'Administrator'}</Text>
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
        {/* Dashboard Overview */}
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalSlots}</Text>
              <Text style={styles.statLabel}>Total Slots</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.status.available + '20' }]}>
              <Text style={[styles.statValue, { color: theme.colors.status.available }]}>
                {stats.availableSlots}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.status.occupied + '20' }]}>
              <Text style={[styles.statValue, { color: theme.colors.status.occupied }]}>
                {stats.occupiedSlots}
              </Text>
              <Text style={styles.statLabel}>Occupied</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.status.reserved + '20' }]}>
              <Text style={[styles.statValue, { color: theme.colors.status.reserved }]}>
                {stats.reservedSlots}
              </Text>
              <Text style={styles.statLabel}>Reserved</Text>
            </View>
          </View>
          
          <View style={styles.occupancyCard}>
            <View style={styles.occupancyHeader}>
              <Text style={styles.occupancyTitle}>Current Occupancy Rate</Text>
              <Text style={styles.occupancyValue}>{stats.occupancyRate}%</Text>
            </View>
            
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${stats.occupancyRate}%`,
                    backgroundColor: stats.occupancyRate > 80 
                      ? theme.colors.error 
                      : stats.occupancyRate > 50 
                      ? theme.colors.warning 
                      : theme.colors.success
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('SlotManagement')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={styles.quickActionIconText}>🅿️</Text>
              </View>
              <Text style={styles.quickActionText}>Manage Slots</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('UserManagement')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Text style={styles.quickActionIconText}>👥</Text>
              </View>
              <Text style={styles.quickActionText}>User Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Reports')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.info + '20' }]}>
                <Text style={styles.quickActionIconText}>📊</Text>
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PricesPage')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                <Text style={styles.quickActionIconText}>💰</Text>
              </View>
              <Text style={styles.quickActionText}>Pricing Plans</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Status */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location Status</Text>
          </View>
          
          {MOCK_LOCATIONS.map(location => {
            const locationSlots = MOCK_SLOTS.filter(slot => slot.locationId === location.id);
            const availableCount = locationSlots.filter(slot => slot.status === 'AVAILABLE').length;
            const availabilityPercentage = Math.round((availableCount / locationSlots.length) * 100);
            
            return (
              <View key={location.id} style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                  <View style={styles.locationStats}>
                    <Text style={styles.locationAvailability}>
                      {availableCount}/{locationSlots.length} Available
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${availabilityPercentage}%`,
                        backgroundColor: availabilityPercentage < 20 
                          ? theme.colors.error 
                          : availabilityPercentage < 50 
                          ? theme.colors.warning 
                          : theme.colors.success
                      }
                    ]} 
                  />
                </View>
                
                <ActionButton
                  title="Manage Location"
                  variant="outline"
                  onPress={() => {
                    // Navigate to location management in a real app
                    console.log(`Manage location ${location.id}`);
                  }}
                  style={styles.manageButton}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.primary,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borders.radius.sm,
  },
  logoutText: {
    color: 'white',
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
  dashboardSection: {
    padding: theme.spacing.lg,
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
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  occupancyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    marginTop: theme.spacing.sm,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  occupancyTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  occupancyValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borders.radius.circle,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borders.radius.circle,
  },
  quickActionsContainer: {
    padding: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  locationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  locationName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  locationAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  locationStats: {
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.sm,
  },
  locationAvailability: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  manageButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'flex-end',
  },
});

export default AdminDashboardScreen; 