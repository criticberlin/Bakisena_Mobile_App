import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import ActionButton from '../components/ActionButton';

const AccountScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+20 123 456 7890',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    memberSince: 'March 2023',
    reservations: 14,
    favoriteLocations: 3,
    savedPayments: 2,
  };

  // Option item component
  interface SettingItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
  }

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle = '', 
    hasSwitch = false, 
    switchValue = false, 
    onSwitchChange,
    onPress
  }: SettingItemProps) => (
    <TouchableOpacity 
      style={styles.settingItem}
      disabled={!onPress}
      onPress={onPress}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon as any} size={22} color={theme.colors.accent} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: `${theme.colors.accent}80` }}
          thumbColor={switchValue ? theme.colors.accent : '#f4f3f4'}
        />
      ) : (
        onPress && <Ionicons name="chevron-forward" size={20} color={theme.colors.text.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.profileImage as any} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="create-outline" size={20} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.reservations}</Text>
            <Text style={styles.statLabel}>Reservations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.favoriteLocations}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.savedPayments}</Text>
            <Text style={styles.statLabel}>Payment Cards</Text>
          </View>
        </View>
        
        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your profile details"
            onPress={() => console.log('Navigate to personal info')}
          />
          
          <SettingItem
            icon="card-outline"
            title="Payment Methods"
            subtitle={`${user.savedPayments} cards saved`}
            onPress={() => console.log('Navigate to payment methods')}
          />
          
          <SettingItem
            icon="star-outline"
            title="Favorite Locations"
            subtitle={`${user.favoriteLocations} locations saved`}
            onPress={() => console.log('Navigate to favorite locations')}
          />
          
          <SettingItem
            icon="document-text-outline"
            title="Reservation History"
            subtitle="View your past bookings"
            onPress={() => console.log('Navigate to reservation history')}
          />
        </View>
        
        {/* App Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Reservation alerts and updates"
            hasSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          
          <SettingItem
            icon="location-outline"
            title="Location Services"
            subtitle="For nearby parking suggestions"
            hasSwitch
            switchValue={locationEnabled}
            onSwitchChange={setLocationEnabled}
          />
          
          <SettingItem
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Use Touch ID or Face ID to log in"
            hasSwitch
            switchValue={biometricEnabled}
            onSwitchChange={setBiometricEnabled}
          />
          
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            hasSwitch
            switchValue={darkModeEnabled}
            onSwitchChange={setDarkModeEnabled}
          />
          
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English (US)"
            onPress={() => console.log('Navigate to language settings')}
          />
        </View>
        
        {/* Support and About */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="FAQs and contact information"
            onPress={() => console.log('Navigate to help & support')}
          />
          
          <SettingItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version, terms & privacy policy"
            onPress={() => console.log('Navigate to about')}
          />
        </View>
        
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <ActionButton
            title="Log Out"
            onPress={() => console.log('Log out')}
            variant="outline"
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.divider,
  },
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  logoutContainer: {
    marginVertical: theme.spacing.lg,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  versionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
  },
});

export default AccountScreen; 