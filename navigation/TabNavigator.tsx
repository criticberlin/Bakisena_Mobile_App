import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import theme from '../theme/theme';

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
            iconName = focused ? 'bluetooth' : 'bluetooth-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={iconName} 
                size={focused ? size + 4 : size} 
                color={color} 
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(28, 28, 60, 0.85)',
          borderTopWidth: 0,
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : 10),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          paddingTop: 10,
          borderTopLeftRadius: theme.borders.radius.xl,
          borderTopRightRadius: theme.borders.radius.xl,
          shadowColor: theme.shadows.lg.shadowColor,
          shadowOffset: theme.shadows.lg.shadowOffset,
          shadowOpacity: theme.shadows.lg.shadowOpacity,
          shadowRadius: theme.shadows.lg.shadowRadius,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 1,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarBackground: () => (
          <BlurView 
            intensity={25} 
            tint="dark" 
            style={StyleSheet.absoluteFill}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Monitor" component={MonitorScreen} />
      <Tab.Screen name="Parking" component={ParkingScreen} />
      <Tab.Screen name="Connected" component={ConnectedScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
});

export default TabNavigator; 