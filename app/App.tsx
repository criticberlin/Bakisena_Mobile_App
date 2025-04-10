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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// AppContent component to be able to use the theme hook within provider
const AppContent = () => {
  const { themeMode, colors } = useTheme();
  const { isRTL } = useLanguage();
  
  // Ensure RTL layout direction is set correctly
  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      // This will ensure RTL is applied consistently
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);
  
  useEffect(() => {
    // Hide the splash screen after the app is ready
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    
    hideSplash();
  }, []);

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

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <AppThemeWrapper containerType="screen" style={{ flex: 1 }}>
        <AppNavigator />
      </AppThemeWrapper>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
