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
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
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
      <Stack.Screen name="EditProfile" component={SettingsScreen} />
      <Stack.Screen name="MyVehicles" component={SettingsScreen} />
      <Stack.Screen name="PaymentMethods" component={SettingsScreen} />
      <Stack.Screen name="PastBookings" component={SettingsScreen} />
      <Stack.Screen name="About" component={SettingsScreen} />
      
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