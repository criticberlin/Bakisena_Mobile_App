import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';
import AppLayout from '../components/layout/AppLayout';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);

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
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FDC200" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>A Smart Parking System</Text>
          <Text style={styles.subtitle}>
            Revolutionize your parking experience by accessing real-time parking data and booking spots on the go.
          </Text>
        </View>
        
        {/* Logo Circle */}
        <View style={styles.logoContainer}>
          {/* Main circle */}
          <View style={styles.outerCircle}>
            <Image 
              source={require('../assets/images/Logo_Only.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Left half circle */}
          <View style={styles.leftHalfCircle} />
          
          {/* Right half circle */}
          <View style={styles.rightHalfCircle} />
        </View>
        
        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIconText}>🚗</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Reserve</Text>
              <Text style={styles.featureDescription}>Reserve parking spots in advance.</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIconText}>💳</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Process Payments</Text>
              <Text style={styles.featureDescription}>Cashless online transactions on the go.</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.lockFeatureItem}
            onPress={handleNavigateToLoginOptions}
          >
            <Text style={styles.lockFeatureText}>Partial Parking Spot</Text>
            <View style={styles.lockIconContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1B3A', // dark blue background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    flexDirection: 'row',
    position: 'relative',
  },
  leftHalfCircle: {
    width: 50,
    height: 100,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: '#FDC200',
    position: 'absolute',
    left: -30,
    top: 60,
    zIndex: 0,
  },
  rightHalfCircle: {
    width: 50,
    height: 100,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#FDC200',
    position: 'absolute',
    right: -30,
    top: 60,
    zIndex: 0,
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  featuresContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDC200',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconText: {
    fontSize: 18,
    color: '#1C1B3A',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  lockFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDC200',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  lockIconContainer: {
    position: 'absolute',
    left: 16,
  },
  lockIcon: {
    fontSize: 20,
    color: '#1C1B3A',
  },
  lockFeatureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1B3A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingScreen; 