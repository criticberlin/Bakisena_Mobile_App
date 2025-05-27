import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  PanResponder
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import AppLayout from '../components/layout/AppLayout';
import { AppTextWrapper } from '../theme';
import { useLanguage } from '../constants/translations/LanguageContext';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const { themeMode, colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const swipeThreshold = width * 0.7; // 70% of screen width

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (isRTL) {
          swipeAnim.setValue(-gestureState.dx);
        } else {
          swipeAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeDistance = Math.abs(gestureState.dx);
        if (swipeDistance > swipeThreshold) {
          // Complete the swipe
          Animated.timing(swipeAnim, {
            toValue: isRTL ? -width : width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleNavigateToLoginOptions();
          });
        } else {
          // Reset the swipe
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Simulate any data loading if needed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNavigateToLoginOptions = () => {
    navigation.navigate('LoginOptions');
  };

  if (isLoading) {
    return (
      <AppLayout scrollable={false} containerType="screen">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.accent} />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout scrollable={false} containerType="screen" bottomNavPadding={false}>
      <View style={styles.content}>
        {/* Yellow half circles positioned at screen edges */}
        <View style={[styles.leftHalfCircle, { 
          backgroundColor: currentColors.accent, 
          left: isRTL ? undefined : -width * 0.075, 
          right: isRTL ? -width * 0.075 : undefined,
          borderTopRightRadius: isRTL ? undefined : width * 0.15,
          borderBottomRightRadius: isRTL ? undefined : width * 0.15,
          borderTopLeftRadius: isRTL ? width * 0.15 : undefined,
          borderBottomLeftRadius: isRTL ? width * 0.15 : undefined
        }]} />
        <View style={[styles.rightHalfCircle, { 
          backgroundColor: currentColors.accent, 
          right: isRTL ? undefined : -width * 0.075, 
          left: isRTL ? -width * 0.075 : undefined,
          borderTopLeftRadius: isRTL ? undefined : width * 0.15,
          borderBottomLeftRadius: isRTL ? undefined : width * 0.15,
          borderTopRightRadius: isRTL ? width * 0.15 : undefined,
          borderBottomRightRadius: isRTL ? width * 0.15 : undefined
        }]} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <AppTextWrapper variant="title" style={[styles.title, { textAlign: 'center' }]}>{t('smartParking')}</AppTextWrapper>
          <AppTextWrapper variant="body" style={[styles.subtitle, { textAlign: 'center'}]}>
            {t('homeDescription')}
          </AppTextWrapper>
        </View>
        
        {/* Logo Circle - Centered and larger */}
        <View style={styles.logoContainer}>
          <View style={[styles.outerCircle, { backgroundColor: currentColors.secondary }]}>
            <Image 
              source={require('../assets/images/Logo_Only.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
        
        {/* Features Section - Made larger */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity style={[styles.featureItem, { backgroundColor: currentColors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.featureIconContainer, { 
              backgroundColor: currentColors.accent,
              marginRight: isRTL ? 0 : 16,
              marginLeft: isRTL ? 16 : 0
            }]}>
              <Text style={[styles.featureIconText, { color: currentColors.primary }]}>🚗</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <AppTextWrapper variant="subtitle" style={[styles.featureTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('bookNow')}</AppTextWrapper>
              <AppTextWrapper variant="body" style={[styles.featureDescription, { textAlign: isRTL ? 'right' : 'left' }]}>{t('realTimeAvailability')}</AppTextWrapper>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.featureItem, { backgroundColor: currentColors.surface, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.featureIconContainer, { 
              backgroundColor: currentColors.accent,
              marginRight: isRTL ? 0 : 16,
              marginLeft: isRTL ? 16 : 0
            }]}>
              <Text style={[styles.featureIconText, { color: currentColors.primary }]}>💳</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <AppTextWrapper variant="subtitle" style={[styles.featureTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('paymentMethods')}</AppTextWrapper>
              <AppTextWrapper variant="body" style={[styles.featureDescription, { textAlign: isRTL ? 'right' : 'left' }]}>{t('acceptedPayments')}</AppTextWrapper>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Swipeable bottom button */}
      <View style={[styles.swipeContainer, { backgroundColor: currentColors.surface }]}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.swipeButton,
            {
              backgroundColor: currentColors.accent,
              transform: [{ translateX: swipeAnim }],
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}
        >
          <AppTextWrapper style={[styles.swipeText, { color: currentColors.primary }]}>
            {t('swipeToEnter')}
          </AppTextWrapper>
          <View style={[styles.swipeIconContainer, { 
            backgroundColor: currentColors.primary,
            left: isRTL ? undefined : 20,
            right: isRTL ? 20 : undefined
          }]}>
            <Text style={[styles.swipeIcon, { color: currentColors.accent }]}>➜</Text>
          </View>
        </Animated.View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 30,
    marginBottom: 15,
    zIndex: 2,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 550,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    width: '100%'
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 16,
    width: '100%'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
    zIndex: 3,
    alignSelf: 'center',
  },
  leftHalfCircle: {
    width: width * 0.12,
    height: width * 0.2,
    position: 'absolute',
    top: height * 0.42,
    zIndex: 1,
    opacity: 0.9,
  },
  rightHalfCircle: {
    width: width * 0.12,
    height: width * 0.2,
    position: 'absolute',
    top: height * 0.42,
    zIndex: 1,
    opacity: 0.9,
  },
  outerCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 3,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  logoImage: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
  },
  featuresContainer: {
    marginTop: 20,
    marginBottom: 90,
    paddingHorizontal: 20,
    zIndex: 2,
    width: '100%',
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
    maxWidth: 500,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  swipeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  swipeButton: {
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  swipeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIcon: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1B3A',
  },
});

export default OnboardingScreen; 