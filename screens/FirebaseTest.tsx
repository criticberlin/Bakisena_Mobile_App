import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { createAdminUser } from '../services/auth';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../constants/translations/LanguageContext';

export const FirebaseTest = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [email, setEmail] = useState('admin@bakisena.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('Admin User');
  const [message, setMessage] = useState('');

  const handleCreateAdmin = async () => {
    try {
      const { user, error } = await createAdminUser(email, password, name);
      if (error) {
        setMessage(`Error: ${error}`);
      } else {
        setMessage('Admin account created successfully!');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.toString() }]}>
      <Text style={[styles.title, { color: colors.text.toString() }]}>Create Admin Account</Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface.toString(), color: colors.text.toString() }]}
        placeholder="Name"
        placeholderTextColor={colors.text.toString() + '80'}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface.toString(), color: colors.text.toString() }]}
        placeholder="Email"
        placeholderTextColor={colors.text.toString() + '80'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface.toString(), color: colors.text.toString() }]}
        placeholder="Password"
        placeholderTextColor={colors.text.toString() + '80'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent.toString() }]}
        onPress={handleCreateAdmin}
      >
        <Text style={[styles.buttonText, { color: colors.primary.toString() }]}>
          Create Admin Account
        </Text>
      </TouchableOpacity>
      
      {message ? (
        <Text style={[styles.message, { color: message.includes('Error') ? colors.error.toString() : colors.success.toString() }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
}); 