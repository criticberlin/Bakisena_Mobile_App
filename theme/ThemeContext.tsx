import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  colors: typeof theme.colors;
  animatedColors: {
    background: Animated.AnimatedInterpolation<string>;
    surface: Animated.AnimatedInterpolation<string>;
    primary: Animated.AnimatedInterpolation<string>;
    secondary: Animated.AnimatedInterpolation<string>;
    accent: Animated.AnimatedInterpolation<string>;
    error: Animated.AnimatedInterpolation<string>;
    text: {
      primary: Animated.AnimatedInterpolation<string>;
      secondary: Animated.AnimatedInterpolation<string>;
      disabled: Animated.AnimatedInterpolation<string>;
      hint: Animated.AnimatedInterpolation<string>;
    };
    divider: Animated.AnimatedInterpolation<string>;
  };
  switchStyles: {
    trackColor: { false: string; true: string };
    thumbColor: (value: boolean) => string;
    ios_backgroundColor?: string;
  };
  // Add these global style getters
  getTextStyle: (additionalStyles?: any) => any;
  getViewStyle: (additionalStyles?: any) => any;
  getInputStyle: (additionalStyles?: any) => any;
  getButtonStyle: (additionalStyles?: any) => any;
  getImageStyle: (additionalStyles?: any) => any;
}

// Initial animated values
const initialAnimatedValues = {
  background: new Animated.Value(0),
  surface: new Animated.Value(0),
  primary: new Animated.Value(0),
  secondary: new Animated.Value(0),
  accent: new Animated.Value(0),
  error: new Animated.Value(0),
  text: {
    primary: new Animated.Value(0),
    secondary: new Animated.Value(0),
    disabled: new Animated.Value(0),
    hint: new Animated.Value(0),
  },
  divider: new Animated.Value(0),
};

