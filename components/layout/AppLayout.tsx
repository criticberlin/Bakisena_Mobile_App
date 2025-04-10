import React from 'react';
import { StyleSheet, SafeAreaView, ViewStyle, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppThemeWrapper } from '../../theme';

interface AppLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  containerType?: 'view' | 'screen' | 'surface' | 'card';
  paddingHorizontal?: number;
  paddingVertical?: number;
  keyboardAvoiding?: boolean;
}

/**
 * AppLayout - A consistent layout wrapper to apply theme and RTL settings across screens
 * 
 * Use this component to wrap your screens to ensure consistent styling, RTL support,
 * and theme application across the entire app.
 */
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  style,
  scrollable = false,
  containerType = 'screen',
  paddingHorizontal = 16,
  paddingVertical = 0,
  keyboardAvoiding = true,
}) => {
  const padding = {
    paddingHorizontal,
    paddingVertical,
  };
  
  const Content = () => (
    <AppThemeWrapper 
      containerType={containerType}
      style={[styles.container, padding, style]}
    >
      {children}
    </AppThemeWrapper>
  );
  
  // Wrap with scrollview if scrollable is true
  const ContentWithScroll = () => (
    <ScrollView
      style={[styles.scrollView, { paddingHorizontal: 0 }]}
      contentContainerStyle={{ paddingHorizontal, paddingVertical }}
      showsVerticalScrollIndicator={false}
    >
      <AppThemeWrapper 
        containerType={containerType}
        style={[styles.container, { padding: 0 }, style]}
      >
        {children}
      </AppThemeWrapper>
    </ScrollView>
  );
  
  // Use KeyboardAvoidingView on iOS
  if (keyboardAvoiding && Platform.OS === 'ios') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid} 
          behavior="padding"
        >
          {scrollable ? <ContentWithScroll /> : <Content />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? <ContentWithScroll /> : <Content />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
});

export default AppLayout; 