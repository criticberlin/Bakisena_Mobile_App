import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Platform
} from 'react-native';

/**
 * TouchableWrapper is a wrapper around TouchableOpacity that
 * improves responsiveness on all platforms and eliminates the common
 * touch delay issues, especially on Android devices.
 */
interface TouchableWrapperProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

const TouchableWrapper: React.FC<TouchableWrapperProps> = ({
  children,
  activeOpacity = 0.7,
  delayPressIn = 0,
  style,
  ...props
}) => {
  // Ensure iOS behavior on all platforms for consistent experience
  const platformSettings = Platform.select({
    android: {
      // Fix for Android touch response
      useForeground: true
    },
    default: {}
  });

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      delayPressIn={delayPressIn}
      style={style}
      {...platformSettings}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

export default TouchableWrapper; 