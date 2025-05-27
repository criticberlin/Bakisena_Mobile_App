import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  I18nManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import RTLWrapper from '../components/layout/RTLWrapper';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { themeMode, colors, toggleTheme, switchStyles } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    await setLanguage(newLanguage);
    
    // Notify user that app might need to restart for proper RTL layout
    if (I18nManager.isRTL !== (newLanguage === 'ar')) {
      Alert.alert(
        t('languageChanged'),
        t('restartAppMessage'),
        [{ text: t('ok') }]
      );
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <RTLWrapper style={styles.header} ignoreArabic={true}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          {t('settings')}
        </Text>
        <View style={{ width: 24 }} />
      </RTLWrapper>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Settings Section */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          {t('appSettings')}
        </Text>
        
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.settingsBlur}>
          <View style={[styles.settingsContainer, { backgroundColor: currentColors.surface }]}>
            {/* Theme Toggle */}
            <RTLWrapper style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: currentColors.divider }]} ignoreArabic={true}>
              <Ionicons name="moon-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('darkMode')}
                </Text>
                <Text style={[styles.settingDescription, { color: currentColors.text.secondary }]}>
                  {themeMode === 'dark' ? t('darkModeEnabled') : t('lightModeEnabled')}
                </Text>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={switchStyles.trackColor}
                thumbColor={switchStyles.thumbColor(themeMode === 'dark')}
                ios_backgroundColor={switchStyles.ios_backgroundColor}
              />
            </RTLWrapper>
            
            {/* Language Selection */}
            <RTLWrapper style={styles.settingItem} ignoreArabic={true}>
              <Ionicons name="language-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('language')}
                </Text>
                <Text style={[styles.settingDescription, { color: currentColors.text.secondary }]}>
                  {language === 'en' ? t('english') : t('arabic')}
                </Text>
              </View>
              <TouchableOpacity onPress={handleLanguageChange}>
                <Ionicons name="chevron-forward" size={20} color={currentColors.text.secondary} />
              </TouchableOpacity>
            </RTLWrapper>
          </View>
        </BlurView>
        
        {/* Notifications Section */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary, marginTop: 24 }]}>
          {t('notifications')}
        </Text>
        
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.settingsBlur}>
          <View style={[styles.settingsContainer, { backgroundColor: currentColors.surface }]}>
            {/* Push Notifications */}
            <RTLWrapper style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: currentColors.divider }]} ignoreArabic={true}>
              <Ionicons name="notifications-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('pushNotifications')}
                </Text>
                <Text style={[styles.settingDescription, { color: currentColors.text.secondary }]}>
                  {t('notificationsDescription')}
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={switchStyles.trackColor}
                thumbColor={switchStyles.thumbColor(true)}
                ios_backgroundColor={switchStyles.ios_backgroundColor}
              />
            </RTLWrapper>
            
            {/* Email Notifications */}
            <RTLWrapper style={styles.settingItem} ignoreArabic={true}>
              <Ionicons name="mail-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('emailNotifications')}
                </Text>
                <Text style={[styles.settingDescription, { color: currentColors.text.secondary }]}>
                  {t('emailNotificationsDescription')}
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={switchStyles.trackColor}
                thumbColor={switchStyles.thumbColor(true)}
                ios_backgroundColor={switchStyles.ios_backgroundColor}
              />
            </RTLWrapper>
          </View>
        </BlurView>
        
        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary, marginTop: 24 }]}>
          {t('aboutApp')}
        </Text>
        
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.settingsBlur}>
          <View style={[styles.settingsContainer, { backgroundColor: currentColors.surface }]}>
            {/* App Version */}
            <RTLWrapper style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: currentColors.divider }]} ignoreArabic={true}>
              <Ionicons name="information-circle-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('version')}
                </Text>
                <Text style={[styles.settingDescription, { color: currentColors.text.secondary }]}>
                  1.0.0
                </Text>
              </View>
            </RTLWrapper>
            
            {/* Terms and Privacy */}
            <RTLWrapper style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: currentColors.divider }]} ignoreArabic={true}>
              <Ionicons name="document-text-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('termsOfService')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={currentColors.text.secondary} />
            </RTLWrapper>
            
            {/* Privacy Policy */}
            <RTLWrapper style={styles.settingItem} ignoreArabic={true}>
              <Ionicons name="shield-checkmark-outline" size={22} color={currentColors.accent} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: currentColors.text.primary }]}>
                  {t('privacyPolicy')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={currentColors.text.secondary} />
            </RTLWrapper>
          </View>
        </BlurView>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsBlur: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  settingsContainer: {
    borderRadius: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
});

export default SettingsScreen; 