import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import AppLayout from '../components/layout/AppLayout';
import { useLanguage } from '../constants/translations/LanguageContext';
import { firestore } from '../config/firebase';
import { doc, getDoc, collection, query, getDocs, where, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

interface ParkingStatistics {
  totalSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  availableSpaces: number;
  lastUpdated: string;
}

interface ParkingUsageStats {
  peakHours: string;
  occupancyRate: string;
  averageDuration: number;
}

interface NotificationItem {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Default data to use as fallback
const DEFAULT_PARKING_STATS: ParkingStatistics = {
  totalSpaces: 120,
  occupiedSpaces: 78,
  reservedSpaces: 12,
  availableSpaces: 30,
  lastUpdated: new Date().toISOString()
};

const DEFAULT_USAGE_STATS: ParkingUsageStats = {
  peakHours: '08:00 - 10:00, 17:00 - 19:00',
  occupancyRate: '65%',
  averageDuration: 3.2
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'default1',
    message: 'Welcome to Bakisena Parking!',
    timestamp: new Date(),
    read: false
  },
  {
    id: 'default2',
    message: 'Try our new reservation feature',
    timestamp: new Date(Date.now() - 3600000),
    read: false
  }
];

const MonitorScreen = () => {
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  
  // State for parking data
  const [parkingData, setParkingData] = useState<ParkingStatistics | null>(null);
  const [usageStats, setUsageStats] = useState<ParkingUsageStats | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Calculate percentages for visualization
  const occupancyPercentage = parkingData ? (parkingData.occupiedSpaces / parkingData.totalSpaces) * 100 : 0;
  const reservedPercentage = parkingData ? (parkingData.reservedSpaces / parkingData.totalSpaces) * 100 : 0;
  const availablePercentage = parkingData ? (parkingData.availableSpaces / parkingData.totalSpaces) * 100 : 0;

  // Function to fetch parking statistics from Firebase
  const fetchParkingStatistics = async () => {
    try {
      setLoading(true);
      setIsUsingMockData(false);
      
      // Fetch the current parking statistics
      const statsRef = doc(firestore, 'parkingStatistics', 'current');
      const statsSnapshot = await getDoc(statsRef);
      
      if (statsSnapshot.exists()) {
        const data = statsSnapshot.data() as ParkingStatistics;
        console.log('Fetched parking statistics:', data);
        setParkingData(data);
      } else {
        console.log('No parking statistics found, using default data');
        // Use default data if none exists in Firestore
        setParkingData(DEFAULT_PARKING_STATS);
        setIsUsingMockData(true);
      }
      
      // Fetch usage statistics
      const usageRef = doc(firestore, 'parkingStatistics', 'usage');
      const usageSnapshot = await getDoc(usageRef);
      
      if (usageSnapshot.exists()) {
        const data = usageSnapshot.data() as ParkingUsageStats;
        console.log('Fetched usage statistics:', data);
        setUsageStats(data);
      } else {
        console.log('No usage statistics found, using default data');
        // Use default data if none exists
        setUsageStats(DEFAULT_USAGE_STATS);
        setIsUsingMockData(true);
      }
      
      // Fetch notifications
      const notificationsRef = collection(firestore, 'notifications');
      const q = query(notificationsRef, where('read', '==', false), where('type', '==', 'parking'));
      const notificationsSnapshot = await getDocs(q);
      
      if (notificationsSnapshot.docs.length > 0) {
        const notificationData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as NotificationItem[];
        
        setNotifications(notificationData);
      } else {
        console.log('No notifications found, using default notifications');
        // Use default notifications if none exist
        setNotifications(DEFAULT_NOTIFICATIONS);
        setIsUsingMockData(true);
      }
    } catch (error) {
      console.error('Error fetching parking data:', error);
      // Use default data in case of any errors
      setParkingData(DEFAULT_PARKING_STATS);
      setUsageStats(DEFAULT_USAGE_STATS);
      setNotifications(DEFAULT_NOTIFICATIONS);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = async (id: string) => {
    try {
      if (isUsingMockData) {
        // Just update local state for mock data
        setNotifications(prev => prev.filter(n => n.id !== id));
        return;
      }

      const notifRef = doc(firestore, 'notifications', id);
      await setDoc(notifRef, { read: true }, { merge: true });
      
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update UI even if Firestore update fails
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchParkingStatistics();
  };

  // Set up real-time listener for parking statistics
  useEffect(() => {
    // Only set up listener if not using mock data
    if (isUsingMockData) return;

    try {
      // Set up listener for real-time updates
      const statsRef = doc(firestore, 'parkingStatistics', 'current');
      
      const unsubscribe = onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data() as ParkingStatistics;
          console.log('Real-time parking statistics update:', data);
          setParkingData(data);
        }
      }, (error) => {
        console.error('Error in statistics snapshot listener:', error);
        // Fall back to default data if listener fails
        if (!parkingData) setParkingData(DEFAULT_PARKING_STATS);
      });
      
      // Clean up listener on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      // Fall back to default data if listener setup fails
      if (!parkingData) setParkingData(DEFAULT_PARKING_STATS);
    }
  }, [isUsingMockData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchParkingStatistics();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  if (loading || !parkingData || !usageStats) {
    return (
      <AppLayout
        paddingHorizontal={20}
        paddingVertical={16}
        scrollable={true}
        statusBarStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: currentColors.text.primary }]}>
            {t('loading')}
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      paddingHorizontal={20}
      paddingVertical={16}
      scrollable={true}
      statusBarStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
    >
      <Text style={[styles.headerText, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('monitor')}</Text>
      
      {isUsingMockData && (
        <View style={[styles.mockDataBanner, { backgroundColor: colors.accent + '20' }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
          <Text style={[styles.mockDataText, { color: currentColors.text.primary }]}>
            {t('usingDemoData' as any)}
          </Text>
        </View>
      )}

      <View style={[styles.contentContainer]}>
        <View style={[styles.statusCard, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.statusTitle, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('parkingStatus')}</Text>
          
          <View style={styles.occupancyBar}>
            <View 
              style={[
                styles.occupiedBar, 
                { width: `${occupancyPercentage}%`, backgroundColor: currentColors.error }
              ]} 
            />
            <View 
              style={[
                styles.reservedBar, 
                { width: `${reservedPercentage}%`, backgroundColor: colors.status.reserved }
              ]} 
            />
            <View 
              style={[
                styles.availableBar, 
                { width: `${availablePercentage}%`, backgroundColor: colors.status.available }
              ]} 
            />
          </View>
          
          <View style={[styles.legendContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.legendColorOccupied, { backgroundColor: currentColors.error, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }]} />
              <Text style={[styles.legendText, { color: currentColors.text.primary }]}>{t('occupiedSlots')} ({parkingData.occupiedSpaces})</Text>
            </View>
            <View style={[styles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.legendColorReserved, { backgroundColor: colors.status.reserved, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }]} />
              <Text style={[styles.legendText, { color: currentColors.text.primary }]}>{t('reservedSlots')} ({parkingData.reservedSpaces})</Text>
            </View>
            <View style={[styles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.legendColorAvailable, { backgroundColor: colors.status.available, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }]} />
              <Text style={[styles.legendText, { color: currentColors.text.primary }]}>{t('availableSlots')} ({parkingData.availableSpaces})</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.refreshButton, { backgroundColor: currentColors.accent + '20' }]}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Ionicons 
              name="refresh" 
              size={18} 
              color={currentColors.accent} 
            />
            <Text style={[styles.refreshText, { color: currentColors.accent }]}>
              {refreshing ? t('loading') : t('connected')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.dataCard, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.dataTitle, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('statistics')}</Text>
          <View style={[styles.dataRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.dataLabel, { color: currentColors.text.secondary, textAlign: isRTL ? 'right' : 'left' }]}>{t('home')}:</Text>
            <Text style={[styles.dataValue, { color: currentColors.accent, textAlign: isRTL ? 'left' : 'right' }]}>{usageStats.peakHours}</Text>
          </View>
          <View style={[styles.dataRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.dataLabel, { color: currentColors.text.secondary, textAlign: isRTL ? 'right' : 'left' }]}>{t('parkingStatus')}:</Text>
            <Text style={[styles.dataValue, { color: currentColors.accent, textAlign: isRTL ? 'left' : 'right' }]}>{usageStats.occupancyRate}</Text>
          </View>
          <View style={[styles.dataRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.dataLabel, { color: currentColors.text.secondary, textAlign: isRTL ? 'right' : 'left' }]}>{t('duration')}:</Text>
            <Text style={[styles.dataValue, { color: currentColors.accent, textAlign: isRTL ? 'left' : 'right' }]}>{usageStats.averageDuration} {t('perHour')}</Text>
          </View>
        </View>
        
        <View style={[styles.alertsCard, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.alertsTitle, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('notifications')}</Text>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity 
                key={notification.id} 
                style={[styles.alertItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => markNotificationAsRead(notification.id)}
              >
                <View style={[styles.alertDot, { backgroundColor: colors.status.reserved, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertText, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>
                    {notification.message}
                  </Text>
                  <Text style={[styles.alertTime, { color: currentColors.text.secondary, textAlign: isRTL ? 'right' : 'left' }]}>
                    {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Ionicons name="close-circle" size={20} color={currentColors.text.secondary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyNotifications}>
              <Text style={[styles.emptyText, { color: currentColors.text.secondary }]}>
                {t('settings')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
  },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  occupancyBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  occupiedBar: {
    height: '100%',
  },
  reservedBar: {
    height: '100%',
  },
  availableBar: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorOccupied: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendColorReserved: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendColorAvailable: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  refreshText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  dataCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 16,
  },
  dataValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  alertContent: {
    flex: 1,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  alertText: {
    fontSize: 15,
  },
  alertTime: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyNotifications: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
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
  mockDataBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  mockDataText: {
    fontSize: 14,
    marginLeft: 6,
  },
});

export default MonitorScreen; 