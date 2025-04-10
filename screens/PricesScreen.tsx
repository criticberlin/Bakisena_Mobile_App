import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import PricingCard from '../components/prices/PricingCard';
import ActionButton from '../components/ActionButton';
import { MOCK_LOCATIONS, MOCK_PRICING_PLANS } from '../constants/mockData';
import { RootStackParamList, PricingPlan } from '../types';
import theme from '../theme/theme';

type PricesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PricesPage'>;

const PricesScreen: React.FC = () => {
  const navigation = useNavigation<PricesScreenNavigationProp>();
  
  // State for the cost estimator
  const [selectedLocation, setSelectedLocation] = useState(MOCK_LOCATIONS[0].id);
  const [hours, setHours] = useState('1');
  const [days, setDays] = useState('0');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  // Filter plans based on location
  const getLocationPlans = (locationId: string): PricingPlan[] => {
    return MOCK_PRICING_PLANS.filter(plan => plan.locationId === locationId);
  };

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    const selectedPlan = MOCK_PRICING_PLANS.find(plan => plan.locationId === selectedLocation);
    
    if (selectedPlan) {
      const hoursNum = parseInt(hours) || 0;
      const daysNum = parseInt(days) || 0;
      
      const totalHours = hoursNum + (daysNum * 24);
      
      if (totalHours >= 24 * 30) {
        // Monthly rate
        const months = Math.floor(totalHours / (24 * 30));
        const remainingDays = Math.floor((totalHours % (24 * 30)) / 24);
        const remainingHours = totalHours % 24;
        
        let cost = (months * selectedPlan.monthlyRate) +
                  (remainingDays * selectedPlan.dailyRate) +
                  (remainingHours * selectedPlan.hourlyRate);
                  
        // Apply discount if any
        if (selectedPlan.discountPercent) {
          cost = cost - (cost * (selectedPlan.discountPercent / 100));
        }
        
        setEstimatedCost(Math.round(cost * 100) / 100);
      } else if (totalHours >= 24) {
        // Daily rate
        const daysTotal = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;
        
        const cost = (daysTotal * selectedPlan.dailyRate) +
                     (remainingHours * selectedPlan.hourlyRate);
        
        setEstimatedCost(Math.round(cost * 100) / 100);
      } else {
        // Hourly rate
        const cost = totalHours * selectedPlan.hourlyRate;
        setEstimatedCost(Math.round(cost * 100) / 100);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing Plans</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Intro Section */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Transparent & Flexible Pricing</Text>
          <Text style={styles.introDescription}>
            Choose from various pricing options to suit your parking needs, from hourly to monthly plans.
          </Text>
        </View>
        
        {/* Pricing Plans by Location */}
        {MOCK_LOCATIONS.map(location => (
          <View key={location.id} style={styles.locationSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </View>
            
            {getLocationPlans(location.id).map(plan => (
              <PricingCard 
                key={plan.id} 
                plan={plan} 
                onPress={() => {
                  // In a real app, this would navigate to a booking screen with this plan
                  setSelectedLocation(location.id);
                }}
              />
            ))}
          </View>
        ))}
        
        {/* Cost Estimator */}
        <View style={styles.estimatorSection}>
          <Text style={styles.sectionTitle}>Cost Estimator</Text>
          <Text style={styles.sectionSubtitle}>Calculate your parking expenses</Text>
          
          <View style={styles.estimatorCard}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Select Location</Text>
              <View style={styles.selectContainer}>
                {MOCK_LOCATIONS.map(location => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.locationOption,
                      selectedLocation === location.id && styles.selectedLocationOption
                    ]}
                    onPress={() => setSelectedLocation(location.id)}
                  >
                    <Text 
                      style={[
                        styles.locationOptionText,
                        selectedLocation === location.id && styles.selectedLocationOptionText
                      ]}
                    >
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.durationContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Hours</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hours}
                  onChangeText={setHours}
                  placeholder="0"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Days</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
                  placeholder="0"
                />
              </View>
            </View>
            
            <ActionButton
              title="Calculate Cost"
              onPress={calculateEstimatedCost}
              style={styles.calculateButton}
            />
            
            {estimatedCost !== null && (
              <View style={styles.estimatedCostContainer}>
                <Text style={styles.estimatedCostLabel}>Estimated Cost</Text>
                <Text style={styles.estimatedCostValue}>LE {estimatedCost.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Accepted Payment Methods</Text>
          <View style={styles.paymentMethodsContainer}>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>💳</Text>
              <Text style={styles.paymentMethodText}>Credit Card</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>🏦</Text>
              <Text style={styles.paymentMethodText}>Debit Card</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>📱</Text>
              <Text style={styles.paymentMethodText}>Mobile Pay</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>💸</Text>
              <Text style={styles.paymentMethodText}>Cash</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  backButton: {
    width: 50,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  introSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary + '10', // 10% opacity
    margin: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
  },
  introTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  introDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.md,
  },
  locationSection: {
    marginVertical: theme.spacing.md,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  locationAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  estimatorSection: {
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  estimatorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  formLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    height: 45,
    borderRadius: theme.borders.radius.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  selectedLocationOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  locationOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  selectedLocationOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calculateButton: {
    marginVertical: theme.spacing.md,
  },
  estimatedCostContainer: {
    backgroundColor: theme.colors.primary + '15',
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
  },
  estimatedCostLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  estimatedCostValue: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  paymentMethodsSection: {
    padding: theme.spacing.lg,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
  },
  paymentMethod: {
    width: '25%',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  paymentMethodText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default PricesScreen; 