const ThemeContext = createContext<ThemeContextProps>({
  themeMode: 'dark',
  toggleTheme: () => {},
  colors: theme.colors,
  animatedColors: initialAnimatedValues,
  switchStyles: {
    trackColor: { false: '#767577', true: 'rgba(249, 178, 51, 0.4)' },
    thumbColor: (value) => value ? theme.colors.accent : '#f4f3f4',
  },
  getTextStyle: () => ({}),
  getViewStyle: () => ({}),
  getInputStyle: () => ({}),
  getButtonStyle: () => ({}),
  getImageStyle: () => ({}),
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(deviceTheme === 'light' ? 'light' : 'dark');
  const [isLoading, setIsLoading] = useState(true);
  
  // Animated values for smooth transitions
  const [animatedValues] = useState({
    background: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    surface: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    primary: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    secondary: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    accent: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    error: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    text: {
      primary: new Animated.Value(themeMode === 'dark' ? 1 : 0),
      secondary: new Animated.Value(themeMode === 'dark' ? 1 : 0),
      disabled: new Animated.Value(themeMode === 'dark' ? 1 : 0),
      hint: new Animated.Value(themeMode === 'dark' ? 1 : 0),
    },
    divider: new Animated.Value(themeMode === 'dark' ? 1 : 0),
  });

  // Load saved theme preference on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeMode(savedTheme as ThemeMode);
          // Update animated values
          const value = savedTheme === 'dark' ? 1 : 0;
          animatedValues.background.setValue(value);
          animatedValues.surface.setValue(value);
          animatedValues.primary.setValue(value);
          animatedValues.secondary.setValue(value);
          animatedValues.accent.setValue(value);
          animatedValues.error.setValue(value);
          animatedValues.text.primary.setValue(value);
          animatedValues.text.secondary.setValue(value);
          animatedValues.text.disabled.setValue(value);
          animatedValues.text.hint.setValue(value);
          animatedValues.divider.setValue(value);
        } else {
          // If no saved preference, use device theme
          setThemeMode(deviceTheme === 'light' ? 'light' : 'dark');
          // Update animated values
          const value = deviceTheme === 'dark' ? 1 : 0;
          animatedValues.background.setValue(value);
          animatedValues.surface.setValue(value);
          animatedValues.primary.setValue(value);
          animatedValues.secondary.setValue(value);
          animatedValues.accent.setValue(value);
          animatedValues.error.setValue(value);
          animatedValues.text.primary.setValue(value);
          animatedValues.text.secondary.setValue(value);
          animatedValues.text.disabled.setValue(value);
          animatedValues.text.hint.setValue(value);
          animatedValues.divider.setValue(value);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // Fallback to device theme
        setThemeMode(deviceTheme === 'light' ? 'light' : 'dark');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, [deviceTheme]);

  // Save theme preference whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem('themeMode', themeMode);
        } catch (error) {
          console.error('Failed to save theme preference:', error);
        }
      };
      
      saveTheme();
    }
  }, [themeMode, isLoading]);

  // Toggle theme manually with animation
  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    const toValue = newMode === 'dark' ? 1 : 0;
    
    // Create animation sequence for smooth transition
    Animated.parallel([
      Animated.timing(animatedValues.background, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.surface, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.primary, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.secondary, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.accent, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.error, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.text.primary, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.text.secondary, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.text.disabled, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.text.hint, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.divider, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    
    setThemeMode(newMode);
  };

  // Get the current theme colors based on mode
  const getThemeColors = () => {
    if (themeMode === 'light') {
      return {
        ...theme.colors,
        primary: theme.colors.light.primary,
        secondary: theme.colors.light.secondary,
        accent: theme.colors.accent,
        background: theme.colors.light.background,
        surface: theme.colors.light.surface,
        text: theme.colors.light.text,
        divider: theme.colors.light.divider,
        error: theme.colors.light.error,
      };
    }
    return {
      ...theme.colors,
      primary: theme.colors.dark.primary,
      secondary: theme.colors.dark.secondary,
      accent: theme.colors.accent,
      background: theme.colors.dark.background,
      surface: theme.colors.dark.surface,
      text: theme.colors.dark.text,
      divider: theme.colors.dark.divider,
      error: theme.colors.dark.error,
    };
  };

  // Get animated colors for smooth transitions
  const getAnimatedColors = () => {
    return {
      background: animatedValues.background.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.light.background, theme.colors.dark.background],
      }),
      surface: animatedValues.surface.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.light.surface, theme.colors.dark.surface],
      }),
      primary: animatedValues.primary.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.light.primary, theme.colors.dark.primary],
      }),
      secondary: animatedValues.secondary.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.light.secondary, theme.colors.dark.secondary],
      }),
      accent: animatedValues.accent.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.accent, theme.colors.accent],
      }),
      error: animatedValues.error.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.light.error, theme.colors.dark.error],
      }),
      text: {
        primary: animatedValues.text.primary.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.light.text.primary, theme.colors.dark.text.primary],
        }),
        secondary: animatedValues.text.secondary.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.light.text.secondary, theme.colors.dark.text.secondary],
        }),
        disabled: animatedValues.text.disabled.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.light.text.disabled, theme.colors.dark.text.disabled],
        }),
        hint: animatedValues.text.hint.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.light.text.hint, theme.colors.dark.text.hint],
        }),
      },
      divider: animatedValues.divider.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.light.divider, theme.colors.dark.divider],
      }),
    };
  };

  // Get Switch styles based on theme
  const getSwitchStyles = () => {
    return {
      trackColor: { 
        false: themeMode === 'dark' ? '#3D3D6B' : '#E8E8F0', 
        true: themeMode === 'dark' ? 'rgba(255, 157, 0, 0.4)' : 'rgba(255, 157, 0, 0.4)'
      },
      thumbColor: (value: boolean) => 
        value 
          ? theme.colors.accent 
          : themeMode === 'dark' ? '#8E8E9F' : '#DADAE8',
      ios_backgroundColor: themeMode === 'dark' ? '#3D3D6B' : '#E8E8F0',
    };
  };

  // Global style helpers
  const colors = getThemeColors();
  
  // Text style getter
  const getTextStyle = (additionalStyles = {}) => {
    return {
      color: colors.text.primary,
      ...additionalStyles,
    };
  };
  
  // View style getter
  const getViewStyle = (additionalStyles = {}) => {
    return {
      backgroundColor: 'transparent',
      ...additionalStyles,
    };
  };
  
  // Input style getter
  const getInputStyle = (additionalStyles = {}) => {
    return {
      color: colors.text.primary,
      backgroundColor: colors.surface,
      borderColor: colors.divider,
      placeholderTextColor: colors.text.hint,
      ...additionalStyles,
    };
  };
  
  // Button style getter
  const getButtonStyle = (additionalStyles = {}) => {
    return {
      backgroundColor: colors.accent,
      ...additionalStyles,
    };
  };
  
  // Image style getter
  const getImageStyle = (additionalStyles = {}) => {
    return {
      ...additionalStyles,
    };
  };

  const contextValue = {
    themeMode,
    toggleTheme,
    colors: getThemeColors(),
    animatedColors: getAnimatedColors(),
    switchStyles: getSwitchStyles(),
    getTextStyle,
    getViewStyle,
    getInputStyle,
    getButtonStyle,
    getImageStyle,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 