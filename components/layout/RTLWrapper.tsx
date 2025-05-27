import React from 'react';
import { View, ViewStyle, StyleProp, I18nManager, Text, TextStyle, Switch } from 'react-native';
import { useLanguage } from '../../constants/translations/LanguageContext';

interface RTLWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  forceRTL?: boolean;
  ignoreArabic?: boolean;
  applyTextStyles?: boolean;
}

/**
 * A wrapper component that handles RTL layout direction
 * ensuring consistent handling across the app
 * 
 * @param forceRTL - Force RTL direction regardless of language
 * @param ignoreArabic - Ignore Arabic language RTL enforcement
 * @param applyTextStyles - Apply RTL text styles to Text children
 */
const RTLWrapper: React.FC<RTLWrapperProps> = ({ 
  children, 
  style, 
  forceRTL = false,
  ignoreArabic = false,
  applyTextStyles = false
}) => {
  const { isRTL, language } = useLanguage();
  
  // Determine if we should use RTL layout
  // If ignoreArabic is true, we won't apply RTL for Arabic, but will respect forceRTL
  const shouldUseRTL = forceRTL || (isRTL && !ignoreArabic);
  
  // Apply RTL to I18nManager if needed (this affects the whole app)
  React.useEffect(() => {
    if (I18nManager.isRTL !== isRTL && !ignoreArabic) {
      // Force RTL/LTR based on language
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL, ignoreArabic]);

  // Helper to apply RTL style to Text children
  const applyRTLToChildren = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) return child;
    
    // Handle Text components
    if (child.type === Text) {
      // Apply RTL text alignment to Text components
      const textStyle: TextStyle = {
        textAlign: shouldUseRTL ? 'right' : 'left',
        writingDirection: shouldUseRTL ? 'rtl' : 'ltr'
      };
      
      // Create new props by combining existing props with our style
      const newProps = {
        ...child.props,
        style: [textStyle, child.props.style],
      };
      
      return React.cloneElement(child, newProps);
    }
    
    // Handle icons - if the component has a 'name' prop that includes directional icons
    if (child.props.name && typeof child.props.name === 'string') {
      const iconName = child.props.name;
      
      // Map of directional icon names that need to be flipped in RTL
      const rtlIconMap: Record<string, string> = {
        'arrow-back': 'arrow-forward',
        'arrow-forward': 'arrow-back',
        'chevron-back': 'chevron-forward',
        'chevron-forward': 'chevron-back',
        'caret-back': 'caret-forward',
        'caret-forward': 'caret-back',
        'return-up-back': 'return-up-forward',
        'return-up-forward': 'return-up-back',
        'arrow-back-circle': 'arrow-forward-circle',
        'arrow-forward-circle': 'arrow-back-circle',
        'chevron-back-circle': 'chevron-forward-circle',
        'chevron-forward-circle': 'chevron-back-circle',
      };
      
      // Check if the icon needs to be flipped
      if (shouldUseRTL && rtlIconMap[iconName]) {
        return React.cloneElement(child, {
          ...child.props,
          name: rtlIconMap[iconName],
        });
      }
    }
    
    // Handle switch components
    if (child.type === Switch) {
      return React.cloneElement(child, child.props);
    }
    
    // Recursively apply to children
    if (child.props.children) {
      const newChildren = React.Children.map(child.props.children, applyRTLToChildren);
      return React.cloneElement(child, {}, newChildren);
    }
    
    return child;
  };
  
  const processedChildren = applyTextStyles 
    ? React.Children.map(children, applyRTLToChildren)
    : children;
  
  return (
    <View 
      style={[
        { 
          flexDirection: shouldUseRTL ? 'row-reverse' : 'row',
        },
        style
      ]}
    >
      {processedChildren}
    </View>
  );
};

export default RTLWrapper; 