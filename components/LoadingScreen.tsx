import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppTextWrapper } from '../theme';

interface LoadingScreenProps {
  message?: string;
  textKey?: string;
  fullScreen?: boolean;
}

const { width, height } = Dimensions.get('window');

/**
 * A theme-aware loading screen component that can be used throughout the app
 * 
 * @param message - Optional text message to display under the spinner
 * @param textKey - Optional translation key for the message
 * @param fullScreen - Whether to display as a full-screen overlay or inline
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message,
  textKey,
  fullScreen = true
}) => {
  const { themeMode, colors } = useTheme();
  
  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  return (
    <View 
      style={[
        styles.container, 
        fullScreen && styles.fullScreen,
        { backgroundColor: currentColors.background }
      ]}
    >
      {fullScreen && (
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={currentColors.background}
          translucent
        />
      )}
      
      <View style={styles.content}>
        <ActivityIndicator 
          size="large" 
          color={currentColors.accent}
          style={styles.spinner}
        />
        
        {(message || textKey) && (
          <AppTextWrapper 
            variant="body" 
            style={[styles.message, { color: currentColors.text.secondary }]}
            textKey={textKey as any}
          >
            {message}
          </AppTextWrapper>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  }
});

export default LoadingScreen; 