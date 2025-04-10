import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import theme from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  colors: typeof theme.colors;
}

const ThemeContext = createContext<ThemeContextProps>({
  themeMode: 'dark',
  toggleTheme: () => {},
  colors: theme.colors
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(deviceTheme === 'light' ? 'light' : 'dark');

  // Update theme when device theme changes
  useEffect(() => {
    setThemeMode(deviceTheme === 'light' ? 'light' : 'dark');
  }, [deviceTheme]);

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
      };
    }
    return theme.colors;
  };

  const contextValue = {
    themeMode,
    toggleTheme,
    colors: getThemeColors(),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 