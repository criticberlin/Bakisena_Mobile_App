import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { paymentService, PaymentMethod } from '../services/payments';
import AppLayout from '../components/layout/AppLayout';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentMethods'>;

// Type for Ionicons names
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const { t, language } = useLanguage();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const methods = await paymentService.getUserPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        Alert.alert(t('error'), String(error));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, []);
  
  const handleAddPaymentMethod = () => {
    // In a real implementation, this would navigate to an add payment method form
    Alert.alert(
      t('addPaymentMethod'),
      t('notImplemented'),
      [{ text: t('ok') }]
    );
  };
  
  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      await paymentService.setDefaultPaymentMethod(id);
      
      // Update the local state to reflect the change
      setPaymentMethods(methods => 
        methods.map(method => ({
          ...method,
          isDefault: method.id === id
        }))
      );
      
      setLoading(false);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      Alert.alert(t('error'), String(error));
      setLoading(false);
    }
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    // Check if trying to delete the default payment method
    const isDefault = paymentMethods.find(method => method.id === id)?.isDefault;
    
    if (isDefault) {
      Alert.alert(
        t('cannotDelete'),
        t('cannotDeleteDefaultPayment'),
        [{ text: t('ok') }]
      );
      return;
    }
    
    Alert.alert(
      t('deletePaymentMethod'),
      t('deletePaymentMethodConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          onPress: async () => {
            try {
              setLoading(true);
              await paymentService.deletePaymentMethod(id);
              setPaymentMethods(methods => methods.filter(method => method.id !== id));
              setLoading(false);
            } catch (error) {
              console.error('Error deleting payment method:', error);
              Alert.alert(t('error'), String(error));
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };
  
  const getPaymentMethodIcon = (type: string): string => {
    switch (type) {
      case 'card':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'applepay':
        return 'logo-apple';
      case 'googlepay':
        return 'logo-google';
      default:
        return 'card-outline';
    }
  };

  const renderPaymentMethodItem = ({ item }: { item: PaymentMethod }) => (
    <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.paymentItemBlur}>
      <View style={[
        styles.paymentItem, 
        { 
          backgroundColor: currentColors.surface,
          borderColor: item.isDefault ? currentColors.accent : 'transparent',
        }
      ]}>
        <View style={[
          styles.paymentInfo,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={[
            styles.paymentIcon,
            { backgroundColor: currentColors.accent + '20' }
          ]}>
            <Ionicons 
              name={getPaymentMethodIcon(item.type) as IconName} 
              size={24} 
              color={currentColors.accent} 
            />
          </View>
          <View style={[
            styles.paymentDetails,
            { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }
          ]}>
            <Text style={[
              styles.paymentName, 
              { 
                color: currentColors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.paymentNumber, 
              { 
                color: currentColors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.details}
            </Text>
            {item.isDefault && (
              <View style={[
                styles.defaultBadge,
                { backgroundColor: currentColors.accent + '30' }
              ]}>
                <Text style={[
                  styles.defaultBadgeText,
                  { color: currentColors.accent }
                ]}>
                  {t('default')}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={[
          styles.paymentActions,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          {!item.isDefault && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSetDefault(item.id)}
            >
              <Text style={[styles.actionButtonText, { color: currentColors.accent }]}>
                {t('setDefault')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeletePaymentMethod(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={currentColors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );

  if (loading) {
    return (
      <AppLayout>
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
    <View style={[
      styles.container, 
      { 
        backgroundColor: currentColors.background,
      }
    ]}>
      {/* Header */}
      <View style={[
        styles.header, 
        { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name={(language === 'ar' ? "arrow-forward" : "arrow-back") as IconName} size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          {t('paymentMethods')}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Ionicons name="add" size={24} color={currentColors.accent} />
        </TouchableOpacity>
      </View>

      {paymentMethods.length > 0 ? (
        <FlatList
          data={paymentMethods}
          renderItem={renderPaymentMethodItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.paymentList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name={"card-outline" as IconName} size={80} color={currentColors.text.secondary} />
          <Text style={[styles.emptyText, { color: currentColors.text.secondary }]}>
            {t('noPaymentMethods')}
          </Text>
          <TouchableOpacity 
            style={[styles.addPaymentButton, { backgroundColor: currentColors.accent }]}
            onPress={handleAddPaymentMethod}
          >
            <Text style={styles.addPaymentButtonText}>
              {t('addPaymentMethod')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  paymentItemBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  paymentItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 16,
    marginBottom: 6,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addPaymentButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addPaymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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

export default PaymentMethodsScreen; 