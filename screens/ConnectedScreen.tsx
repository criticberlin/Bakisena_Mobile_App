import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../components/ActionButton';

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'vehicle' | 'payment' | 'smart_home' | 'wearable';
  status: 'connected' | 'disconnected' | 'pairing';
  lastConnected: string;
  isActive: boolean;
}

const mockDevices: ConnectedDevice[] = [
  {
    id: '1',
    name: 'Tesla Model 3',
    type: 'vehicle',
    status: 'connected',
    lastConnected: '2 minutes ago',
    isActive: true,
  },
  {
    id: '2',
    name: 'Apple Pay',
    type: 'payment',
    status: 'connected',
    lastConnected: '1 hour ago',
    isActive: true,
  },
  {
    id: '3',
    name: 'Google Home',
    type: 'smart_home',
    status: 'disconnected',
    lastConnected: '2 days ago',
    isActive: false,
  },
  {
    id: '4',
    name: 'Apple Watch',
    type: 'wearable',
    status: 'connected',
    lastConnected: '5 minutes ago',
    isActive: true,
  },
  {
    id: '5',
    name: 'PayPal',
    type: 'payment',
    status: 'connected',
    lastConnected: '3 days ago',
    isActive: true,
  },
];

const ConnectedScreen = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>(mockDevices);
  const [activeFilter, setActiveFilter] = useState<string>('all');

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

  const toggleDeviceStatus = (id: string) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, isActive: !device.isActive } : device
    ));
  };

  const filteredDevices = devices.filter(device => {
    if (activeFilter === 'all') return true;
    return device.type === activeFilter;
  });

  const DeviceCard = ({ device }: { device: ConnectedDevice }) => (
    <View style={styles.deviceCard}>
      <View style={styles.deviceIconContainer}>
        <Ionicons 
          name={getDeviceIcon(device.type) as any} 
          size={24} 
          color={device.isActive ? theme.colors.accent : theme.colors.text.primary}
        />
      </View>
      
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <View style={styles.deviceStatus}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: device.status === 'connected' 
              ? theme.colors.success 
              : device.status === 'pairing' 
                ? theme.colors.warning 
                : theme.colors.error 
            }
          ]} />
          <Text style={styles.statusText}>{device.status}</Text>
          <Text style={styles.lastConnected}>• Last: {device.lastConnected}</Text>
        </View>
      </View>
      
      <Switch
        value={device.isActive}
        onValueChange={() => toggleDeviceStatus(device.id)}
        trackColor={{ false: '#767577', true: `${theme.colors.accent}80` }}
        thumbColor={device.isActive ? theme.colors.accent : '#f4f3f4'}
      />
    </View>
  );

  // Filter buttons
  const FilterButton = ({ title, value }: { title: string; value: string }) => (
    <TouchableOpacity 
      style={[
        styles.filterButton, 
        activeFilter === value && styles.filterButtonActive
      ]}
      onPress={() => setActiveFilter(value)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === value && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Connected Devices</Text>
      
      <View style={styles.filterContainer}>
        <FilterButton title="All" value="all" />
        <FilterButton title="Vehicles" value="vehicle" />
        <FilterButton title="Payment" value="payment" />
        <FilterButton title="Smart Home" value="smart_home" />
        <FilterButton title="Wearables" value="wearable" />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {filteredDevices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
        
        {filteredDevices.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bluetooth-outline" size={48} color={theme.colors.text.primary} />
            <Text style={styles.emptyStateText}>No connected devices found</Text>
            <Text style={styles.emptyStateSubText}>Try connecting a new device</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <ActionButton
          title="Connect New Device"
          onPress={() => console.log('Connect new device')}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.accent,
  },
  filterButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
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
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textTransform: 'capitalize',
  },
  lastConnected: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
});

export default ConnectedScreen; 