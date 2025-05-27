import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import AppLayout from '../components/layout/AppLayout';
import { useLanguage } from '../constants/translations/LanguageContext';
import { firestore } from '../config/firebase';
import { doc, getDoc, collection, query, getDocs, where, onSnapshot } from 'firebase/firestore';

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

const MonitorScreen = () => {
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  
  // State for parking data
  const [parkingData, setParkingData] = useState<ParkingStatistics | null>(null);
  const [usageStats, setUsageStats] = useState<ParkingUsageStats | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate percentages for visualization
  const occupancyPercentage = parkingData ? (parkingData.occupiedSpaces / parkingData.totalSpaces) * 100 : 0;
  const reservedPercentage = parkingData ? (parkingData.reservedSpaces / parkingData.totalSpaces) * 100 : 0;
  const availablePercentage = parkingData ? (parkingData.availableSpaces / parkingData.totalSpaces) * 100 : 0;

  // Function to fetch parking statistics from Firebase
  const fetchParkingStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch the current parking statistics
      const statsRef = doc(firestore, 'parkingStatistics', 'current');
      const statsSnapshot = await getDoc(statsRef);
      
      if (statsSnapshot.exists()) {
        const data = statsSnapshot.data() as ParkingStatistics;
        console.log('Fetched parking statistics:', data);
        setParkingData(data);
      } else {
        console.log('No parking statistics found');
        // Create default data if none exists
        setParkingData({
          totalSpaces: 120,
          occupiedSpaces: 78,
          reservedSpaces: 12,
          availableSpaces: 30,
          lastUpdated: new Date().toISOString()
        });
      }
      
      // Fetch usage statistics
      const usageRef = doc(firestore, 'parkingStatistics', 'usage');
      const usageSnapshot = await getDoc(usageRef);
      
      if (usageSnapshot.exists()) {
        const data = usageSnapshot.data() as ParkingUsageStats;
        console.log('Fetched usage statistics:', data);
        setUsageStats(data);
      } else {
        // Create default usage stats if none exists
        setUsageStats({
          peakHours: '08:00 - 10:00, 17:00 - 19:00',
          occupancyRate: '65%',
          averageDuration: 3.2
        });
      }
      
      // Fetch notifications
      const notificationsRef = collection(firestore, 'notifications');
      const q = query(notificationsRef, where('read', '==', false));
      const notificationsSnapshot = await getDocs(q);
      
      const notificationMessages = notificationsSnapshot.docs.map(doc => doc.data().message as string);
      setNotifications(notificationMessages.length > 0 ? notificationMessages : [
        t('totalSlots'),
        t('settings')
      ]);
      
    } catch (error) {
      console.error('Error fetching parking data:', error);
      Alert.alert(t('error'), String(error));
      
      // Set default data in case of error
      setParkingData({
        totalSpaces: 120,
        occupiedSpaces: 78,
        reservedSpaces: 12,
        availableSpaces: 30,
        lastUpdated: new Date().toISOString()
      });
      
      setUsageStats({
        peakHours: '08:00 - 10:00, 17:00 - 19:00',
        occupancyRate: '65%',
        averageDuration: 3.2
      });
      
      setNotifications([
        t('totalSlots'),
        t('settings')
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time listener for parking statistics
  useEffect(() => {
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
    });
    
    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

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
    >
      <Text style={[styles.headerText, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('monitor')}</Text>
      
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
            <Text style={[styles.dataValue, { color: currentColors.accent, textAlign: isRTL ? 'left' : 'right' }]}>{usageStats.averageDuration}</Text>
          </View>
        </View>
        
        <View style={[styles.alertsCard, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.alertsTitle, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('notifications')}</Text>
          {notifications.map((notification, index) => (
            <View key={index} style={[styles.alertItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.alertDot, { backgroundColor: colors.status.reserved, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]} />
              <Text style={[styles.alertText, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{notification}</Text>
            </View>
          ))}
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
    marginBottom: 8,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  alertText: {
    fontSize: 16,
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
});

export default MonitorScreen; 