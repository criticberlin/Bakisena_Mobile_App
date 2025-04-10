import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Image,
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
  const { t, language } = useLanguage(); 
  const isRTL = language === 'ar';
  
  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

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
      t('save'),
      t('registrationSuccess'),
      [{ text: t('ok'), onPress: () => navigation.goBack() }]
    );
  };

  const pickImage = () => {
    // This would use image picker in a real app
    Alert.alert(t('add'), t('appDescription'));
  };

  return (
    <AppLayout>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: currentColors.surface }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          {t('profile')}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: currentColors.accent }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image */}
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={pickImage}
          >
            {userData.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            ) : (
              <Image source={require('../assets/images/avatar-placeholder.png')} style={styles.profileImage} />
            )}
            <View style={[styles.editImageButton, { backgroundColor: currentColors.accent }]}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Form Fields */}
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.formBlur}>
          <View style={[styles.formContainer, { backgroundColor: currentColors.surface }]}>
            {/* Name Field */}
            <View style={[styles.inputGroup, { borderBottomColor: currentColors.divider }]}>
              <Text style={[styles.inputLabel, { color: currentColors.text.secondary }]}>
                {t('fullName')}
              </Text>
              <TextInput
                style={[styles.input, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                value={userData.name}
                onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                placeholder={t('enterName')}
                placeholderTextColor={currentColors.text.secondary}
              />
            </View>
            
            {/* Email Field */}
            <View style={[styles.inputGroup, { borderBottomColor: currentColors.divider }]}>
              <Text style={[styles.inputLabel, { color: currentColors.text.secondary }]}>
                {t('email')}
              </Text>
              <TextInput
                style={[styles.input, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                placeholder={t('enterEmail')}
                placeholderTextColor={currentColors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: currentColors.text.secondary }]}>
                {t('phoneNumber')}
              </Text>
              <TextInput
                style={[styles.input, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                value={userData.phone}
                onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
                placeholder={t('enterPhone')}
                placeholderTextColor={currentColors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </BlurView>
        
        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>{t('delete')}</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 24,
  },
  formContainer: {
    borderRadius: 16,
    padding: 16,
  },
  inputGroup: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen; 