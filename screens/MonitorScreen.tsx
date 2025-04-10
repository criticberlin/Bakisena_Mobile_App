import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../theme/theme';
import { useFocusEffect } from '@react-navigation/native';

const MonitorScreen = () => {
  // Simulated data for parking occupancy
  const parkingData = {
    totalSpaces: 120,
    occupiedSpaces: 78,
    reservedSpaces: 12,
    availableSpaces: 30,
  };

  // Calculate percentages for visualization
  const occupancyPercentage = (parkingData.occupiedSpaces / parkingData.totalSpaces) * 100;
  const reservedPercentage = (parkingData.reservedSpaces / parkingData.totalSpaces) * 100;
  const availablePercentage = (parkingData.availableSpaces / parkingData.totalSpaces) * 100;

  // Mock function to refresh data - in a real app this would fetch from an API
  const refreshData = () => {
    console.log('Refreshing parking data...');
    // Implementation would fetch real-time data
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshData();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Parking Monitor</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Real-time Occupancy</Text>
          
          <View style={styles.occupancyBar}>
            <View 
              style={[
                styles.occupiedBar, 
                { width: `${occupancyPercentage}%` }
              ]} 
            />
            <View 
              style={[
                styles.reservedBar, 
                { width: `${reservedPercentage}%` }
              ]} 
            />
            <View 
              style={[
                styles.availableBar, 
                { width: `${availablePercentage}%` }
              ]} 
            />
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.legendColorOccupied} />
              <Text style={styles.legendText}>Occupied ({parkingData.occupiedSpaces})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendColorReserved} />
              <Text style={styles.legendText}>Reserved ({parkingData.reservedSpaces})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendColorAvailable} />
              <Text style={styles.legendText}>Available ({parkingData.availableSpaces})</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.dataCard}>
          <Text style={styles.dataTitle}>Today's Statistics</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Peak Hours:</Text>
            <Text style={styles.dataValue}>08:00 - 10:00, 17:00 - 19:00</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Average Occupancy:</Text>
            <Text style={styles.dataValue}>65%</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Turnover Rate:</Text>
            <Text style={styles.dataValue}>3.2 vehicles/slot/day</Text>
          </View>
        </View>
        
        <View style={styles.alertsCard}>
          <Text style={styles.alertsTitle}>System Alerts</Text>
          <View style={styles.alertItem}>
            <View style={styles.alertDot} />
            <Text style={styles.alertText}>Level 2 is nearly full (95% occupancy)</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={styles.alertDot} />
            <Text style={styles.alertText}>Maintenance scheduled for Level 3 tomorrow</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  statusTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.error,
  },
  reservedBar: {
    height: '100%',
    backgroundColor: theme.colors.warning,
  },
  availableBar: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorOccupied: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.error,
    marginRight: 4,
  },
  legendColorReserved: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.warning,
    marginRight: 4,
  },
  legendColorAvailable: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    marginRight: 4,
  },
  legendText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  dataCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  dataTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  dataLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  dataValue: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.md,
  },
  alertsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  alertsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.warning,
    marginRight: theme.spacing.sm,
  },
  alertText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
});

export default MonitorScreen; 