import React from 'react';
import { Text, TextStyle, StyleProp, TextProps } from 'react-native';
import { useLanguage } from '../../constants/translations/LanguageContext';

interface RTLTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

/**
 * A text component that handles RTL text alignment
 * ensuring consistent handling across the app
 */
const RTLText: React.FC<RTLTextProps> = ({ children, style, ...props }) => {
  const { isRTL } = useLanguage();
  
  return (
    <Text 
      style={[
        { 
          textAlign: isRTL ? 'right' : 'left',
          writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default RTLText; 