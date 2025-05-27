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
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';

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
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  
  // Get current theme colors with fallbacks
  const currentColors = themeMode === 'light' ? 
    (colors?.light || {}) : 
    (colors?.dark || {});
  
  // Create a safe colors object with fallbacks for all used colors
  const safeColors = {
    primary: colors?.primary || '#0F1544',
    secondary: colors?.secondary || '#2563EB',
    accent: colors?.accent || '#F59E0B',
    error: colors?.error || '#EF4444',
    warning: colors?.warning || '#F59E0B',
    info: colors?.info || '#3B82F6',
    success: colors?.success || '#10B981',
    status: {
      available: colors?.status?.available || '#10B981',
      occupied: colors?.status?.occupied || '#EF4444',
      reserved: colors?.status?.reserved || '#F59E0B',
      outOfService: colors?.status?.outOfService || '#6B7280'
    },
    surface: currentColors?.surface || '#FFFFFF',
    divider: currentColors?.divider || '#E5E7EB',
    text: {
      primary: currentColors?.text?.primary || '#111827',
      secondary: currentColors?.text?.secondary || '#4B5563'
    }
  };
  
  // Get admin user and stats
  const adminUser = MOCK_USERS.find(user => user.isAdmin);
  const stats = getStatistics();

  const handleLogout = () => {
    // In a real app, you would clear the authentication token here
    navigation.navigate('MainTabs');
  };

  // Define styles inside the component to access theme variables
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      backgroundColor: safeColors.primary,
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
      color: safeColors.text.primary,
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    statCard: {
      width: '48%',
      backgroundColor: safeColors.surface,
      borderRadius: theme.borders.radius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: 'bold',
      color: safeColors.text.primary,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: safeColors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    occupancyCard: {
      backgroundColor: safeColors.surface,
      borderRadius: theme.borders.radius.md,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: theme.spacing.sm,
    },
    occupancyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    occupancyTitle: {
      fontSize: 16,
      color: safeColors.text.primary,
      fontWeight: 'bold',
    },
    occupancyValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: safeColors.primary,
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: safeColors.divider,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    quickActionsContainer: {
      padding: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    quickActionButton: {
      width: '48%',
      backgroundColor: safeColors.surface,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    quickActionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    quickActionIconText: {
      fontSize: 24,
    },
    quickActionText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: safeColors.text.primary,
    },
    locationCard: {
      backgroundColor: safeColors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    locationName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: safeColors.text.primary,
    },
    locationAddress: {
      fontSize: 14,
      color: safeColors.text.secondary,
      marginTop: 2,
    },
    locationStats: {
      backgroundColor: safeColors.primary + '10',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borders.radius.sm,
    },
    locationAvailability: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: 'bold',
      color: safeColors.primary,
    },
    manageButton: {
      marginTop: theme.spacing.md,
      alignSelf: 'flex-end',
    },
  });

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
            
            <View style={[styles.statCard, { backgroundColor: safeColors.status.available + '20' }]}>
              <Text style={[styles.statValue, { color: safeColors.status.available }]}>
                {stats.availableSlots}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: safeColors.status.occupied + '20' }]}>
              <Text style={[styles.statValue, { color: safeColors.status.occupied }]}>
                {stats.occupiedSlots}
              </Text>
              <Text style={styles.statLabel}>Occupied</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: safeColors.status.reserved + '20' }]}>
              <Text style={[styles.statValue, { color: safeColors.status.reserved }]}>
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
                      ? safeColors.error 
                      : stats.occupancyRate > 50 
                      ? safeColors.warning 
                      : safeColors.success
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
              <View style={[styles.quickActionIcon, { backgroundColor: safeColors.primary + '20' }]}>
                <Text style={styles.quickActionIconText}>🅿️</Text>
              </View>
              <Text style={styles.quickActionText}>Manage Slots</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('UserManagement')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: safeColors.secondary + '20' }]}>
                <Text style={styles.quickActionIconText}>👥</Text>
              </View>
              <Text style={styles.quickActionText}>User Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Reports')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: safeColors.info + '20' }]}>
                <Text style={styles.quickActionIconText}>📊</Text>
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PricesPage')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: safeColors.accent + '20' }]}>
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
                          ? safeColors.error 
                          : availabilityPercentage < 50 
                          ? safeColors.warning 
                          : safeColors.success
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

export default AdminDashboardScreen; 