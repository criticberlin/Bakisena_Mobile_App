import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { useAuth } from '../components/AuthContext';

import ActionButton from '../components/ActionButton';
import { RootStackParamList, ParkingSlot } from '../types';
import theme from '../theme/theme';
import AppLayout from '../components/layout/AppLayout';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

type AdminDashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;

// Type for statistics
interface ParkingStatistics {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  reservedSlots: number;
  outOfServiceSlots: number;
  occupancyRate: number;
}

// Type for slot data from Firestore
interface SlotData {
  id: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  [key: string]: any;
}

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  const { logout, user } = useAuth();
  
  const [locations, setLocations] = useState<any[]>([]);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ParkingStatistics>({
    totalSlots: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    reservedSlots: 0,
    outOfServiceSlots: 0,
    occupancyRate: 0
  });
  
  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch locations
        const locationsSnapshot = await getDocs(collection(firestore, 'locations'));
        const locationsData = locationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLocations(locationsData);
        
        // Fetch parking slots
        const slotsSnapshot = await getDocs(collection(firestore, 'parkingSlots'));
        const slotsData = slotsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SlotData[];
        setSlots(slotsData);
        
        // Fetch users (for admin purposes)
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        
        // Calculate statistics
        const totalSlots = slotsData.length;
        const availableSlots = slotsData.filter(slot => slot.status === 'available').length;
        const occupiedSlots = slotsData.filter(slot => slot.status === 'occupied').length;
        const reservedSlots = slotsData.filter(slot => slot.status === 'reserved').length;
        const outOfServiceSlots = slotsData.filter(slot => slot.status === 'maintenance').length;
        const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
        
        setStats({
          totalSlots,
          availableSlots,
          occupiedSlots,
          reservedSlots,
          outOfServiceSlots,
          occupancyRate
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load dashboard data');
      }
    };
    
    fetchData();
  }, []);
  
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
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
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
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
      marginBottom: theme.spacing.sm,
    },
    occupancyTitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: 'bold',
      color: safeColors.text.primary,
    },
    occupancyValue: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: 'bold',
      color: safeColors.primary,
    },
    barContainer: {
      height: 12,
      backgroundColor: 'rgba(229, 231, 235, 0.6)',
      borderRadius: 6,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
    },
    occupancyBar: {
      height: '100%',
      backgroundColor: safeColors.primary,
      borderRadius: 6,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
      marginTop: theme.spacing.xs,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.xs,
    },
    legendText: {
      fontSize: theme.typography.fontSize.xs,
      color: safeColors.text.secondary,
    },
    quickActionsContainer: {
      marginTop: theme.spacing.md,
    },
    actionButton: {
      marginTop: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={safeColors.primary} />
          <Text style={{ marginTop: 16, color: safeColors.text.primary }}>Loading dashboard data...</Text>
        </View>
      </AppLayout>
    );
  }

  if (!user || !user.email) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <Text style={{ color: safeColors.text.primary }}>You need to be logged in as an admin to access this dashboard.</Text>
          <ActionButton
            title="Go to Login"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: 16 }}
          />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout scrollable={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{t('welcomeAdmin' as any)}</Text>
          <Text style={styles.userName}>{user.displayName || user.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('logout' as any)}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={[styles.container, { backgroundColor: currentColors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Dashboard Overview */}
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>{t('dashboardOverview' as any)}</Text>
          
          {/* Occupancy Rate Card */}
          <View style={styles.occupancyCard}>
            <View style={styles.occupancyHeader}>
              <Text style={styles.occupancyTitle}>{t('parkingOccupancy' as any)}</Text>
              <Text style={styles.occupancyValue}>{stats.occupancyRate}%</Text>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.occupancyBar, { width: `${stats.occupancyRate}%` }]} />
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: safeColors.status.available }]} />
                <Text style={styles.legendText}>{t('available' as any)}: {stats.availableSlots}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: safeColors.status.occupied }]} />
                <Text style={styles.legendText}>{t('occupied' as any)}: {stats.occupiedSlots}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: safeColors.status.reserved }]} />
                <Text style={styles.legendText}>{t('reserved' as any)}: {stats.reservedSlots}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: safeColors.status.outOfService }]} />
                <Text style={styles.legendText}>{t('maintenance' as any)}: {stats.outOfServiceSlots}</Text>
              </View>
            </View>
          </View>
          
          {/* Statistics Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{locations.length}</Text>
              <Text style={styles.statLabel}>{t('locations' as any)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalSlots}</Text>
              <Text style={styles.statLabel}>{t('totalSlots' as any)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{users.length}</Text>
              <Text style={styles.statLabel}>{t('registeredUsers' as any)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.occupiedSlots + stats.reservedSlots}</Text>
              <Text style={styles.statLabel}>{t('activeBookings' as any)}</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('quickActions' as any)}</Text>
          <View style={styles.quickActionsContainer}>
            <ActionButton 
              title={t('manageUsers' as any)}
              onPress={() => navigation.navigate('UserManagement')}
              style={styles.actionButton}
            />
            <ActionButton 
              title={t('manageSlots' as any)}
              onPress={() => navigation.navigate('SlotManagement')}
              style={styles.actionButton}
            />
            <ActionButton 
              title={t('viewReports' as any)}
              onPress={() => navigation.navigate('Reports')}
              style={styles.actionButton}
            />
            <ActionButton 
              title={t('manageParkingAreas' as any)}
              onPress={() => navigation.navigate('ParkingManagement')}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default AdminDashboardScreen;