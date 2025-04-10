import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  colors: typeof theme.colors;
  switchStyles: {
    trackColor: { false: string; true: string };
    thumbColor: (value: boolean) => string;
    ios_backgroundColor?: string;
  };
}

const ThemeContext = createContext<ThemeContextProps>({
  themeMode: 'dark',
  toggleTheme: () => {},
  colors: theme.colors,
  switchStyles: {
    trackColor: { false: '#767577', true: 'rgba(249, 178, 51, 0.4)' },
    thumbColor: (value) => value ? theme.colors.accent : '#f4f3f4',
  }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(deviceTheme === 'light' ? 'light' : 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeMode(savedTheme as ThemeMode);
        } else {
          // If no saved preference, use device theme
          setThemeMode(deviceTheme === 'light' ? 'light' : 'dark');
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

  // Toggle theme manually
  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
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

  // Switch styles based on theme
  const getSwitchStyles = () => {
    const activeTrackColor = themeMode === 'dark' 
      ? 'rgba(249, 178, 51, 0.5)' // Stronger accent track color for dark mode
      : 'rgba(249, 178, 51, 0.6)'; // Slightly more visible in light mode
    
    return {
      trackColor: { 
        false: themeMode === 'dark' ? '#3A3A5C' : '#DADADA', 
        true: activeTrackColor 
      },
      thumbColor: (value: boolean) => 
        value ? theme.colors.accent : themeMode === 'dark' ? '#FFFFFF' : '#F4F3F4',
      ios_backgroundColor: themeMode === 'dark' ? '#3A3A5C' : '#DADADA',
    };
  };

  const contextValue = {
    themeMode,
    toggleTheme,
    colors: getThemeColors(),
    switchStyles: getSwitchStyles(),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 