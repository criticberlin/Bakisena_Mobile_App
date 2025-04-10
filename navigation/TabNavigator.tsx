import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';

// Import the screens for each tab
import MonitorScreen from '../screens/MonitorScreen';
import ParkingScreen from '../screens/ParkingScreen';
import ConnectedScreen from '../screens/ConnectedScreen';
import AccountScreen from '../screens/AccountScreen';
import HomeScreen from '../screens/HomeScreen';

// Define the tab navigator param list
export type TabParamList = {
  Home: undefined;
  Monitor: undefined;
  Parking: undefined;
  Connected: undefined;
  Account: undefined;
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
  
  // Determine if we're in dark mode for theming
  const isDarkMode = themeMode === 'dark';
  
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: {route: RouteProps}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          // Set icon name based on route name
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Monitor') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Parking') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Connected') {
            iconName = focused ? 'planet' : 'planet-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Special style for the Parking button
          if (route.name === 'Parking') {
            return (
              <View style={styles.parkingIconContainer}>
                <Animated.View style={styles.parkingIconCircle}>
                  <Ionicons name={iconName} size={28} color="#000" />
                </Animated.View>
              </View>
            );
          }

          // Regular style for other tabs
          return (
            <View style={styles.iconContainer}>
              <Animated.View 
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: focused ? 
                      `${colors.accent}30` : 
                      isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                  }
                ]}
              >
                <Ionicons 
                  name={iconName} 
                  size={focused ? size + 2 : size} 
                  color={color} 
                />
              </Animated.View>
              {focused && <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]} />}
            </View>
          );
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : 10),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          paddingTop: 5,
          elevation: 0, // Remove default elevation
          left: 16,
          right: 16,
          bottom: 16,
          paddingHorizontal: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 5,
          marginBottom: 5,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackgroundContainer}>
            <BlurView 
              intensity={isDarkMode ? 25 : 40} 
              tint={isDarkMode ? "dark" : "light"} 
              style={[
                StyleSheet.absoluteFill, 
                styles.blurViewStyle
              ]}
            />
          </View>
        ),
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
        options={{ 
          tabBarLabel: t('parking'),
          tabBarItemStyle: {
            height: 0, // Adjust for the raised circular button
          }
        }}
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
    width: 56,
    height: 56,
    marginTop: -30, // Raise the button above the tab bar
  },
  parkingIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFCC00', // Yellow color as in the screenshot
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBarBackgroundContainer: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 0,
    backgroundColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  blurViewStyle: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  }
});

export default TabNavigator;