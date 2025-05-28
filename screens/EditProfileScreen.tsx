import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
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
import { useAuth } from '../components/AuthContext';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = React.memo(() => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { themeMode, colors } = useTheme();
  const { t, language } = useLanguage(); 
  const { user } = useAuth();
  const isRTL = language === 'ar';
  
  // Get current theme colors
  const currentColors = useMemo(() => 
    themeMode === 'light' ? colors.light : colors.dark
  , [themeMode, colors]);

  // State variables
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<User | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Add validation state
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });

  // Load user data once
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const profile = await userService.getCurrentUserProfile();
        
        if (profile) {
          setInitialData(profile);
          setFormValues({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        Alert.alert(t('error'), t('errorLoadingProfile'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]); // Only run when user changes

  // Handle form input changes
  const handleInputChange = useCallback((field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the field being edited
    if (field === 'name' || field === 'phone') {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, []);

  // Validate phone number format
  const validatePhone = useCallback((phoneNumber: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phoneNumber);
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {
      name: '',
      phone: '',
    };

    if (!formValues.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (formValues.phone && !validatePhone(formValues.phone)) {
      newErrors.phone = t('invalidPhone');
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone;
  }, [formValues, validatePhone, t]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    if (!initialData) return false;
    
    return (
      formValues.name !== (initialData.name || '') ||
      formValues.phone !== (initialData.phone || '')
    );
  }, [formValues, initialData]);

  const handleSave = async () => {
    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    if (!validateForm()) {
      Alert.alert(t('error'), t('pleaseFixErrors'));
      return;
    }

    try {
      setSaving(true);
      
      // Only include changed fields
      const updatedProfile: Partial<User> = {};
      if (formValues.name !== initialData?.name) {
        updatedProfile.name = formValues.name.trim();
      }
      if (formValues.phone !== initialData?.phone) {
        updatedProfile.phone = formValues.phone.trim();
      }
      
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
        <BlurView intensity={10} tint={themeMode === 'dark' ? 'dark' : 'light'} style={styles.formBlur}>
          <View style={[styles.formContainer, { backgroundColor: currentColors.surface }]}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentColors.text.primary }]}>
                {t('fullName')} *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: currentColors.surface,
                    color: currentColors.text.primary,
                    borderColor: errors.name ? colors.error : currentColors.divider
                  }
                ]}
                value={formValues.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder={t('enterName')}
                placeholderTextColor={currentColors.text.secondary}
              />
              {errors.name ? (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.name}
                </Text>
              ) : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentColors.text.primary }]}>
                {t('email')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: currentColors.surface,
                    color: currentColors.text.primary
                  }
                ]}
                value={formValues.email}
                editable={false}
                placeholder={t('enterEmail')}
                placeholderTextColor={currentColors.text.secondary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentColors.text.primary }]}>
                {t('phoneNumber')} *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: currentColors.surface,
                    color: currentColors.text.primary,
                    borderColor: errors.phone ? colors.error : currentColors.divider
                  }
                ]}
                value={formValues.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder={t('enterPhone')}
                placeholderTextColor={currentColors.text.secondary}
                keyboardType="phone-pad"
              />
              {errors.phone ? (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.phone}
                </Text>
              ) : null}
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

      {saving && (
        <BlurView intensity={100} style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: currentColors.text.primary }]}>
            {t('saving')}
          </Text>
        </BlurView>
      )}
    </AppLayout>
  );
});

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
  formBlur: {
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 24,
  },
  formContainer: {
    borderRadius: 16,
    padding: 16,
  },
  inputContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  deleteButtonText: {
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
    borderRadius: 16,
    marginVertical: 8,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default EditProfileScreen; 