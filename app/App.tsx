import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nManager } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from '../navigation/AppNavigator';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import AppThemeWrapper from '../theme/AppThemeWrapper';
import { LanguageProvider, useLanguage } from '../constants/translations/LanguageContext';
import { AuthProvider, useAuth } from '../components/AuthContext';
import { initializeAdminAccount } from '../services/auth';
import LoadingScreen from '../components/LoadingScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// AppContent component to be able to use the theme hook within provider
const AppContent = () => {
  const { themeMode, colors } = useTheme();
  const { isRTL } = useLanguage();
  const { user, loading, isAdmin } = useAuth();
  
  // Ensure RTL layout direction is set correctly
  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      // This will ensure RTL is applied consistently
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);
  
  useEffect(() => {
    // Hide the splash screen after auth loading is complete
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  useEffect(() => {
    // Initialize admin account when app starts and auth loading is done
    if (!loading) {
      initializeAdminAccount().then(({ error }) => {
        if (error) {
          console.error('Failed to initialize admin account:', error);
        } else {
          console.log('Admin account initialized successfully');
        }
      }).catch(error => {
        console.error('Error during admin initialization:', error);
      });
    }
  }, [loading]);

  // Create navigation theme
  const navigationTheme = {
    ...DefaultTheme,
    dark: themeMode === 'dark',
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.divider,
      notification: colors.accent,
    }
  };

  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
