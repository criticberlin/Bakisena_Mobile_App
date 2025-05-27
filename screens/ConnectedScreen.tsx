import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../components/ActionButton';
import AppLayout from '../components/layout/AppLayout';
import { useLanguage } from '../constants/translations/LanguageContext';
import { firestore } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'vehicle' | 'payment' | 'smart_home' | 'wearable';
  status: 'connected' | 'disconnected' | 'pairing';
  lastConnected: string;
  isActive: boolean;
  userId?: string;
}

const ConnectedScreen = () => {
  const { themeMode, colors, switchStyles } = useTheme();
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch devices from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    
    // Create a query to get devices for the current user
    const devicesRef = collection(firestore, 'connectedDevices');
    const q = query(devicesRef, where('userId', '==', user.uid));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const deviceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ConnectedDevice[];
        
        console.log(`Fetched ${deviceData.length} connected devices`);
        setDevices(deviceData);
      } catch (error) {
        console.error('Error fetching connected devices:', error);
        Alert.alert(t('error'), String(error));
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error in device snapshot listener:', error);
      setLoading(false);
      Alert.alert(t('error'), String(error));
    });
    
    // Clean up listener on unmount
    return () => unsubscribe();
  }, [user?.uid]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return 'car-outline';
      case 'payment':
        return 'card-outline';
      case 'smart_home':
        return 'home-outline';
      case 'wearable':
        return 'watch-outline';
      default:
        return 'hardware-chip-outline';
    }
  };

  const toggleDeviceStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Update in Firestore
      const deviceRef = doc(firestore, 'connectedDevices', id);
      await updateDoc(deviceRef, {
        isActive: !currentStatus,
        lastUpdated: new Date().toISOString()
      });
      
      // No need to update local state as the onSnapshot listener will handle it
      console.log(`Device ${id} status updated`);
    } catch (error) {
      console.error('Error updating device status:', error);
      Alert.alert(t('error'), String(error));
      
      // Revert the toggle in the UI if the Firebase update fails
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? { ...device, isActive: currentStatus } : device
        )
      );
    }
  };

  const filteredDevices = devices.filter(device => {
    if (activeFilter === 'all') return true;
    return device.type === activeFilter;
  });

  const DeviceCard = ({ device }: { device: ConnectedDevice }) => (
    <View style={[styles.deviceCard, { backgroundColor: currentColors.surface }]}>
      <View style={[
        styles.deviceIconContainer, 
        { 
          backgroundColor: `${currentColors.accent}10`,
          marginRight: isRTL ? 0 : 16,
          marginLeft: isRTL ? 16 : 0
        }
      ]}>
        <Ionicons 
          name={getDeviceIcon(device.type) as any} 
          size={24} 
          color={device.isActive ? currentColors.accent : currentColors.text.primary}
        />
      </View>
      
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceName, { color: currentColors.text.primary }]}>{device.name}</Text>
        <View style={[styles.deviceStatus, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[
            styles.statusIndicator, 
            { 
              backgroundColor: 
                device.status === 'connected' ? colors.status.available : 
                device.status === 'disconnected' ? colors.error : 
                colors.secondary,
              marginRight: isRTL ? 0 : 6,
              marginLeft: isRTL ? 6 : 0
            }
          ]} />
          <Text style={[styles.statusText, { color: currentColors.text.primary }]}>{device.status}</Text>
          <Text style={[
            styles.lastConnected, 
            { 
              color: currentColors.text.primary,
              marginLeft: isRTL ? 0 : 6,
              marginRight: isRTL ? 6 : 0
            }
          ]}>• {device.lastConnected}</Text>
        </View>
      </View>
      
      <Switch
        value={device.isActive}
        onValueChange={() => toggleDeviceStatus(device.id, device.isActive)}
        trackColor={switchStyles.trackColor}
        thumbColor={switchStyles.thumbColor(device.isActive)}
        ios_backgroundColor={switchStyles.ios_backgroundColor}
      />
    </View>
  );

  // Filter buttons
  const FilterButton = ({ title, value }: { title: string; value: string }) => (
    <TouchableOpacity 
      style={[
        styles.filterButton, 
        { backgroundColor: currentColors.surface },
        activeFilter === value && [styles.filterButtonActive, { backgroundColor: currentColors.accent }]
      ]}
      onPress={() => setActiveFilter(value)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          { color: activeFilter === value ? '#FFF' : currentColors.text.primary }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const handleAddDevice = () => {
    // Navigate to add device screen or show modal
    Alert.alert(
      t('connected'),
      t('notImplemented'),
      [{ text: t('ok') }]
    );
  };

  if (loading) {
    return (
      <AppLayout
        paddingHorizontal={20}
        paddingVertical={16}
        scrollable={true}
        bottomNavPadding={true}
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
      bottomNavPadding={true}
    >
      <Text style={[styles.headerText, { color: currentColors.text.primary }]}>{t('connected')}</Text>
      
      <View style={[styles.filterContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <FilterButton title={t('all')} value="all" />
        <FilterButton title={t('car')} value="vehicle" />
        <FilterButton title={t('paymentMethods')} value="payment" />
        <FilterButton title={t('home')} value="smart_home" />
        <FilterButton title={t('other')} value="wearable" />
      </View>
      
      <View style={styles.devicesList}>
        {filteredDevices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
        
        {filteredDevices.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bluetooth-outline" size={48} color={currentColors.text.primary} />
            <Text style={[styles.emptyStateText, { color: currentColors.text.primary }]}>{t('noVehicles')}</Text>
            <Text style={[styles.emptyStateSubText, { color: currentColors.text.primary }]}>{t('notImplemented')}</Text>
          </View>
        )}
      </View>
      
      <View style={[styles.buttonContainer, { borderTopColor: currentColors.divider }]}>
        <ActionButton
          title={t('connected')}
          onPress={handleAddDevice}
          variant="primary"
          icon={<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />}
        />
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#FDC200',
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  devicesList: {
    marginBottom: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
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
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  lastConnected: {
    fontSize: 12,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 16,
    marginTop: 8,
  },
  buttonContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    marginBottom: 90,
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

export default ConnectedScreen; 