import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t } = useLanguage();
  
  // Mock user data - in a real app, this would come from a context/state
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    profileImage: null as string | null,
  });

  const handleSave = () => {
    // In a real app, you would save the user data to your backend here
    Alert.alert(
      'Success',
      'Profile updated successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const pickImage = () => {
    // This would use image picker in a real app
    Alert.alert('Image Picker', 'This would open the image picker');
  };

  return (
    <AppLayout>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Edit Profile
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.accent }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {userData.profileImage ? (
              <Image 
                source={{ uri: userData.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <Image 
                source={require('../assets/images/avatar-placeholder.png')} 
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity 
              style={[styles.editImageButton, { backgroundColor: colors.accent }]} 
              onPress={pickImage}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.formBlur}>
          <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
            {/* Name Field */}
            <View style={[styles.inputGroup, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
                Full Name
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                value={userData.name}
                onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
            
            {/* Email Field */}
            <View style={[styles.inputGroup, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
                Email
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>
                Phone Number
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                value={userData.phone}
                onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </BlurView>

        {/* Password Change Section */}
        <Text style={[styles.sectionTitle, { color: colors.text.secondary, marginTop: 24 }]}>
          Security
        </Text>
        
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.formBlur}>
          <TouchableOpacity 
            style={[styles.passwordChangeButton, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert('Change Password', 'This would open a password change form')}
          >
            <Ionicons name="lock-closed-outline" size={22} color={colors.accent} style={styles.lockIcon} />
            <Text style={[styles.passwordChangeText, { color: colors.text.primary }]}>
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBlur: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  formContainer: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  inputGroup: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  passwordChangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  lockIcon: {
    marginRight: 12,
  },
  passwordChangeText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default EditProfileScreen; 