import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { ActionButtonProps } from '../types';
import theme from '../theme/theme';

interface ExtendedActionButtonProps extends ActionButtonProps {
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
}

const ActionButton: React.FC<ExtendedActionButtonProps> = ({
  title,
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
    ? theme.colors.accent 
    : (variant === 'secondary' ? theme.colors.primary : theme.colors.secondary);

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
          <Text style={textStyleFinal}>{title}</Text>
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
    borderRadius: theme.borders.radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...theme.shadows.md,
  },
  smallButton: {
    paddingVertical: theme.spacing['2'],
    paddingHorizontal: theme.spacing['4'],
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['5'],
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: theme.spacing['4'],
    paddingHorizontal: theme.spacing['6'],
    minWidth: 160,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.accent,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.accent,
  },
  disabledButton: {
    backgroundColor: theme.colors.text.disabled,
    opacity: 0.7,
    ...theme.shadows.none,
  },
  text: {
    fontWeight: '600' as const, // Use string literal for fontWeight
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.base,
  },
  largeText: {
    fontSize: theme.typography.fontSize.md,
  },
  primaryText: {
    color: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
  outlineText: {
    color: theme.colors.accent,
  },
  disabledText: {
    color: theme.colors.text.hint,
  },
  iconLeft: {
    marginRight: theme.spacing['2'],
  },
  iconRight: {
    marginLeft: theme.spacing['2'],
  },
});

export default ActionButton; 