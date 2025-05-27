import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { useAuth } from '../components/AuthContext';
import Svg, { Path } from 'react-native-svg';
import CustomTabBar from '../components/layout/CustomTabBar';

// Import the screens for each tab
import MonitorScreen from '../screens/MonitorScreen';
import ParkingScreen from '../screens/ParkingScreen';
import ConnectedScreen from '../screens/ConnectedScreen';
import AccountScreen from '../screens/AccountScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

// Define the tab navigator param list
export type TabParamList = {
  Home: undefined;
  Monitor: undefined;
  Parking: undefined;
  Connected: undefined;
  Account: undefined;
  AdminDashboard: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const SCREEN_WIDTH = Dimensions.get('window').width;

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

// Simple route type that works for our case
type RouteProps = {
  name: keyof TabParamList;
};

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { themeMode, colors } = useTheme();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  
  // Determine if we're in dark mode for theming
  const isDarkMode = themeMode === 'dark';

  // Create dynamic styles based on theme
  const dynamicStyles = {
    tabBarBackgroundContainer: {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    },
    blurViewStyle: {
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    }
  };
  
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }: {route: RouteProps}) => ({
        headerShown: false,
        tabBarShowLabel: false, // Hide default labels, handled by CustomTabBar
        tabBarStyle: { display: 'none' }, // Hide default bar, CustomTabBar is absolutely positioned
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen 
        name="Monitor" 
        component={MonitorScreen} 
        options={{ tabBarLabel: t('monitor') }}
      />
      <Tab.Screen 
        name="Parking" 
        component={ParkingScreen} 
        options={{ tabBarLabel: t('parking') }}
      />
      <Tab.Screen 
        name="Connected" 
        component={ConnectedScreen} 
        options={{ tabBarLabel: t('connected') }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
        options={{ tabBarLabel: t('account') }}
      />
      {isAdmin && (
        <Tab.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={{ tabBarLabel: t('admin') }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  parkingIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    marginTop: -36, // Raise the button above the curve
    zIndex: 10,
    position: 'absolute',
    left: (SCREEN_WIDTH - 32) / 2 - 36, // Center horizontally
    bottom: 10,
  },
  parkingIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBarBackgroundContainer: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Default dark mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  blurViewStyle: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Default dark mode
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Default dark mode
  }
});

export default TabNavigator;