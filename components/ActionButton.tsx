import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// Support for legacy props
type LegacyProps = {
  label?: string;
  textKey?: string;
  iconPosition?: 'left' | 'right';
};

export interface ExtendedActionButtonProps extends LegacyProps {
  title?: string; // Make title optional to support legacy props
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

const ActionButton: React.FC<ExtendedActionButtonProps> = ({
  title,
  label, // Legacy prop
  textKey, // Legacy prop
  onPress,
  style,
  textStyle,
  icon,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  iconPosition = 'left', // Legacy prop
  children
}) => {
  const { themeMode, colors } = useTheme();
  
  // Support for legacy props - prefer title, fallback to label, then textKey
  const buttonText = title || label || textKey || '';
  
  // Determine current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  
  // Determine background color based on variant
  const getBackgroundColor = () => {
    if (disabled) return '#CCCCCC'; // Default disabled color
    
    switch (variant) {
      case 'primary':
        return colors.accent;
      case 'secondary':
        return colors.secondary || '#4B5563';
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.accent;
    }
  };
  
  // Determine text color based on variant
  const getTextColor = () => {
    if (disabled) return '#777777';
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.accent;
      default:
        return '#FFFFFF';
    }
  };
  
  // Determine border style based on variant
  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? '#CCCCCC' : colors.accent
      };
    }
    return {};
  };
  
  // Determine padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 20 };
      default: // medium
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };
  
  // Determine font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default: // medium
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getPadding(),
        getBorderStyle(),
        { backgroundColor: getBackgroundColor() },
        style
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconContainer}>{icon}</View>}
          {buttonText && (
            <Text
              style={[
                styles.buttonText,
                { color: getTextColor(), fontSize: getFontSize() },
                textStyle
              ]}
            >
              {buttonText}
            </Text>
          )}
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default ActionButton; 