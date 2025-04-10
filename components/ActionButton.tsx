import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
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
  const { colors } = useTheme();
  
  // Define button style based on variant and size
  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...(size === 'small' ? styles.smallButton : 
        size === 'large' ? styles.largeButton : 
        styles.mediumButton),
    ...(variant === 'primary' ? styles.primaryButton : 
        variant === 'secondary' ? styles.secondaryButton : 
        styles.outlineButton),
    ...(disabled ? styles.disabledButton : {}),
    ...(style || {})
  };

  // Define text style based on variant and size
  const textStyleFinal: TextStyle = {
    ...styles.text,
    ...(size === 'small' ? styles.smallText : 
        size === 'large' ? styles.largeText : 
        styles.mediumText),
    ...(variant === 'primary' ? styles.primaryText : 
        variant === 'secondary' ? styles.secondaryText : 
        styles.outlineText),
    ...(disabled ? styles.disabledText : {}),
    ...(textStyle || {})
  };

  const loadingColor = variant === 'outline' 
    ? colors.accent 
    : (variant === 'secondary' ? colors.primary : colors.secondary);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
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
            style={textStyleFinal}
            textKey={textKey as any}
          >
            {title}
          </AppTextWrapper>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 4,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 160,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#F9B233', // Will be overridden by theme
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF', // Will be overridden by theme
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F9B233', // Will be overridden by theme
  },
  disabledButton: {
    backgroundColor: '#8E8E9F',
    opacity: 0.7,
    shadowOpacity: 0,
  },
  text: {
    fontWeight: '600' as const, // Use string literal for fontWeight
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF', // Will be overridden by theme
  },
  secondaryText: {
    color: '#1C1C3C', // Will be overridden by theme
  },
  outlineText: {
    color: '#F9B233', // Will be overridden by theme
  },
  disabledText: {
    color: '#A0A0B8',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default ActionButton; 