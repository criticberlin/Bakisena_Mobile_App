import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
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

          return (
            <View style={styles.iconContainer}>
              <Animated.View 
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: focused ? 
                      `${colors.accent}30` : 
                      themeMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
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
        tabBarInactiveTintColor: themeMode === 'dark' ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: themeMode === 'dark' ? 'rgba(28, 28, 60, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderTopWidth: 0,
          height: 70 + (Platform.OS === 'ios' ? insets.bottom : 10),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          paddingTop: 10,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          elevation: 25,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 5,
          marginBottom: 4,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarBackground: () => (
          <BlurView 
            intensity={40} 
            tint={themeMode === 'dark' ? "dark" : "light"} 
            style={[
              StyleSheet.absoluteFill, 
              { 
                borderTopLeftRadius: 28, 
                borderTopRightRadius: 28,
                overflow: 'hidden'
              }
            ]}
          />
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
});

export default TabNavigator; 