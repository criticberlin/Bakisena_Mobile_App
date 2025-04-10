import React from 'react';
import { Text, TextProps, StyleSheet, Animated } from 'react-native';
import { useTheme } from './ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { TranslationKey } from '../constants/translations';

interface AppTextWrapperProps extends TextProps {
  children?: React.ReactNode;
  textKey?: TranslationKey;
  values?: Record<string, string | number>;
  variant?: 'header' | 'title' | 'subtitle' | 'body' | 'caption' | 'button' | 'label';
}

/**
 * A text component that automatically applies the current theme styles and translations
 */
const AppTextWrapper: React.FC<AppTextWrapperProps> = ({
  children,
  textKey,
  values,
  variant = 'body',
  style,
  ...props
}) => {
  const { colors, themeMode, animatedColors } = useTheme();
  const { t, language } = useLanguage();
  
  // Get style based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'header':
        return styles.header;
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'button':
        return styles.button;
      case 'label':
        return styles.label;
      case 'body':
      default:
        return styles.body;
    }
  };
  
  // Determine content
  let content = children;
  if (textKey) {
    // Handle translation manually if we have values to interpolate
    if (values) {
      let translatedText = t(textKey);
      Object.entries(values).forEach(([key, value]) => {
        translatedText = translatedText.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
      content = translatedText;
    } else {
      // Just translate the key
      content = t(textKey);
    }
  }
  
  return (
    <Animated.Text 
      style={[
        getVariantStyle(),
        { color: animatedColors.text.primary },
        style,
      ]}
      {...props}
    >
      {content}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
  },
  caption: {
    fontSize: 12,
    opacity: 0.8,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AppTextWrapper; 