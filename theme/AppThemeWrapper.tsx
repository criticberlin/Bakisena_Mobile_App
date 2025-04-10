import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from './ThemeContext';

interface AppThemeWrapperProps extends ViewProps {
  children: React.ReactNode;
  containerType?: 'view' | 'screen' | 'surface' | 'card';
}

/**
 * A wrapper component that automatically applies the current theme styles to child components
 */
const AppThemeWrapper: React.FC<AppThemeWrapperProps> = ({
  children,
  containerType = 'view',
  style,
  ...props
}) => {
  const { colors, themeMode } = useTheme();
  
  // Determine the background color based on container type
  let backgroundColor;
  switch (containerType) {
    case 'screen':
      backgroundColor = colors.background;
      break;
    case 'surface':
      backgroundColor = colors.surface;
      break;
    case 'card':
      backgroundColor = themeMode === 'dark' ? colors.surface : colors.background;
      break;
    case 'view':
    default:
      backgroundColor = 'transparent';
  }
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add default styles here
  },
});

export default AppThemeWrapper; 