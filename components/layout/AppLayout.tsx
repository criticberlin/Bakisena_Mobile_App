import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  ViewStyle, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StatusBar, 
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { AppThemeWrapper } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import theme from '../../theme/theme';
import { useLanguage } from '../../constants/translations/LanguageContext';
import RTLWrapper from './RTLWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface AppLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scrollable?: boolean;
  containerType?: 'view' | 'screen' | 'surface' | 'card';
  paddingHorizontal?: number;
  paddingVertical?: number;
  keyboardAvoiding?: boolean;
  animate?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  bottomNavPadding?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  showProfileButton?: boolean;
  showLogo?: boolean;
  customHeader?: React.ReactNode;
  onProfilePress?: () => void;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * AppLayout - A consistent layout wrapper to apply theme and RTL settings across screens
 * 
 * Use this component to wrap your screens to ensure consistent styling, RTL support,
 * and theme application across the entire app.
 */
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  style,
  scrollable = true,
  containerType = 'screen',
  paddingHorizontal = 16,
  paddingVertical = 0,
  keyboardAvoiding = true,
  animate = true,
  statusBarStyle,
  bottomNavPadding = true,
  showHeader = false,
  headerTitle,
  showProfileButton = false,
  showLogo = false,
  customHeader,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { themeMode, colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { isRTL } = useLanguage();
  const navigation = useNavigation();
  
  // Get current theme colors
  const currentColors = themeMode === 'dark' ? colors.dark : colors.light;
  
  // Animation values
  const contentOpacity = useSharedValue(0);
  
  // Calculate top padding to ensure content is above the navigation bar
  const topPadding = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) * theme.GLOBAL_SCALE + theme.scale(10)
    : insets.top * theme.GLOBAL_SCALE;
  
  // Calculate bottom padding to accommodate navigation bar (usually 75 points)
  const bottomNavHeight = bottomNavPadding ? 75 : 0;
  
  const padding = {
    paddingHorizontal: theme.scale(paddingHorizontal),
    paddingTop: paddingVertical ? theme.scale(paddingVertical) : topPadding,
    paddingBottom: paddingVertical ? theme.scale(paddingVertical) : 0,
  };
  
  // Responsive padding adjustments for tablets
  const responsivePadding = {
    paddingHorizontal: theme.size.isTablet ? theme.scale(24) : theme.scale(paddingHorizontal),
  };
  
  // Set up animations
  useEffect(() => {
    if (animate) {
      contentOpacity.value = withTiming(1, { 
        duration: theme.animations.duration.normal 
      });
    } else {
      contentOpacity.value = 1;
    }
  }, []);
  
  // Animated styles
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));
  
  // Auto-detect status bar style based on theme if not provided
  const autoStatusBarStyle = statusBarStyle || 
    (themeMode === 'dark' ? 'light-content' : 'dark-content');

  // Header component
  const Header = () => {
    if (customHeader) {
      return customHeader;
    }
    
    if (!showHeader && !showLogo && !showProfileButton) {
      return null;
    }
    
    return (
      <View style={[
        styles.header,
        { 
          backgroundColor: showHeader ? currentColors.surface : 'transparent',
          borderBottomColor: showHeader ? currentColors.divider : 'transparent',
          paddingTop: topPadding,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }
      ]}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/Logo_With_Border.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}
        
        {headerTitle && (
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: currentColors.text.primary }]}>
              {headerTitle}
            </Text>
          </View>
        )}
        
        <View style={styles.headerRight}>
          {showProfileButton && (
            <TouchableOpacity 
              style={[styles.profileButton, { backgroundColor: currentColors.surface }]}
              onPress={onProfilePress || (() => navigation.navigate('Account' as never))}
              activeOpacity={0.7}
            >
              <Ionicons name="person" size={22} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  
  const Content = () => (
    <Animated.View 
      style={[fadeStyle, { flex: 1 }]}
      entering={animate ? FadeIn.duration(300) : undefined}
    >
      <StatusBar 
        barStyle={autoStatusBarStyle} 
        backgroundColor="transparent" 
        translucent 
      />
      <Header />
      <AppThemeWrapper 
        containerType={containerType}
        style={[
          styles.container, 
          padding, 
          responsivePadding, 
          bottomNavPadding && { marginBottom: bottomNavHeight }, 
          style
        ]}
      >
        {children}
      </AppThemeWrapper>
    </Animated.View>
  );
  
  // Wrap with scrollview if scrollable is true
  const ContentWithScroll = () => (
    <RTLWrapper applyTextStyles={true} ignoreArabic={false} style={{ flex: 1 }}>
      <Header />
      <AnimatedScrollView
        style={[styles.scrollView, { paddingHorizontal: 0 }, fadeStyle]}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingHorizontal: responsivePadding.paddingHorizontal, 
          paddingTop: 0, // Header is outside scrollview now
          paddingBottom: paddingVertical ? theme.scale(paddingVertical) : theme.scale(24) + bottomNavHeight,
        }}
        showsVerticalScrollIndicator={true}
        overScrollMode="always"
        bounces={true}
        entering={animate ? FadeIn.duration(300) : undefined}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar 
          barStyle={autoStatusBarStyle} 
          backgroundColor="transparent" 
          translucent 
        />
        <AppThemeWrapper 
          containerType={containerType}
          style={[styles.container, { padding: 0 }, style]}
        >
          {children}
        </AppThemeWrapper>
      </AnimatedScrollView>
    </RTLWrapper>
  );
  
  // Use KeyboardAvoidingView on iOS
  if (keyboardAvoiding && Platform.OS === 'ios') {
    return (
      <SafeAreaView style={[
        styles.safeArea, 
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]} edges={['left', 'right']}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid} 
          behavior="padding"
          keyboardVerticalOffset={insets.bottom}
        >
          {scrollable ? <ContentWithScroll /> : <Content />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[
      styles.safeArea, 
      { flexDirection: isRTL ? 'row-reverse' : 'row' }
    ]} edges={['left', 'right']}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    paddingHorizontal: theme.scale(16),
    borderBottomWidth: 1,
  },
  logoContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 40,
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  headerRight: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
});

export default AppLayout; 