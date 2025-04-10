import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Pressable
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { ActionButtonProps } from '../types';
import { useTheme, AppTextWrapper } from '../theme';

interface ExtendedActionButtonProps extends ActionButtonProps {
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  textKey?: string; // Add support for translation key
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActionButton: React.FC<ExtendedActionButtonProps> = ({
  title,
  textKey,
  onPress,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  size = 'medium'
}) => {
  const { colors, themeMode } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value
    };
  });
  
  // Handle press animations
  const handlePressIn = () => {
    setIsPressed(true);
    scale.value = withTiming(0.97, { 
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withTiming(1, { 
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };
  
  // Define button style based on variant and size
  const getButtonStyle = (): ViewStyle => {
    // Base styles for each variant
    const variantStyles = {
      primary: {
        backgroundColor: colors.accent,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.accent,
      }
    };
    
    // Size styles
    const sizeStyles = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 80,
        borderRadius: 12,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        minWidth: 120,
        borderRadius: 16,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        minWidth: 160, 
        borderRadius: 18,
      }
    };
    
    // Combine styles
    return {
      ...styles.button,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled ? styles.disabledButton : {}),
      ...(isPressed && variant === 'primary' ? { backgroundColor: colors.accent + 'E6' } : {}),
    };
  };

  // Define text style based on variant and size
  const getTextStyle = (): TextStyle => {
    // Base text styles for each variant
    const variantTextStyles = {
      primary: {
        color: '#FFFFFF',
      },
      secondary: {
        color: themeMode === 'dark' ? colors.text.primary : colors.primary,
      },
      outline: {
        color: colors.accent,
      }
    };
    
    // Size text styles
    const sizeTextStyles = {
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      }
    };
    
    // Combine styles
    return {
      ...styles.text,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...(disabled ? styles.disabledText : {}),
    };
  };

  // Determine loading color based on variant
  const loadingColor = variant === 'outline' 
    ? colors.accent 
    : (variant === 'secondary' ? colors.primary : '#FFFFFF');

  return (
    <AnimatedPressable
      style={[
        getButtonStyle(),
        style,
        animatedStyle
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      android_ripple={{ 
        color: 'transparent',
      }}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={loadingColor} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <AppTextWrapper 
            variant="button" 
            style={[getTextStyle(), textStyle]}
            textKey={textKey as any}
          >
            {title}
          </AppTextWrapper>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 0,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#8E8E9F',
    opacity: 0.5,
    borderWidth: 0,
  },
  text: {
    fontWeight: '600' as const,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  disabledText: {
    color: '#FFFFFF',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default ActionButton; 