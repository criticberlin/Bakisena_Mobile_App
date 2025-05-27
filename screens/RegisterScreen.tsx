import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay
} from 'react-native-reanimated';

import { useAuth } from '../components/AuthContext';
import { RootStackParamList } from '../types';
import LoadingScreen from '../components/LoadingScreen';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import theme from '../theme/theme';
import ActionButton from '../components/ActionButton';

const { width, height } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const { themeMode, colors } = useTheme();
  
  // Get current theme colors
  const currentColors = themeMode === 'dark' ? colors.dark : colors.light;
  
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  
  // Set up animations
  useEffect(() => {
    const animationDelay = 300;
    
    logoOpacity.value = withDelay(animationDelay, 
      withTiming(1, { duration: 800 })
    );
    
    logoScale.value = withDelay(animationDelay, 
      withTiming(1, { duration: 800 })
    );
    
    formOpacity.value = withDelay(animationDelay + 200, 
      withTiming(1, { duration: 600 })
    );
    
    formTranslateY.value = withDelay(animationDelay + 200, 
      withTiming(0, { duration: 600 })
    );
  }, []);
  
  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));
  
  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }]
  }));
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : t('validEmail'));
    return isValid;
  };
  
  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : t('passwordLength'));
    return isValid;
  };
  
  const validateConfirmPassword = (confirmPassword: string): boolean => {
    const isValid = confirmPassword === password;
    setConfirmPasswordError(isValid ? '' : t('passwordsMatch'));
    return isValid;
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    console.log('Register button pressed');
    setLoading(true);
    try {
      console.log('Calling register function');
      const { error } = await register(email, password);
      console.log('Register response:', error ? 'Error' : 'Success');
      if (error) {
        console.error('Registration error:', error);
        if (error.includes('email-already-in-use')) {
          Alert.alert('Registration Failed', 'This email is already registered. Please try logging in instead.');
        } else {
          Alert.alert('Registration Failed', error);
        }
      } else {
        console.log('Registration successful, navigating to MainTabs');
        navigation.navigate('MainTabs');
      }
    } catch (error: any) {
      console.error('Unexpected registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Top Right Back Button */}
            <AnimatedTouchableOpacity 
              style={styles.topBackButton}
              onPress={() => navigation.navigate('Login')}
              entering={FadeIn.delay(300).duration(500)}
            >
              <Ionicons name="close-outline" size={28} color={currentColors.text.secondary} />
            </AnimatedTouchableOpacity>
            
            {/* App Logo */}
            <Animated.View 
              style={[styles.logoContainer, logoAnimatedStyle]}
              entering={FadeInDown.duration(800).delay(200)}
            >
              <Image 
                source={require('../assets/images/Logo_With_Border.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
            
            {/* Header */}
            <Animated.View 
              style={[styles.header, logoAnimatedStyle]}
              entering={FadeInDown.duration(800).delay(300)}
            >
              <Text style={[styles.title, { color: currentColors.text.primary }]}>
                {t('createAccount')}
              </Text>
              <Text style={[styles.subtitle, { color: currentColors.text.secondary }]}>
                {t('signUp')}
              </Text>
            </Animated.View>
            
            {/* Form */}
            <Animated.View 
              style={[styles.formContainer, formAnimatedStyle]}
              entering={FadeInUp.duration(800).delay(400)}
            >
              <BlurView 
                intensity={themeMode === 'dark' ? 20 : 10} 
                tint={themeMode === 'dark' ? "dark" : "light"} 
                style={styles.formBlur}
              >
                <View style={[
                  styles.form, 
                  { 
                    backgroundColor: themeMode === 'dark' 
                      ? 'rgba(40, 40, 82, 0.75)' 
                      : 'rgba(255, 255, 255, 0.75)' 
                  }
                ]}>
                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <View style={[
                      styles.inputRow, 
                      { 
                        borderColor: emailError 
                          ? colors.error 
                          : focusedInput === 'email' 
                            ? colors.accent 
                            : currentColors.divider,
                        backgroundColor: themeMode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        transform: [{ scale: focusedInput === 'email' ? 1.02 : 1 }]
                      }
                    ]}>
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={emailError 
                          ? colors.error 
                          : focusedInput === 'email' 
                            ? colors.accent 
                            : currentColors.text.secondary
                        } 
                        style={[styles.inputIcon, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]} 
                      />
                      <TextInput
                        style={[
                          styles.input, 
                          { 
                            color: currentColors.text.primary, 
                            textAlign: isRTL ? 'right' : 'left' 
                          }
                        ]}
                        placeholder={t('email')}
                        placeholderTextColor={currentColors.text.hint}
                        value={email}
                        onChangeText={setEmail}
                        onBlur={() => {
                          validateEmail(email);
                          setFocusedInput(null);
                        }}
                        onFocus={() => setFocusedInput('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {emailError ? (
                      <Animated.Text 
                        style={[styles.errorText, { color: colors.error }]}
                        entering={FadeIn.duration(200)}
                      >
                        {emailError}
                      </Animated.Text>
                    ) : null}
                  </View>
                  
                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={[
                      styles.inputRow, 
                      { 
                        borderColor: passwordError 
                          ? colors.error 
                          : focusedInput === 'password' 
                            ? colors.accent 
                            : currentColors.divider,
                        backgroundColor: themeMode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        transform: [{ scale: focusedInput === 'password' ? 1.02 : 1 }]
                      }
                    ]}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={passwordError 
                          ? colors.error 
                          : focusedInput === 'password' 
                            ? colors.accent 
                            : currentColors.text.secondary
                        } 
                        style={[styles.inputIcon, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]} 
                      />
                      <TextInput
                        style={[
                          styles.input, 
                          { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }
                        ]}
                        placeholder={t('password')}
                        placeholderTextColor={currentColors.text.hint}
                        value={password}
                        onChangeText={setPassword}
                        onBlur={() => {
                          validatePassword(password);
                          setFocusedInput(null);
                        }}
                        onFocus={() => setFocusedInput('password')}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity 
                        style={styles.eyeIcon} 
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color={focusedInput === 'password' 
                            ? colors.accent 
                            : currentColors.text.secondary
                          } 
                        />
                      </TouchableOpacity>
                    </View>
                    {passwordError ? (
                      <Animated.Text 
                        style={[styles.errorText, { color: colors.error }]}
                        entering={FadeIn.duration(200)}
                      >
                        {passwordError}
                      </Animated.Text>
                    ) : null}
                  </View>
                  
                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={[
                      styles.inputRow, 
                      { 
                        borderColor: confirmPasswordError 
                          ? colors.error 
                          : focusedInput === 'confirmPassword' 
                            ? colors.accent 
                            : currentColors.divider,
                        backgroundColor: themeMode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        transform: [{ scale: focusedInput === 'confirmPassword' ? 1.02 : 1 }]
                      }
                    ]}>
                      <Ionicons 
                        name="shield-checkmark-outline" 
                        size={20} 
                        color={confirmPasswordError 
                          ? colors.error 
                          : focusedInput === 'confirmPassword' 
                            ? colors.accent 
                            : currentColors.text.secondary
                        } 
                        style={[styles.inputIcon, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]} 
                      />
                      <TextInput
                        style={[
                          styles.input, 
                          { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }
                        ]}
                        placeholder={t('confirmPassword')}
                        placeholderTextColor={currentColors.text.hint}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onBlur={() => {
                          validateConfirmPassword(confirmPassword);
                          setFocusedInput(null);
                        }}
                        onFocus={() => setFocusedInput('confirmPassword')}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity 
                        style={styles.eyeIcon} 
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons 
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color={focusedInput === 'confirmPassword' 
                            ? colors.accent 
                            : currentColors.text.secondary
                          } 
                        />
                      </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? (
                      <Animated.Text 
                        style={[styles.errorText, { color: colors.error }]}
                        entering={FadeIn.duration(200)}
                      >
                        {confirmPasswordError}
                      </Animated.Text>
                    ) : null}
                  </View>
                  
                  <Animated.View
                    entering={FadeInUp.duration(800).delay(500)}
                  >
                    <ActionButton
                      title={t('signUp')}
                      onPress={handleRegister}
                      isLoading={loading}
                      style={styles.registerButton}
                      size="large"
                      icon={<Ionicons name="person-add-outline" size={20} color="white" />}
                    />
                  </Animated.View>
                </View>
              </BlurView>
            </Animated.View>
            
            {/* Login Link */}
            <Animated.View 
              style={[
                styles.loginContainer, 
                { flexDirection: isRTL ? 'row-reverse' : 'row' }
              ]}
              entering={FadeInUp.delay(600).duration(500)}
            >
              <Text style={[styles.loginText, { color: currentColors.text.secondary }]}>
                {t('haveAccount')} 
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: colors.accent }]}>
                  {t('signIn')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Back Button */}
            <AnimatedTouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('MainTabs')}
              entering={FadeInUp.delay(700).duration(500)}
            >
              <Ionicons 
                name={isRTL ? "arrow-forward-outline" : "arrow-back-outline"} 
                size={20} 
                color={colors.accent} 
                style={styles.backIcon} 
              />
              <Text style={[styles.backButtonText, { color: colors.accent }]}>
                {t('backToHome')}
              </Text>
            </AnimatedTouchableOpacity>
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
    justifyContent: 'center',
  },
  container: {
    padding: theme.spacing[6],
    position: 'relative',
  },
  topBackButton: {
    position: 'absolute',
    top: theme.spacing[4],
    right: theme.spacing[6],
    zIndex: 10,
    padding: theme.spacing[2],
    borderRadius: theme.borders.radius.full,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  logo: {
    width: 150,
    height: 150,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700',
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    borderRadius: theme.borders.radius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  formBlur: {
    borderRadius: theme.borders.radius.xl,
    overflow: 'hidden',
  },
  form: {
    padding: theme.spacing[6],
    borderRadius: theme.borders.radius.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing[4],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borders.radius.lg,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: theme.spacing[4],
  },
  inputIcon: {
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    height: '100%',
  },
  eyeIcon: {
    padding: theme.spacing[2],
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing[1],
    marginLeft: theme.spacing[4],
  },
  registerButton: {
    width: '100%',
    height: 56,
    borderRadius: theme.borders.radius.lg,
    ...theme.shadows.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing[6],
  },
  loginText: {
    fontSize: theme.typography.fontSize.md,
    marginRight: 4,
  },
  loginLink: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    marginLeft: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
  },
  backIcon: {
    marginRight: theme.spacing[1],
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
});

export default RegisterScreen; 