import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  FadeIn,
  FadeInDown,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

import ActionButton from '../components/ActionButton';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import AppLayout from '../components/layout/AppLayout';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const { width, height } = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'light' ? colors.light : colors.dark;
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Animation values
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const buttonScale = useSharedValue(1);
  
  // Error animations
  const nameErrorAnim = useSharedValue(0);
  const emailErrorAnim = useSharedValue(0);
  const phoneErrorAnim = useSharedValue(0);
  const passwordErrorAnim = useSharedValue(0);
  const confirmPasswordErrorAnim = useSharedValue(0);

  useEffect(() => {
    // Animate header elements
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withTiming(0, { duration: 800 });

    // Animate form elements with a slight delay
    setTimeout(() => {
      formOpacity.value = withTiming(1, { duration: 800 });
      formTranslateY.value = withTiming(0, { duration: 800 });
    }, 200);
  }, []);

  useEffect(() => {
    if (nameError) nameErrorAnim.value = withTiming(1, { duration: 300 });
    else nameErrorAnim.value = withTiming(0, { duration: 300 });
  }, [nameError]);

  useEffect(() => {
    if (emailError) emailErrorAnim.value = withTiming(1, { duration: 300 });
    else emailErrorAnim.value = withTiming(0, { duration: 300 });
  }, [emailError]);

  useEffect(() => {
    if (phoneError) phoneErrorAnim.value = withTiming(1, { duration: 300 });
    else phoneErrorAnim.value = withTiming(0, { duration: 300 });
  }, [phoneError]);

  useEffect(() => {
    if (passwordError) passwordErrorAnim.value = withTiming(1, { duration: 300 });
    else passwordErrorAnim.value = withTiming(0, { duration: 300 });
  }, [passwordError]);

  useEffect(() => {
    if (confirmPasswordError) confirmPasswordErrorAnim.value = withTiming(1, { duration: 300 });
    else confirmPasswordErrorAnim.value = withTiming(0, { duration: 300 });
  }, [confirmPasswordError]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const nameErrorAnimStyle = useAnimatedStyle(() => ({
    opacity: nameErrorAnim.value,
    height: interpolate(nameErrorAnim.value, [0, 1], [0, 20], Extrapolate.CLAMP),
    marginBottom: interpolate(nameErrorAnim.value, [0, 1], [0, 8], Extrapolate.CLAMP),
  }));

  const emailErrorAnimStyle = useAnimatedStyle(() => ({
    opacity: emailErrorAnim.value,
    height: interpolate(emailErrorAnim.value, [0, 1], [0, 20], Extrapolate.CLAMP),
    marginBottom: interpolate(emailErrorAnim.value, [0, 1], [0, 8], Extrapolate.CLAMP),
  }));

  const phoneErrorAnimStyle = useAnimatedStyle(() => ({
    opacity: phoneErrorAnim.value,
    height: interpolate(phoneErrorAnim.value, [0, 1], [0, 20], Extrapolate.CLAMP),
    marginBottom: interpolate(phoneErrorAnim.value, [0, 1], [0, 8], Extrapolate.CLAMP),
  }));

  const passwordErrorAnimStyle = useAnimatedStyle(() => ({
    opacity: passwordErrorAnim.value,
    height: interpolate(passwordErrorAnim.value, [0, 1], [0, 20], Extrapolate.CLAMP),
    marginBottom: interpolate(passwordErrorAnim.value, [0, 1], [0, 8], Extrapolate.CLAMP),
  }));

  const confirmPasswordErrorAnimStyle = useAnimatedStyle(() => ({
    opacity: confirmPasswordErrorAnim.value,
    height: interpolate(confirmPasswordErrorAnim.value, [0, 1], [0, 20], Extrapolate.CLAMP),
    marginBottom: interpolate(confirmPasswordErrorAnim.value, [0, 1], [0, 8], Extrapolate.CLAMP),
  }));

  const validateName = (name: string): boolean => {
    const isValid = name.trim().length >= 3;
    setNameError(isValid ? '' : t('nameLength'));
    return isValid;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : t('validEmail'));
    return isValid;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const isValid = phoneRegex.test(phone);
    setPhoneError(isValid ? '' : t('validPhone'));
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : t('passwordLength'));
    return isValid;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword;
    setConfirmPasswordError(isValid ? '' : t('passwordsMatch'));
    return isValid;
  };

  const handleRegister = () => {
    // Button press animation
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    
    // Validate inputs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        t('registrationSuccess'),
        t('accountCreated'),
        [
          {
            text: t('ok'),
            onPress: () => navigation.navigate('MainTabs')
          }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={currentColors.background}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: currentColors.background }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            {/* Top Right Back Button */}
            <Animated.View entering={FadeIn.delay(200).duration(500)}>
              <TouchableOpacity 
                style={styles.topBackButton}
                onPress={() => {
                  console.log('Top back button pressed - going to Onboarding');
                  navigation.navigate('Onboarding');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={28} color={currentColors.text.primary} />
              </TouchableOpacity>
            </Animated.View>
            
            {/* Header */}
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
              <Text style={[styles.title, { color: currentColors.text.primary }]}>{t('createAccount')}</Text>
              <Text style={[styles.subtitle, { color: currentColors.text.secondary }]}>{t('signUp')}</Text>
            </Animated.View>
            
            {/* Form */}
            <Animated.View style={[styles.form, formAnimatedStyle]}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentColors.text.primary }]}>{t('fullName')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: currentColors.surface,
                      borderColor: nameError ? currentColors.error : currentColors.divider,
                      color: currentColors.text.primary,
                      textAlign: isRTL ? 'right' : 'left'
                    }
                  ]}
                  placeholder={t('enterName')}
                  placeholderTextColor={currentColors.text.hint}
                  value={name}
                  onChangeText={setName}
                  onBlur={() => validateName(name)}
                  autoCapitalize="words"
                />
                <Animated.Text 
                  style={[
                    styles.errorText, 
                    { color: currentColors.error },
                    nameErrorAnimStyle
                  ]}
                >
                  {nameError}
                </Animated.Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentColors.text.primary }]}>{t('email')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: currentColors.surface,
                      borderColor: emailError ? currentColors.error : currentColors.divider,
                      color: currentColors.text.primary,
                      textAlign: isRTL ? 'right' : 'left'
                    }
                  ]}
                  placeholder={t('enterEmail')}
                  placeholderTextColor={currentColors.text.hint}
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => validateEmail(email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Animated.Text 
                  style={[
                    styles.errorText, 
                    { color: currentColors.error },
                    emailErrorAnimStyle
                  ]}
                >
                  {emailError}
                </Animated.Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentColors.text.primary }]}>{t('phoneNumber')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: currentColors.surface,
                      borderColor: phoneError ? currentColors.error : currentColors.divider,
                      color: currentColors.text.primary,
                      textAlign: isRTL ? 'right' : 'left'
                    }
                  ]}
                  placeholder={t('enterPhone')}
                  placeholderTextColor={currentColors.text.hint}
                  value={phone}
                  onChangeText={setPhone}
                  onBlur={() => validatePhone(phone)}
                  keyboardType="phone-pad"
                />
                <Animated.Text 
                  style={[
                    styles.errorText, 
                    { color: currentColors.error },
                    phoneErrorAnimStyle
                  ]}
                >
                  {phoneError}
                </Animated.Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentColors.text.primary }]}>{t('password')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: currentColors.surface,
                      borderColor: passwordError ? currentColors.error : currentColors.divider,
                      color: currentColors.text.primary,
                      textAlign: isRTL ? 'right' : 'left'
                    }
                  ]}
                  placeholder={t('enterPassword')}
                  placeholderTextColor={currentColors.text.hint}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => validatePassword(password)}
                  secureTextEntry
                />
                <Animated.Text 
                  style={[
                    styles.errorText, 
                    { color: currentColors.error },
                    passwordErrorAnimStyle
                  ]}
                >
                  {passwordError}
                </Animated.Text>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: currentColors.text.primary }]}>{t('confirmPassword')}</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: currentColors.surface,
                      borderColor: confirmPasswordError ? currentColors.error : currentColors.divider,
                      color: currentColors.text.primary,
                      textAlign: isRTL ? 'right' : 'left'
                    }
                  ]}
                  placeholder={t('confirmYourPassword')}
                  placeholderTextColor={currentColors.text.hint}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={() => validateConfirmPassword(password, confirmPassword)}
                  secureTextEntry
                />
                <Animated.Text 
                  style={[
                    styles.errorText, 
                    { color: currentColors.error },
                    confirmPasswordErrorAnimStyle
                  ]}
                >
                  {confirmPasswordError}
                </Animated.Text>
              </View>
              
              <Animated.View style={buttonAnimatedStyle}>
                <ActionButton
                  title={t('signUp')}
                  onPress={handleRegister}
                  isLoading={isLoading}
                  variant="primary"
                  style={styles.registerButton}
                />
              </Animated.View>
              
              <View style={[styles.loginLink, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.loginText, { color: currentColors.text.secondary, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }]}>
                  {t('alreadyHaveAccount')}
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.loginLinkText, { color: currentColors.accent }]}>
                    {t('signIn')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  topBackButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    zIndex: 10,
  },
  header: {
    marginTop: height * 0.05,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 12,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    marginRight: 4,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 