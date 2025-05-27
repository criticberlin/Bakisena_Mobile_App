import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../components/AuthContext';

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
import ParkingManagementScreen from '../screens/ParkingManagementScreen';
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { themeMode, colors } = useTheme();
  const { user, isAdmin } = useAuth();
  
  // Get appropriate background color based on theme mode
  const backgroundColor = themeMode === 'light' 
    ? (colors?.light?.background || '#F9FAFB')
    : (colors?.dark?.background || '#0F172A');
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor },
      }}
    >
      {user ? (
        // User is logged in
        isAdmin ? (
          // User is admin, show admin screens
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="UserManagement" component={AdminDashboardScreen} />
            <Stack.Screen name="SlotManagement" component={ParkingManagementScreen} />
            <Stack.Screen name="Reports" component={AdminDashboardScreen} />
          </>
        ) : (
          // User is regular, show main tabs and user screens
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />

            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="PastBookings" component={PastBookingsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />

            <Stack.Screen name="PricesPage" component={PricesScreen} />
          </>
        )
      ) : (
        // User is not logged in, show auth flow
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
          
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 