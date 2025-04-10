import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PricingCardProps } from '../../types';
import theme from '../../theme/theme';

const PricingCard: React.FC<PricingCardProps> = ({ plan, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {plan.discountPercent && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{plan.discountPercent}% OFF</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.planName}>{plan.name}</Text>
        {plan.isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>Active</Text>
          </View>
        )}
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.currency}>LE</Text>
        <Text style={styles.price}>{plan.hourlyRate}</Text>
        <Text style={styles.period}>/hour</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.rateRow}>
        <Text style={styles.rateLabel}>Daily Rate:</Text>
        <Text style={styles.rateValue}>LE {plan.dailyRate}/day</Text>
      </View>
      
      <View style={styles.rateRow}>
        <Text style={styles.rateLabel}>Monthly Rate:</Text>
        <Text style={styles.rateValue}>LE {plan.monthlyRate}/month</Text>
      </View>
      
      {plan.discountPercent && (
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>
            Save up to LE {Math.round(plan.monthlyRate * (plan.discountPercent / 100))} with monthly plan
          </Text>
        </View>
      )}
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
    position: 'relative',
    overflow: 'hidden',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomLeftRadius: theme.borders.radius.md,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  planName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  activeBadge: {
    backgroundColor: theme.colors.status.available,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.sm,
  },
  activeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  currency: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 4,
  },
  price: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginHorizontal: 2,
  },
  period: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.md,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  rateLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  rateValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  savingsContainer: {
    backgroundColor: theme.colors.accent + '20', // 20% opacity
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.sm,
    marginTop: theme.spacing.md,
  },
  savingsText: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PricingCard; 