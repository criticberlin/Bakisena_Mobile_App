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
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

import ActionButton from '../components/ActionButton';
import { RootStackParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';
import { MOCK_USERS } from '../constants/mockData';
import theme from '../theme/theme';

const { width, height } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { themeMode, colors } = useTheme();

  // Get current theme colors
  const currentColors = themeMode === 'dark' ? colors.dark : colors.light;

  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleLogin = () => {
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Check if user exists in mock data
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // In a real app, you would verify the password hash here
        setIsLoading(false);
        
        // Navigate to MainTabs for all users
        navigation.navigate('MainTabs');
      } else {
        setIsLoading(false);
        Alert.alert(t('loginFailed'), t('invalidCredentials'));
      }
    }, 1500);
  };

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
        >
          <View style={styles.container}>
            {/* Top Right Back Button */}
            <AnimatedTouchableOpacity 
              style={styles.topBackButton}
              onPress={() => navigation.navigate('Onboarding')}
              entering={FadeIn.delay(300).duration(500)}
            >
              <Ionicons name="close-outline" size={28} color={currentColors.text.secondary} />
            </AnimatedTouchableOpacity>
            
            {/* App Logo */}
            <Animated.View 
              style={[styles.logoContainer, logoAnimatedStyle]}
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
            >
              <Text style={[styles.title, { color: currentColors.text.primary }]}>
                {t('welcomeBack')}
              </Text>
              <Text style={[styles.subtitle, { color: currentColors.text.secondary }]}>
                {t('signIn')}
              </Text>
            </Animated.View>
            
            {/* Form */}
            <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
              <BlurView 
                intensity={themeMode === 'dark' ? 20 : 10} 
                tint={themeMode === 'dark' ? "dark" : "light"} 
                style={styles.formBlur}
              >
                <View style={[
                  styles.form, 
                  { backgroundColor: themeMode === 'dark' ? 'rgba(40, 40, 82, 0.7)' : 'rgba(255, 255, 255, 0.7)' }
                ]}>
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputRow, { 
                      borderColor: emailError ? colors.error : currentColors.divider,
                      backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      flexDirection: isRTL ? 'row-reverse' : 'row'
                    }]}>
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={emailError ? colors.error : colors.accent} 
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
                        onBlur={() => validateEmail(email)}
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
                  
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputRow, { 
                      borderColor: passwordError ? colors.error : currentColors.divider,
                      backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      flexDirection: isRTL ? 'row-reverse' : 'row'
                    }]}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={passwordError ? colors.error : colors.accent} 
                        style={[styles.inputIcon, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]} 
                      />
                      <TextInput
                        style={[styles.input, { color: currentColors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                        placeholder={t('password')}
                        placeholderTextColor={currentColors.text.hint}
                        value={password}
                        onChangeText={setPassword}
                        onBlur={() => validatePassword(password)}
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
                          color={currentColors.text.secondary} 
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
                  
                  <TouchableOpacity 
                    style={[styles.forgotPasswordContainer, { alignSelf: isRTL ? 'flex-start' : 'flex-end' }]}
                    onPress={() => navigation.navigate('ForgotPassword')}
                  >
                    <Text style={[styles.forgotPasswordText, { color: colors.accent }]}>
                      {t('forgotPassword')}
                    </Text>
                  </TouchableOpacity>
                  
                  <ActionButton
                    title={t('login')}
                    onPress={handleLogin}
                    isLoading={isLoading}
                    style={styles.loginButton}
                    size="large"
                    icon={<Ionicons name="log-in-outline" size={20} color="white" />}
                  />
                </View>
              </BlurView>
            </Animated.View>
            
            {/* Register Link */}
            <Animated.View 
              style={[
                styles.registerContainer, 
                { flexDirection: isRTL ? 'row-reverse' : 'row' }
              ]}
              entering={FadeInUp.delay(600).duration(500)}
            >
              <Text style={[styles.registerText, { color: currentColors.text.secondary }]}>
                {t('noAccount')} 
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.registerLink, { color: colors.accent }]}>
                  {t('signUp')}
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
    marginBottom: theme.spacing[6],
  },
  logo: {
    width: 180,
    height: 180,
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
  forgotPasswordContainer: {
    marginBottom: theme.spacing[6],
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: theme.borders.radius.lg,
    ...theme.shadows.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing[6],
  },
  registerText: {
    fontSize: theme.typography.fontSize.md,
  },
  registerLink: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
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

export default LoginScreen; 