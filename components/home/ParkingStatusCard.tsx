import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ParkingStatusCardProps } from '../../types';
import theme from '../../theme/theme';
import { useTheme } from '../../theme/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ParkingStatusCard: React.FC<ParkingStatusCardProps> = ({ location, onPress }) => {
  const { themeMode } = useTheme();
  
  // Calculate availability percentage
  const availabilityPercentage = Math.round((location.availableSlots / location.totalSlots) * 100);
  
  // Animation value for press effect
  const scale = useSharedValue(1);
  
  // Determine status color based on availability
  const getStatusColor = () => {
    if (availabilityPercentage > 50) return theme.colors.status.available;
    if (availabilityPercentage > 20) return theme.colors.status.reserved;
    return theme.colors.status.occupied;
  };

  // Get status text based on availability
  const getStatusText = () => {
    if (availabilityPercentage > 50) return 'Available';
    if (availabilityPercentage > 20) return 'Filling Up';
    return 'Almost Full';
  };

  // Get icon based on status
  const getStatusIcon = () => {
    if (availabilityPercentage > 50) return 'checkmark-circle';
    if (availabilityPercentage > 20) return 'alert-circle';
    return 'close-circle';
  };

  // Animated style for press effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <AnimatedTouchableOpacity 
      style={[
        styles.card, 
        { 
          borderLeftColor: getStatusColor(),
          backgroundColor: themeMode === 'dark' ? theme.colors.dark.surface : theme.colors.light.surface,
          ...theme.shadows.md
        },
        animatedStyle
      ]} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        <Text style={[
          styles.locationName,
          { color: themeMode === 'dark' ? theme.colors.dark.text.primary : theme.colors.light.text.primary }
        ]}>
          {location.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Ionicons name={getStatusIcon()} size={14} color={getStatusColor()} style={styles.statusIcon} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <Text style={[
        styles.address,
        { color: themeMode === 'dark' ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary }
      ]}>
        {location.address}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={[
            styles.statValue,
            { color: themeMode === 'dark' ? theme.colors.dark.text.primary : theme.colors.light.text.primary }
          ]}>
            {location.availableSlots}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: themeMode === 'dark' ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary }
          ]}>
            Free Spots
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[
            styles.statValue,
            { color: themeMode === 'dark' ? theme.colors.dark.text.primary : theme.colors.light.text.primary }
          ]}>
            {location.totalSlots}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: themeMode === 'dark' ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary }
          ]}>
            Total Spots
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[
            styles.statValue,
            { color: themeMode === 'dark' ? theme.colors.dark.text.primary : theme.colors.light.text.primary }
          ]}>
            LE {location.pricePerHour}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: themeMode === 'dark' ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary }
          ]}>
            Per Hour
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[
          styles.progressBackground,
          { backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]}>
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
        <View style={styles.progressTextContainer}>
          <Ionicons name="car-outline" size={14} color={getStatusColor()} />
          <Text style={[
            styles.progressText,
            { color: themeMode === 'dark' ? theme.colors.dark.text.secondary : theme.colors.light.text.secondary }
          ]}>
            {availabilityPercentage}% Available
          </Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borders.radius.xl,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  address: {
    fontSize: theme.typography.fontSize.sm,
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
    fontWeight: '700',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBackground: {
    height: 6,
    borderRadius: theme.borders.radius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borders.radius.full,
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    marginLeft: 4,
  },
});

export default ParkingStatusCard; 