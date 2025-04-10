import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Switch,
  Alert,
  I18nManager
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import ActionButton from '../components/ActionButton';
import { MOCK_USERS } from '../constants/mockData';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { themeMode, toggleTheme, colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  // Mock logged in user
  const [user] = useState(MOCK_USERS[0]);
  const [isLoading, setIsLoading] = useState(false);
  
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
            setIsLoading(true);
            // Simulate logout process
            setTimeout(() => {
              setIsLoading(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginOptions' }],
              });
            }, 1000);
          },
        },
      ],
    );
  };
  
  const handleLanguageChange = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    await setLanguage(newLanguage);
    
    // Notify user that app might need to restart for proper RTL layout
    if (I18nManager.isRTL !== (newLanguage === 'ar')) {
      // This reloads all navigation and screens, which will pick up the new language
      Alert.alert(
        t('languageChanged'),
        t('restartAppMessage'),
        [{ 
          text: t('ok'),
          onPress: () => {
            // This will cause all screens to re-render with the new language
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          }
        }]
      );
    }
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {t('account')}
          </Text>
        </View>
        
        {/* Profile Section */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.profileBlur}>
          <View style={[styles.profileContainer, { backgroundColor: colors.surface }]}>
            <Image 
              source={require('../assets/images/avatar-placeholder.png')} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text.primary }]}>
                {user.name}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>
                {user.email}
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={[styles.editButtonText, { color: colors.accent }]}>
                  {t('edit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
        
        {/* Menu Items */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.menuBlur}>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.menuItem, 
                  index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }
                ]}
                onPress={item.onPress}
              >
                <Ionicons name={item.icon as any} size={22} color={colors.accent} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
        
        {/* Theme and Language Settings */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.menuBlur}>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
            {/* Theme Toggle */}
            <View style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Ionicons name="moon-outline" size={22} color={colors.accent} />
              <Text style={[styles.menuItemText, { color: colors.text.primary }]}>
                {t('darkMode')}
              </Text>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: 'rgba(249, 178, 51, 0.4)' }}
                thumbColor={themeMode === 'dark' ? colors.accent : '#f4f3f4'}
              />
            </View>
            
            {/* Language Selection */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLanguageChange}
            >
              <Ionicons name="language-outline" size={22} color={colors.accent} />
              <Text style={[styles.menuItemText, { color: colors.text.primary }]}>
                {t('language')}
              </Text>
              <Text style={[styles.languageText, { color: colors.text.secondary }]}>
                {language === 'en' ? t('english') : t('arabic')}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
        
        {/* Logout Button */}
        <View style={styles.logoutButtonContainer}>
          <ActionButton
            title={t('logOut')}
            onPress={handleLogout}
            isLoading={isLoading}
            variant="outline"
            size="large"
          />
        </View>
      </ScrollView>
    </View>
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
    fontSize: 24,
    fontWeight: '700',
  },
  profileBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  profileContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  menuBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  menuContainer: {
    borderRadius: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  languageText: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButtonContainer: {
    marginVertical: 20,
  },
});

export default AccountScreen; 