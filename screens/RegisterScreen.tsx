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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import ActionButton from '../components/ActionButton';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
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

  const validateName = (name: string): boolean => {
    const isValid = name.trim().length >= 3;
    setNameError(isValid ? '' : 'Name must be at least 3 characters long');
    return isValid;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const isValid = phoneRegex.test(phone);
    setPhoneError(isValid ? '' : 'Please enter a valid phone number');
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : 'Password must be at least 6 characters');
    return isValid;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword;
    setConfirmPasswordError(isValid ? '' : 'Passwords do not match');
    return isValid;
  };

  const handleRegister = () => {
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
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs')
          }
        ]
      );
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
            {/* Top Right Back Button */}
            <TouchableOpacity 
              style={styles.topBackButton}
              onPress={() => {
                console.log('Top back button pressed - going to Onboarding');
                navigation.navigate('Onboarding');
              }}
            >
              <Ionicons name="close-outline" size={28} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to start using the app</Text>
            </View>
            
            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[styles.input, nameError ? styles.inputError : null]}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  onBlur={() => validateName(name)}
                  autoCapitalize="words"
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => validateEmail(email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[styles.input, phoneError ? styles.inputError : null]}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  onBlur={() => validatePhone(phone)}
                  keyboardType="phone-pad"
                />
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[styles.input, passwordError ? styles.inputError : null]}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => validatePassword(password)}
                  secureTextEntry
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={() => validateConfirmPassword(password, confirmPassword)}
                  secureTextEntry
                />
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>
              
              <ActionButton
                title="Register"
                onPress={handleRegister}
                isLoading={isLoading}
                style={styles.registerButton}
              />
            </View>
            
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity 
                style={styles.loginTouchable}
                onPress={() => {
                  console.log('Login button pressed');
                  // Use a timeout to ensure the press is registered
                  setTimeout(() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                  }, 100);
                }}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
            
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back</Text>
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
  },
  container: {
    padding: theme.spacing.lg,
    position: 'relative',
  },
  topBackButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.sm,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    height: 50,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  registerButton: {
    height: 50,
    marginTop: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  loginLink: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loginTouchable: {
    padding: theme.spacing.sm,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
});

export default RegisterScreen; 