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
import AppLayout from '../components/layout/AppLayout';
import { Reservation } from '../types';
import { bookingService } from '../services/bookings';

type PastBookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PastBookings'>;

// Location cache for mockup - In a real app, we would fetch location details from Firebase
const locationCache: {[key: string]: string} = {};

// Vehicle cache for mockup - In a real app, we would fetch vehicle details from Firebase
const vehicleCache: {[key: string]: {plate: string, type: string}} = {};

const PastBookingsScreen: React.FC = () => {
  const navigation = useNavigation<PastBookingsScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const { t, language } = useLanguage();
  
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  
  // Load bookings based on active tab
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        let fetchedBookings: Reservation[] = [];
        
        if (activeTab === 'all') {
          fetchedBookings = await bookingService.getUserBookings();
        } else {
          fetchedBookings = await bookingService.getBookingsByStatus(
            activeTab.toUpperCase() as 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
          );
        }
        
        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
        Alert.alert(t('error'), String(error));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [activeTab]);
  
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
        return currentColors.text.secondary;
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
  
  const getLocationName = (locationId: string) => {
    // In a real app, this would fetch location details from Firestore
    // For this example, we'll use a simple cache
    if (!locationCache[locationId]) {
      locationCache[locationId] = `Location ${locationId.substring(0, 4)}`;
    }
    return locationCache[locationId];
  };
  
  const getVehicleDetails = (vehicleId: string) => {
    // In a real app, this would fetch vehicle details from Firestore
    // For this example, we'll use a simple cache
    if (!vehicleCache[vehicleId]) {
      vehicleCache[vehicleId] = {
        plate: `${vehicleId.substring(0, 3)} ${vehicleId.substring(3, 7)}`,
        type: 'CAR'
      };
    }
    return vehicleCache[vehicleId];
  };
  
  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      t('cancelBooking'),
      t('cancelBookingConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('confirm'), 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await bookingService.cancelBooking(bookingId);
              
              // Update the booking in the local state
              setBookings(prevBookings => 
                prevBookings.map(booking => 
                  booking.id === bookingId 
                    ? { ...booking, status: 'CANCELLED', paymentStatus: 'REFUNDED' } 
                    : booking
                )
              );
              
              setLoading(false);
              Alert.alert(t('success'), t('bookingCancelled'));
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert(t('error'), String(error));
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Reservation }) => (
    <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.bookingBlur}>
      <TouchableOpacity 
        style={[
          styles.bookingItem, 
          { backgroundColor: currentColors.surface }
        ]}
        activeOpacity={0.7}
        onPress={() => {
          // Navigate to booking details
          Alert.alert(
            t('bookingDetails'),
            t('notImplemented'),
            [{ text: t('ok') }]
          );
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
                color: currentColors.text.primary,
                textAlign: language === 'ar' ? 'right' : 'left' 
              }
            ]}>
              {getLocationName(item.locationId)}
            </Text>
            <Text style={[
              styles.bookingId, 
              { 
                color: currentColors.text.secondary,
                textAlign: language === 'ar' ? 'right' : 'left' 
              }
            ]}>
              {t('bookingId')}: #{item.id.substring(0, 8)}
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
            <Ionicons name="calendar-outline" size={18} color={currentColors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
              {formatDate(item.startTime)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color={currentColors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.bookingDetails,
          { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
        ]}>
          <View style={styles.detailItem}>
            <Ionicons name="car-outline" size={18} color={currentColors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
              {getVehicleDetails(item.vehicleId).plate}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={18} color={currentColors.accent} style={styles.detailIcon} />
            <Text style={[styles.detailText, { color: currentColors.text.secondary }]}>
              LE {item.totalCost.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.bookingFooter,
          { borderTopColor: currentColors.divider }
        ]}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
            ]}
            onPress={() => {
              Alert.alert(
                t('receipt'),
                t('notImplemented'),
                [{ text: t('ok') }]
              );
            }}
          >
            <Ionicons 
              name="receipt-outline" 
              size={16} 
              color={currentColors.accent} 
              style={language === 'ar' ? { marginLeft: 6 } : { marginRight: 6 }}
            />
            <Text style={[styles.actionText, { color: currentColors.accent }]}>
              {t('receipt')}
            </Text>
          </TouchableOpacity>
          
          {item.status === 'ACTIVE' && (
            <TouchableOpacity 
              style={[
                styles.actionButton,
                { flexDirection: language === 'ar' ? 'row-reverse' : 'row' }
              ]}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Ionicons 
                name="close-circle-outline" 
                size={16} 
                color={currentColors.error} 
                style={language === 'ar' ? { marginLeft: 6 } : { marginRight: 6 }}
              />
              <Text style={[styles.actionText, { color: currentColors.error }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
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
          <Ionicons name={language === 'ar' ? "arrow-forward" : "arrow-back"} size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
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
            activeTab === 'all' && [styles.activeTab, { borderBottomColor: currentColors.accent }]
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'all' ? currentColors.accent : currentColors.text.secondary }
            ]}
          >
            {t('all')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'active' && [styles.activeTab, { borderBottomColor: currentColors.accent }]
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'active' ? currentColors.accent : currentColors.text.secondary }
            ]}
          >
            {t('active')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'completed' && [styles.activeTab, { borderBottomColor: currentColors.accent }]
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'completed' ? currentColors.accent : currentColors.text.secondary }
            ]}
          >
            {t('completed')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'cancelled' && [styles.activeTab, { borderBottomColor: currentColors.accent }]
          ]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'cancelled' ? currentColors.accent : currentColors.text.secondary }
            ]}
          >
            {t('cancelled')}
          </Text>
        </TouchableOpacity>
      </View>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={currentColors.text.secondary} />
          <Text style={[styles.emptyText, { color: currentColors.text.secondary }]}>
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

export default PastBookingsScreen; 