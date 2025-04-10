import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import theme from '../theme/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import PricesScreen from '../screens/PricesScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginOptionsScreen from '../screens/LoginOptionsScreen';
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* Onboarding Screens */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
      
      {/* Authentication Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PricesPage" component={PricesScreen} />
      
      {/* Main Tab Navigation - After Authentication or As Guest */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* Legacy Authenticated User Screens */}
      <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
      
      {/* Admin Screens */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      
      {/* Other screens would be added here */}
      {/* For example: */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
      {/* <Stack.Screen name="MakeReservation" component={MakeReservationScreen} /> */}
      {/* <Stack.Screen name="PastBookings" component={PastBookingsScreen} /> */}
      {/* <Stack.Screen name="EditProfile" component={EditProfileScreen} /> */}
      
      {/* <Stack.Screen name="SlotManagement" component={SlotManagementScreen} /> */}
      {/* <Stack.Screen name="UserManagement" component={UserManagementScreen} /> */}
      {/* <Stack.Screen name="Reports" component={ReportsScreen} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator; 