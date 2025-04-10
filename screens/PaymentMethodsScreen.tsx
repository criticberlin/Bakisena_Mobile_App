import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentMethods'>;

// Payment method type
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  name: string;
  details: string;
  isDefault: boolean;
}

// Sample payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa',
    details: '•••• •••• •••• 4242',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    name: 'Mastercard',
    details: '•••• •••• •••• 5678',
    isDefault: false,
  },
  {
    id: '3',
    type: 'paypal',
    name: 'PayPal',
    details: 'user@example.com',
    isDefault: false,
  },
];

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  
  const handleAddPaymentMethod = () => {
    // Navigate to add payment method screen - using Settings as a placeholder for now
    navigation.navigate('Settings');
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
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
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== id));
          },
          style: 'destructive',
        },
      ],
    );
  };
  
  const getPaymentMethodIcon = (type: string) => {
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
          backgroundColor: colors.surface,
          borderColor: item.isDefault ? colors.accent : 'transparent',
        }
      ]}>
        <View style={[
          styles.paymentInfo,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={[
            styles.paymentIcon,
            { backgroundColor: colors.accent + '20' }
          ]}>
            <Ionicons name={getPaymentMethodIcon(item.type)} size={24} color={colors.accent} />
          </View>
          <View style={[
            styles.paymentDetails,
            { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }
          ]}>
            <Text style={[
              styles.paymentName, 
              { 
                color: colors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.paymentNumber, 
              { 
                color: colors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left'
              }
            ]}>
              {item.details}
            </Text>
            {item.isDefault && (
              <View style={[
                styles.defaultBadge,
                { backgroundColor: colors.accent + '30' }
              ]}>
                <Text style={[
                  styles.defaultBadgeText,
                  { color: colors.accent }
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
              <Text style={[styles.actionButtonText, { color: colors.accent }]}>
                {t('setDefault')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeletePaymentMethod(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
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
          <Ionicons name={language === 'ar' ? "arrow-forward" : "arrow-back"} size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {t('paymentMethods')}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Ionicons name="add" size={24} color={colors.accent} />
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
          <Ionicons name="card-outline" size={80} color={colors.text.secondary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            {t('noPaymentMethods')}
          </Text>
          <TouchableOpacity 
            style={[styles.addPaymentButton, { backgroundColor: colors.accent }]}
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
});

export default PaymentMethodsScreen; 