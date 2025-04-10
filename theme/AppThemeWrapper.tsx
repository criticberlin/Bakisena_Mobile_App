import React from 'react';
import { View, StyleSheet, ViewProps, Animated } from 'react-native';
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
  const { colors, themeMode, animatedColors } = useTheme();
  
  // Determine the background color based on container type
  let backgroundColor: string | Animated.AnimatedInterpolation<string>;
  switch (containerType) {
    case 'screen':
      backgroundColor = animatedColors.background;
      break;
    case 'surface':
      backgroundColor = animatedColors.surface;
      break;
    case 'card':
      backgroundColor = themeMode === 'dark' ? animatedColors.surface : animatedColors.background;
      break;
    case 'view':
    default:
      backgroundColor = 'transparent';
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppThemeWrapper; 