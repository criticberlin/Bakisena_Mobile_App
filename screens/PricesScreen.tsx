import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import PricingCard from '../components/prices/PricingCard';
import ActionButton from '../components/ActionButton';
import { MOCK_LOCATIONS, MOCK_PRICING_PLANS } from '../constants/mockData';
import { RootStackParamList, PricingPlan } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';

type PricesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PricesPage'>;

const PricesScreen: React.FC = () => {
  const navigation = useNavigation<PricesScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors - ensure we have default fallbacks
  const currentColors = themeMode === 'light' ? 
    colors?.light || {} : 
    colors?.dark || {};
  
  // Ensure text object exists
  const textColors = currentColors?.text || { 
    primary: '#000000', 
    secondary: '#666666',
    disabled: '#999999',
    hint: '#888888',
    onAccent: '#FFFFFF' 
  };

  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
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
    <AppLayout scrollable={true} paddingHorizontal={0} paddingVertical={0}>
      <StatusBar
        barStyle={themeMode === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={currentColors.background}
      />
      <View style={[styles.header, { 
        flexDirection: isRTL ? 'row-reverse' : 'row',
        borderBottomColor: currentColors.divider,
        backgroundColor: currentColors.background
      }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: currentColors.primary }]}>
            {isRTL ? '→' : '←'} {t('back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColors.primary }]}>{t('pricingPlans')}</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        {/* Intro Section */}
        <View style={[styles.introSection, { backgroundColor: currentColors.primary + '10' }]}>
          <Text style={[styles.introTitle, { color: textColors.primary }]}>{t('transparentPricing')}</Text>
          <Text style={[styles.introDescription, { color: textColors.secondary }]}>
            {t('pricingDescription')}
          </Text>
        </View>
        
        {/* Pricing Plans by Location */}
        {MOCK_LOCATIONS.map(location => (
          <View key={location.id} style={styles.locationSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColors.primary }]}>{location.name}</Text>
              <Text style={[styles.locationAddress, { color: textColors.secondary }]}>{location.address}</Text>
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
          <Text style={[styles.sectionTitle, { color: textColors.primary }]}>{t('costEstimator')}</Text>
          <Text style={[styles.sectionSubtitle, { color: textColors.secondary }]}>{t('calculateExpenses')}</Text>
          
          <View style={[styles.estimatorCard, { 
            backgroundColor: currentColors.surface,
            ...Platform.select({
              ios: {
                shadowColor: themeMode === 'dark' ? '#000' : '#333',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: themeMode === 'dark' ? 0.4 : 0.1,
                shadowRadius: 5,
              },
              android: {
                elevation: 4,
              },
            }),
          }]}>
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: textColors.primary }]}>{t('selectLocation')}</Text>
              <View style={styles.selectContainer}>
                {MOCK_LOCATIONS.map(location => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.locationOption,
                      { 
                        backgroundColor: selectedLocation === location.id 
                          ? currentColors.primary 
                          : themeMode === 'dark' ? currentColors.surface : currentColors.background,
                        borderColor: selectedLocation === location.id 
                          ? currentColors.primary 
                          : currentColors.divider
                      }
                    ]}
                    onPress={() => setSelectedLocation(location.id)}
                  >
                    <Text 
                      style={[
                        styles.locationOptionText,
                        { 
                          color: selectedLocation === location.id 
                            ? themeMode === 'dark' ? currentColors.background : '#ffffff'
                            : textColors.primary 
                        }
                      ]}
                    >
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={[styles.durationContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: textColors.primary }]}>{t('hours')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.divider,
                    color: textColors.primary,
                    textAlign: isRTL ? 'right' : 'left'
                  }]}
                  keyboardType="numeric"
                  value={hours}
                  onChangeText={setHours}
                  placeholder="0"
                  placeholderTextColor={textColors.hint}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: textColors.primary }]}>{t('days')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.divider,
                    color: textColors.primary,
                    textAlign: isRTL ? 'right' : 'left'
                  }]}
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
                  placeholder="0"
                  placeholderTextColor={textColors.hint}
                />
              </View>
            </View>
            
            <ActionButton
              title={t('calculateCost')}
              onPress={calculateEstimatedCost}
              style={styles.calculateButton}
            />
            
            {estimatedCost !== null && (
              <View style={[styles.estimatedCostContainer, { backgroundColor: currentColors.primary + '15' }]}>
                <Text style={[styles.estimatedCostLabel, { color: textColors.secondary }]}>{t('estimatedCost')}</Text>
                <Text style={[styles.estimatedCostValue, { color: currentColors.accent }]}>LE {estimatedCost.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <Text style={[styles.sectionTitle, { color: textColors.primary }]}>{t('acceptedPayments')}</Text>
          <View style={styles.paymentMethodsContainer}>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>💳</Text>
              <Text style={[styles.paymentMethodText, { color: textColors.secondary }]}>{t('creditCard')}</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>🏦</Text>
              <Text style={[styles.paymentMethodText, { color: textColors.secondary }]}>{t('debitCard')}</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>📱</Text>
              <Text style={[styles.paymentMethodText, { color: textColors.secondary }]}>{t('mobilePay')}</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentMethodIcon}>💸</Text>
              <Text style={[styles.paymentMethodText, { color: textColors.secondary }]}>{t('cash')}</Text>
            </View>
          </View>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    width: '100%',
  },
  backButton: {
    width: 50,
  },
  backButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  introSection: {
    padding: 16,
    margin: 12,
    borderRadius: 8,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  locationSection: {
    marginVertical: 12,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationAddress: {
    fontSize: 14,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  estimatorSection: {
    padding: 16,
    marginTop: 16,
  },
  estimatorCard: {
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  formGroup: {
    marginBottom: 12,
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 45,
    borderRadius: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  locationOptionText: {
    fontSize: 14,
  },
  calculateButton: {
    marginVertical: 12,
  },
  estimatedCostContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  estimatedCostLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  estimatedCostValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  paymentMethodsSection: {
    padding: 16,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  paymentMethod: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PricesScreen; 