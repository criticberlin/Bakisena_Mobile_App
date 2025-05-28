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
  
  // Determine current theme colors - simplified to avoid performance issues
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  
  // Determine background color based on variant - simplified for performance
  const getBackgroundColor = () => {
    if (disabled) return '#CCCCCC';
    
    switch (variant) {
      case 'primary': return colors.accent;
      case 'secondary': return colors.secondary || '#4B5563';
      case 'outline':
      case 'ghost': return 'transparent';
      default: return colors.accent;
    }
  };
  
  // Determine text color based on variant - simplified for performance
  const getTextColor = () => {
    if (disabled) return '#777777';
    
    switch (variant) {
      case 'primary':
      case 'secondary': return '#FFFFFF';
      case 'outline':
      case 'ghost': return colors.accent;
      default: return '#FFFFFF';
    }
  };
  
  // Pre-calculate style values instead of calculating in render
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();
  const borderStyle = variant === 'outline' ? {
    borderWidth: 1,
    borderColor: disabled ? '#CCCCCC' : colors.accent
  } : {};
  
  // Determine padding based on size - simplified for performance
  let paddingStyle;
  switch (size) {
    case 'small':
      paddingStyle = { paddingVertical: 8, paddingHorizontal: 12 };
      break;
    case 'large':
      paddingStyle = { paddingVertical: 14, paddingHorizontal: 20 };
      break;
    default: // medium
      paddingStyle = { paddingVertical: 12, paddingHorizontal: 16 };
  }
  
  // Determine font size based on size - simplified for performance
  let fontSize;
  switch (size) {
    case 'small': fontSize = 14; break;
    case 'large': fontSize = 18; break;
    default: fontSize = 16;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        paddingStyle,
        borderStyle,
        { backgroundColor },
        style
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      delayPressIn={0}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconContainer}>{icon}</View>}
          {buttonText && (
            <Text
              style={[
                styles.buttonText,
                { color: textColor, fontSize },
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