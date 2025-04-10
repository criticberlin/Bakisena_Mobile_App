import React, { useState } from 'react';
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
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import ActionButton from '../components/ActionButton';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';
import { MOCK_USERS } from '../constants/mockData';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : 'Password must be at least 6 characters');
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
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* App Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/Logo_Only.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>bakisena</Text>
            </View>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>
            
            {/* Form */}
            <BlurView intensity={10} tint="dark" style={styles.formBlur}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputRow}>
                    <Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, emailError ? styles.inputError : null]}
                      placeholder="Enter your email"
                      placeholderTextColor={theme.colors.text.hint}
                      value={email}
                      onChangeText={setEmail}
                      onBlur={() => validateEmail(email)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, passwordError ? styles.inputError : null]}
                      placeholder="Enter your password"
                      placeholderTextColor={theme.colors.text.hint}
                      value={password}
                      onChangeText={setPassword}
                      onBlur={() => validatePassword(password)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon} 
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color={theme.colors.text.secondary} 
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>
                
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                
                <ActionButton
                  title="Login"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  style={styles.loginButton}
                  size="large"
                />
              </View>
            </BlurView>
            
            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
            
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Ionicons name="arrow-back-outline" size={20} color={theme.colors.accent} style={styles.backIcon} />
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: theme.spacing['5'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['8'],
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: theme.spacing['2'],
  },
  appName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.accent,
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: theme.spacing['8'],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing['2'],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  formBlur: {
    overflow: 'hidden',
    borderRadius: theme.borders.radius['2xl'],
    marginBottom: theme.spacing['6'],
  },
  form: {
    backgroundColor: 'rgba(42, 42, 79, 0.8)',
    borderRadius: theme.borders.radius['2xl'],
    padding: theme.spacing['6'],
  },
  inputContainer: {
    marginBottom: theme.spacing['4'],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.borders.radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: theme.spacing['4'],
    height: 56,
  },
  inputIcon: {
    marginRight: theme.spacing['3'],
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    height: '100%',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing['2'],
    marginLeft: theme.spacing['4'],
  },
  eyeIcon: {
    padding: theme.spacing['2'],
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing['6'],
    marginTop: theme.spacing['2'],
  },
  forgotPasswordText: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.spacing['6'],
  },
  registerText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
  },
  registerLink: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['3'],
  },
  backIcon: {
    marginRight: theme.spacing['2'],
  },
  backButtonText: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500',
  },
});

export default LoginScreen; 