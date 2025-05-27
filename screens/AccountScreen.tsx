import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Switch,
  Alert,
  I18nManager,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import ActionButton from '../components/ActionButton';
import { useAuth } from '../components/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import { userService } from '../services/user';
import { User } from '../types';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { themeMode, colors, toggleTheme, switchStyles } = useTheme();
  const { t } = useLanguage();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const profile = await userService.getCurrentUserProfile();
        setUserData(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      t('logOut'),
      t('confirmLogout'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logOut'),
          onPress: () => {
            logout();
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: t('profile'),
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'car-outline',
      title: t('myVehicles'),
      onPress: () => navigation.navigate('MyVehicles'),
    },
    {
      icon: 'calendar-outline',
      title: t('myBookings'),
      onPress: () => navigation.navigate('PastBookings'),
    },
    {
      icon: 'card-outline',
      title: t('paymentMethods'),
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      icon: 'settings-outline',
      title: t('settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'information-circle-outline',
      title: t('about'),
      onPress: () => navigation.navigate('About'),
    },
  ];

  if (!user) {
    return null;
  }

  if (loading || authLoading) {
    return (
      <AppLayout
        statusBarStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={{ color: currentColors.text.primary, marginTop: 12 }}>
            {t('loading')}
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      statusBarStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: 'transparent' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.text.primary }]}>
            {t('account')}
          </Text>
        </View>
        
        {/* Profile Section */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.profileBlur}>
          <View style={[styles.profileContainer, { backgroundColor: currentColors.surface }]}>
            {userData?.profileImage ? (
              <Image 
                source={{ uri: userData.profileImage }} 
                style={styles.avatar}
              />
            ) : (
              <Image 
                source={require('../assets/images/avatar-placeholder.png')} 
                style={styles.avatar}
              />
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: currentColors.text.primary }]}>
                {userData?.name || userData?.email}
              </Text>
              <Text style={[styles.profileEmail, { color: currentColors.text.secondary }]}>
                {userData?.email}
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={[styles.editButtonText, { color: currentColors.accent }]}>
                  {t('edit')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editButton, { marginTop: 12 }]}
                onPress={handleLogout}
              >
                <Text style={[styles.editButtonText, { color: currentColors.error || '#d00' }]}>
                  {t('logOut')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
        
        {/* Menu Items */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.menuBlur}>
          <View style={[styles.menuContainer, { backgroundColor: currentColors.surface }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.menuItem, 
                  index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: currentColors.divider }
                ]}
                onPress={item.onPress}
              >
                <Ionicons name={item.icon as any} size={22} color={currentColors.accent} />
                <Text style={[styles.menuItemText, { color: currentColors.text.primary }]}>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={currentColors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
        
        {/* Theme and Language Settings */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.menuBlur}>
          <View style={[styles.menuContainer, { backgroundColor: currentColors.surface }]}>
            {/* Theme Toggle */}
            <View style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: currentColors.divider }]}>
              <Ionicons name="moon-outline" size={22} color={currentColors.accent} />
              <Text style={[styles.menuItemText, { color: currentColors.text.primary }]}>
                {t('darkMode')}
              </Text>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={switchStyles.trackColor}
                thumbColor={switchStyles.thumbColor(themeMode === 'dark')}
                ios_backgroundColor={switchStyles.ios_backgroundColor}
              />
            </View>
            
            {/* Language Selection */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                // Navigate to settings screen where language can be changed
                navigation.navigate('Settings');
              }}
            >
              <Ionicons name="language-outline" size={22} color={currentColors.accent} />
              <Text style={[styles.menuItemText, { color: currentColors.text.primary }]}>
                {t('language')}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={currentColors.text.secondary} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  profileContainer: {
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default AccountScreen; 