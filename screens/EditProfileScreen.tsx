import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import { userService } from '../services/user';
import { User } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage(); 
  const isRTL = language === 'ar';
  
  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;

  // State variables
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profile = await userService.getCurrentUserProfile();
        
        if (profile) {
          setUserData(profile);
          setName(profile.name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
          setProfileImage(profile.profileImage || null);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        Alert.alert(t('error'), t('errorLoadingProfile'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare updated profile data
      const updatedProfile: Partial<User> = {
        name,
        phone,
        profileImage
      };
      
      // Update user profile in Firestore
      await userService.updateUserProfile(updatedProfile);
      
      Alert.alert(
        t('success'),
        t('profileUpdated'),
        [{ text: t('ok'), onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('error'), t('errorUpdatingProfile'));
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t('error'), t('permissionRequired'));
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setLoading(true);
        
        // Upload image to Firebase Storage
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Create a unique filename
        const filename = `profile_${userData?.id}_${new Date().getTime()}`;
        const storageRef = ref(storage, `profile_images/${filename}`);
        
        // Upload and get download URL
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update state with new image URL
        setProfileImage(downloadURL);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('error'), t('errorUploadingImage'));
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    Alert.alert(
      t('deleteAccount'),
      t('deleteAccountConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await userService.deleteUserAccount();
              navigation.navigate('Onboarding');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert(t('error'), t('errorDeletingAccount'));
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <AppLayout
        statusBarStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: currentColors.text.primary }]}>
            {t('loading')}
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      statusBarStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
    >
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
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          )}
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
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
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
                value={name}
                onChangeText={setName}
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
                value={email}
                onChangeText={setEmail}
                placeholder={t('enterEmail')}
                placeholderTextColor={currentColors.text.secondary}
                keyboardType="email-address"
                editable={false}
              />
            </View>
            
            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: currentColors.text.secondary }]}>
                {t('phoneNumber')}
              </Text>
              <TextInput
                style={[styles.input, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                value={phone}
                onChangeText={setPhone}
                placeholder={t('enterPhone')}
                placeholderTextColor={currentColors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </BlurView>
        
        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={[styles.dangerZoneTitle, { color: currentColors.error }]}>
            {t('settings')}
          </Text>
          <TouchableOpacity 
            style={[styles.deleteButton, { borderColor: currentColors.error }]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color={currentColors.error} />
            <Text style={[styles.deleteButtonText, { color: currentColors.error }]}>
              {t('deleteAccount')}
            </Text>
          </TouchableOpacity>
        </View>
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
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  dangerZone: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 16,
    marginVertical: 8,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
});

export default EditProfileScreen; 