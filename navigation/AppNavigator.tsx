import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../theme/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import PricesScreen from '../screens/PricesScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginOptionsScreen from '../screens/LoginOptionsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import MyVehiclesScreen from '../screens/MyVehiclesScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import PastBookingsScreen from '../screens/PastBookingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { themeMode, colors } = useTheme();
  
  // Get appropriate background color based on theme mode
  const backgroundColor = themeMode === 'light' 
    ? (colors?.light?.background || '#F9FAFB')
    : (colors?.dark?.background || '#0F172A');
  
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor },
      }}
    >
      {/* Onboarding Screens */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
      
      {/* Authentication Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={LoginScreen} />
      
      {/* Pricing Screens */}
      <Stack.Screen name="PricesPage" component={PricesScreen} />
      
      {/* Main Tab Navigation - After Authentication or As Guest */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* User Account Screens */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="PastBookings" component={PastBookingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      
      {/* Legacy Authenticated User Screens */}
      <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
      
      {/* Admin Screens */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="UserManagement" component={AdminDashboardScreen} />
      <Stack.Screen name="SlotManagement" component={AdminDashboardScreen} />
      <Stack.Screen name="Reports" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 