import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ReservationCardProps } from '../../types';
import theme from '../../theme/theme';

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onPress }) => {
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
        return theme.colors.text.secondary;
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
        return theme.colors.text.secondary;
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

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: getStatusColor() }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header with status */}
      <View style={styles.header}>
        <View style={styles.reservationId}>
          <Text style={styles.reservationIdLabel}>Booking ID</Text>
          <Text style={styles.reservationIdValue}>{reservation.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{reservation.status}</Text>
        </View>
      </View>

      {/* Time section */}
      <View style={styles.timeSection}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Start Time</Text>
          <Text style={styles.timeValue}>{formatDate(reservation.startTime)}</Text>
        </View>
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>End Time</Text>
          <Text style={styles.timeValue}>{formatDate(reservation.endTime)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Details section */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{calculateDuration()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Slot ID</Text>
          <Text style={styles.detailValue}>{reservation.slotId}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cost</Text>
          <Text style={styles.costValue}>LE {reservation.totalCost}</Text>
        </View>
      </View>

      {/* Payment status */}
      <View style={[styles.paymentStatus, { backgroundColor: getPaymentStatusColor() + '20' }]}>
        <Text style={[styles.paymentStatusText, { color: getPaymentStatusColor() }]}>
          Payment: {reservation.paymentStatus}
        </Text>
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
    marginBottom: theme.spacing.md,
  },
  reservationId: {
    flex: 1,
  },
  reservationIdLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  reservationIdValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
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
  timeSection: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  timeValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
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
  detailLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  paymentStatus: {
    padding: theme.spacing.sm,
    borderRadius: theme.borders.radius.sm,
    alignSelf: 'flex-start',
  },
  paymentStatusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
  },
  // Special styling for cost value
  costValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
});

export default ReservationCard; 