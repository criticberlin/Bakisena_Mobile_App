import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ActionButton from '../components/ActionButton';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import RTLWrapper from '../components/layout/RTLWrapper';

type LoginOptionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginOptions'>;

const LoginOptionsScreen: React.FC = () => {
  const navigation = useNavigation<LoginOptionsScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <AppLayout scrollable={true} containerType="screen" paddingHorizontal={24}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Logo_With_Border.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t('readyToGetStarted')}</Text>
          <Text style={[styles.subtitle, { color: currentColors.text.secondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('createAccountDescription')}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <ActionButton
            title={t('login')}
            onPress={handleLogin}
            style={styles.button}
          />
          
          <ActionButton
            title={t('register')}
            onPress={handleRegister}
            variant="outline"
            style={styles.button}
          />
          
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: currentColors.accent }]}>{t('skipAsGuest')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 24,
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    marginBottom: 16,
    height: 54,
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginOptionsScreen; 