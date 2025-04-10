import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { ReservationCardProps } from '../../types';
import theme from '../../theme/theme';
import { useTheme } from '../../theme/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Create a safe theme with proper fallbacks
const safeColors = {
  primary: theme.colors.primary || '#0F1544',
  secondary: theme.colors.secondary || '#2563EB',
  accent: theme.colors.accent || '#F59E0B',
  error: theme.colors.error || '#EF4444',
  warning: theme.colors.warning || '#F59E0B',
  info: theme.colors.info || '#3B82F6',
  success: theme.colors.success || '#10B981',
  surface: theme.colors.light?.surface || '#FFFFFF',
  divider: theme.colors.light?.divider || '#E5E7EB',
  status: {
    available: theme.colors.status?.available || '#10B981',
    occupied: theme.colors.status?.occupied || '#EF4444',
    reserved: theme.colors.status?.reserved || '#F59E0B',
    outOfService: theme.colors.status?.outOfService || '#6B7280'
  },
  text: {
    primary: theme.colors.light?.text?.primary || '#111827',
    secondary: theme.colors.light?.text?.secondary || '#4B5563'
  }
};

const safeShadows = {
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
};

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onPress }) => {
  const { themeMode, colors } = useTheme();
  
  // Current theme colors
  const currentColors = themeMode === 'dark' ? colors.dark : colors.light;
  
  // Animation value for press effect
  const scale = useSharedValue(1);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status color
  const getStatusColor = () => {
    switch (reservation.status) {
      case 'ACTIVE':
        return theme.colors.status.available;
      case 'COMPLETED':
        return theme.colors.info;
      case 'CANCELLED':
        return theme.colors.error;
      default:
        return currentColors.text.secondary;
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (reservation.status) {
      case 'ACTIVE':
        return 'checkmark-circle';
      case 'COMPLETED':
        return 'time-outline';
      case 'CANCELLED':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  // Get payment status color
  const getPaymentStatusColor = () => {
    switch (reservation.paymentStatus) {
      case 'PAID':
        return theme.colors.status.available;
      case 'PENDING':
        return theme.colors.warning;
      case 'REFUNDED':
        return theme.colors.info;
      default:
        return currentColors.text.secondary;
    }
  };

  // Get payment status icon
  const getPaymentStatusIcon = () => {
    switch (reservation.paymentStatus) {
      case 'PAID':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time-outline';
      case 'REFUNDED':
        return 'arrow-undo-circle';
      default:
        return 'help-circle';
    }
  };

  // Calculate duration
  const calculateDuration = () => {
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return `${diffHrs} ${diffHrs === 1 ? 'hr' : 'hrs'}`;
    } else {
      const days = Math.floor(diffHrs / 24);
      const remainingHrs = diffHrs % 24;
      return `${days} ${days === 1 ? 'day' : 'days'} ${remainingHrs > 0 ? `${remainingHrs} hrs` : ''}`;
    }
  };

  // Animated style for press effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedTouchable 
      style={[
        styles.card, 
        { 
          borderLeftColor: getStatusColor(),
          backgroundColor: currentColors.surface,
          ...theme.shadows.md
        },
        animatedStyle
      ]} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      {/* Header with status */}
      <View style={styles.header}>
        <View style={styles.reservationId}>
          <Text style={[styles.reservationIdLabel, { color: currentColors.text.secondary }]}>
            Booking ID
          </Text>
          <Text style={[styles.reservationIdValue, { color: currentColors.text.primary }]}>
            {reservation.id}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Ionicons name={getStatusIcon()} size={14} color={getStatusColor()} style={styles.statusIcon} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{reservation.status}</Text>
        </View>
      </View>

      {/* Time section */}
      <View style={styles.timeSection}>
        <View style={styles.timeColumn}>
          <View style={styles.timeIconWrapper}>
            <Ionicons name="time-outline" size={14} color={colors.accent} />
            <Text style={[styles.timeLabel, { color: currentColors.text.secondary }]}>
              Start Time
            </Text>
          </View>
          <Text style={[styles.timeValue, { color: currentColors.text.primary }]}>
            {formatDate(reservation.startTime)}
          </Text>
        </View>
        <View style={styles.timeColumn}>
          <View style={styles.timeIconWrapper}>
            <Ionicons name="flag-outline" size={14} color={colors.accent} />
            <Text style={[styles.timeLabel, { color: currentColors.text.secondary }]}>
              End Time
            </Text>
          </View>
          <Text style={[styles.timeValue, { color: currentColors.text.primary }]}>
            {formatDate(reservation.endTime)}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: currentColors.divider }]} />

      {/* Details section */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconWrapper}>
            <Ionicons name="hourglass-outline" size={14} color={colors.accent} />
            <Text style={[styles.detailLabel, { color: currentColors.text.secondary }]}>
              Duration
            </Text>
          </View>
          <Text style={[styles.detailValue, { color: currentColors.text.primary }]}>
            {calculateDuration()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.detailIconWrapper}>
            <Ionicons name="location-outline" size={14} color={colors.accent} />
            <Text style={[styles.detailLabel, { color: currentColors.text.secondary }]}>
              Slot ID
            </Text>
          </View>
          <Text style={[styles.detailValue, { color: currentColors.text.primary }]}>
            {reservation.slotId}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.detailIconWrapper}>
            <Ionicons name="cash-outline" size={14} color={colors.accent} />
            <Text style={[styles.detailLabel, { color: currentColors.text.secondary }]}>
              Cost
            </Text>
          </View>
          <Text style={[styles.costValue, { color: colors.accent }]}>
            LE {reservation.totalCost}
          </Text>
        </View>
      </View>

      {/* Payment status */}
      <View style={[styles.paymentStatus, { backgroundColor: getPaymentStatusColor() + '15' }]}>
        <Ionicons name={getPaymentStatusIcon()} size={16} color={getPaymentStatusColor()} style={styles.paymentIcon} />
        <Text style={[styles.paymentStatusText, { color: getPaymentStatusColor() }]}>
          Payment: {reservation.paymentStatus}
        </Text>
      </View>
    </AnimatedTouchable>
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
    marginBottom: theme.spacing.md,
  },
  reservationId: {
    flex: 1,
  },
  reservationIdLabel: {
    fontSize: theme.typography.fontSize.xs,
    marginBottom: theme.spacing['0.5'],
  },
  reservationIdValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
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
  timeSection: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timeColumn: {
    flex: 1,
  },
  timeIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['1'],
  },
  timeLabel: {
    fontSize: theme.typography.fontSize.xs,
    marginLeft: 4,
  },
  timeValue: {
    fontSize: theme.typography.fontSize.sm,
    marginLeft: 18, // Align with icon
  },
  divider: {
    height: 1,
    marginVertical: theme.spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['1'],
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.xs,
    marginLeft: 4,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    marginLeft: 18, // Align with icon
  },
  paymentStatus: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.radius.md,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 4,
  },
  paymentStatusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  // Special styling for cost value
  costValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
    marginLeft: 18, // Align with icon
  },
});

export default ReservationCard; 