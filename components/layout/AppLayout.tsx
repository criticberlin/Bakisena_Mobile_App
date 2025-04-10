import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../constants/translations/LanguageContext';

interface AppLayoutProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  skipStatusBar?: boolean;
}

/**
 * AppLayout - A consistent layout wrapper to apply theme and RTL settings across screens
 * 
 * Use this component to wrap your screens to ensure consistent styling, RTL support,
 * and theme application across the entire app.
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children, style, skipStatusBar = false }) => {
  const { colors, themeMode } = useTheme();
  const { language } = useLanguage();
  
  const isRTL = language === 'ar';
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colors.background },
        isRTL && styles.rtlContainer, 
        style
      ]}
    >
      {!skipStatusBar && (
        <StatusBar
          barStyle={themeMode === 'dark' ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rtlContainer: {
    direction: 'rtl',
  },
});

export default AppLayout; 