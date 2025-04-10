import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import { Reservation } from '../types';

type PastBookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PastBookings'>;

// Mock data for bookings
const mockBookings: Reservation[] = [
  {
    id: '1',
    userId: 'user1',
    slotId: 'slot1',
    locationId: 'loc1',
    vehicleId: 'vehicle1',
    startTime: '2023-05-10T09:00:00',
    endTime: '2023-05-10T12:00:00',
    status: 'COMPLETED',
    totalCost: 15,
    paymentStatus: 'PAID',
  },
  {
    id: '2',
    userId: 'user1',
    slotId: 'slot2',
    locationId: 'loc2',
    vehicleId: 'vehicle1',
    startTime: '2023-05-12T14:00:00',
    endTime: '2023-05-12T16:00:00',
    status: 'COMPLETED',
    totalCost: 10,
    paymentStatus: 'PAID',
  },
  {
    id: '3',
    userId: 'user1',
    slotId: 'slot3',
    locationId: 'loc1',
    vehicleId: 'vehicle2',
    startTime: '2023-05-15T10:00:00',
    endTime: '2023-05-15T14:00:00',
    status: 'COMPLETED',
    totalCost: 20,
    paymentStatus: 'PAID',
  },
  {
    id: '4',
    userId: 'user1',
    slotId: 'slot1',
    locationId: 'loc3',
    vehicleId: 'vehicle1',
    startTime: '2023-05-20T09:00:00',
    endTime: '2023-05-20T13:00:00',
    status: 'ACTIVE',
    totalCost: 20,
    paymentStatus: 'PAID',
  },
  {
    id: '5',
    userId: 'user1',
    slotId: 'slot4',
    locationId: 'loc2',
    vehicleId: 'vehicle2',
    startTime: '2023-05-25T15:00:00',
    endTime: '2023-05-25T17:00:00',
    status: 'CANCELLED',
    totalCost: 10,
    paymentStatus: 'REFUNDED',
  },
];

// Location names for mockup
const locationNames: {[key: string]: string} = {
  'loc1': 'City Center Parking',
  'loc2': 'Mall Parking Complex',
  'loc3': 'Downtown Parking Zone',
};

// Vehicle details for mockup
const vehicleDetails: {[key: string]: {plate: string, type: string}} = {
  'vehicle1': { plate: 'ABC 1234', type: 'CAR' },
  'vehicle2': { plate: 'XYZ 5678', type: 'CAR' },
};

const PastBookingsScreen: React.FC = () => {
  const navigation = useNavigation<PastBookingsScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage();
  
  const [bookings, setBookings] = useState<Reservation[]>(mockBookings);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  
  const getFilteredBookings = () => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(booking => 
      activeTab === 'active' ? booking.status === 'ACTIVE' :
      activeTab === 'completed' ? booking.status === 'COMPLETED' :
      booking.status === 'CANCELLED'
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#52C41A'; // Green for active
      case 'COMPLETED':
        return '#1890FF'; // Blue for completed
      case 'CANCELLED':
        return '#FF4D4F'; // Red for cancelled
      default:
        return colors.text.secondary;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return t('active');
      case 'COMPLETED':
        return t('completed');
      case 'CANCELLED':
        return t('cancelled');
      default:
        return status;
    }
  };

  const renderBookingItem = ({ item }: { item: Reservation }) => (
    <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.bookingBlur}>
      <TouchableOpacity 
        style={[
          styles.bookingItem, 
          { backgroundColor: colors.surface }
        ]}
        activeOpacity={0.7}
        onPress={() => {
          // Navigate to booking details
          // Using settings as a placeholder
          navigation.navigate('Settings');
        }}
      >
        <View style={[
          styles.bookingHeader,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={[
            styles.locationContainer,
            { alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }
          ]}>
            <Text style={[
              styles.locationName, 
              { 
                color: colors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left' 
              }
            ]}>
              {locationNames[item.locationId] || 'Unknown Location'}
            </Text>
            <Text style={[
              styles.bookingId, 
              { 
                color: colors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left' 
              }
            ]}>
              {t('bookingId')}: #{item.id}
            </Text>
          </View>
          <View style={[
            styles.statusContainer,
            { backgroundColor: `${getStatusColor(item.status)}30` }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.bookingDetails,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color={colors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {formatDate(item.startTime)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color={colors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.bookingDetails,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={styles.detailItem}>
            <Ionicons name="car-outline" size={18} color={colors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              {vehicleDetails[item.vehicleId]?.plate || 'Unknown Vehicle'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={18} color={colors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: colors.text.secondary }]}>
              LE {item.totalCost.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.bookingFooter,
          { borderTopColor: colors.divider }
        ]}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
            ]}
          >
            <Ionicons 
              name="receipt-outline" 
              size={16} 
              color={colors.accent} 
              style={language === 'ar' ? { marginLeft: 6 } : { marginRight: 6 }}
            />
            <Text style={[styles.actionText, { color: colors.accent }]}>
              {t('receipt')}
            </Text>
          </TouchableOpacity>
          
          {item.status === 'ACTIVE' && (
            <TouchableOpacity 
              style={[
                styles.actionButton,
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
            >
              <Ionicons 
                name="close-circle-outline" 
                size={16} 
                color={colors.error} 
                style={language === 'ar' ? { marginLeft: 6 } : { marginRight: 6 }}
              />
              <Text style={[styles.actionText, { color: colors.error }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <AppLayout>
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
          {t('myBookings')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[
        styles.tabsContainer,
        { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'all' && [styles.activeTab, { borderBottomColor: colors.accent }]
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'all' ? colors.accent : colors.text.secondary }
            ]}
          >
            {t('all')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'active' && [styles.activeTab, { borderBottomColor: colors.accent }]
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'active' ? colors.accent : colors.text.secondary }
            ]}
          >
            {t('active')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'completed' && [styles.activeTab, { borderBottomColor: colors.accent }]
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'completed' ? colors.accent : colors.text.secondary }
            ]}
          >
            {t('completed')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'cancelled' && [styles.activeTab, { borderBottomColor: colors.accent }]
          ]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'cancelled' ? colors.accent : colors.text.secondary }
            ]}
          >
            {t('cancelled')}
          </Text>
        </TouchableOpacity>
      </View>

      {getFilteredBookings().length > 0 ? (
        <FlatList
          data={getFilteredBookings()}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={colors.text.secondary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            {t('noBookings')}
          </Text>
        </View>
      )}
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookingsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bookingBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  bookingItem: {
    borderRadius: 16,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 12,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
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
  },
});

export default PastBookingsScreen; 