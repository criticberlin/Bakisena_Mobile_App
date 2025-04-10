import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ParkingStatusCardProps } from '../../types';
import theme from '../../theme/theme';

const ParkingStatusCard: React.FC<ParkingStatusCardProps> = ({ location, onPress }) => {
  // Calculate availability percentage
  const availabilityPercentage = Math.round((location.availableSlots / location.totalSlots) * 100);
  
  // Determine status color based on availability
  const getStatusColor = () => {
    if (availabilityPercentage > 50) return theme.colors.status.available;
    if (availabilityPercentage > 20) return theme.colors.status.reserved;
    return theme.colors.status.occupied;
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: getStatusColor() }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.locationName}>{location.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {availabilityPercentage > 50 ? 'Available' : availabilityPercentage > 20 ? 'Filling Up' : 'Almost Full'}
          </Text>
        </View>
      </View>

      <Text style={styles.address}>{location.address}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{location.availableSlots}</Text>
          <Text style={styles.statLabel}>Free Spots</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{location.totalSlots}</Text>
          <Text style={styles.statLabel}>Total Spots</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>LE {location.pricePerHour}</Text>
          <Text style={styles.statLabel}>Per Hour</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${availabilityPercentage}%`,
                backgroundColor: getStatusColor()
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{availabilityPercentage}% Available</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.medium,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.sm,
  },
  statusText: {
    color: 'white',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: 'bold',
  },
  address: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBackground: {
    height: 8,
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borders.radius.circle,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borders.radius.circle,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
});

export default ParkingStatusCard; 