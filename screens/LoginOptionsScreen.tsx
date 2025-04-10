import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ActionButton from '../components/ActionButton';
import { RootStackParamList } from '../types';
import theme from '../theme/theme';

type LoginOptionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginOptions'>;

const LoginOptionsScreen: React.FC = () => {
  const navigation = useNavigation<LoginOptionsScreenNavigationProp>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Logo_With_Border.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Ready to get started?</Text>
          <Text style={styles.subtitle}>
            Create an account to save your favorite parking locations and manage your reservations.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <ActionButton
            title="Login"
            onPress={handleLogin}
            style={styles.button}
          />
          
          <ActionButton
            title="Register"
            onPress={handleRegister}
            variant="outline"
            style={styles.button}
          />
          
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip and continue as guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop: theme.spacing.xl,
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing.lg,
    height: 54,
  },
  skipButton: {
    paddingVertical: theme.spacing.md,
  },
  skipText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
});

export default LoginOptionsScreen; 