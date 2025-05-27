import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { testFirebaseConnection } from '../services/firestore';

export const FirebaseTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    try {
      setIsLoading(true);
      setTestResult('Testing Firebase connection...');
      
      const result = await testFirebaseConnection();
      
      if (result.success) {
        setTestResult('✅ Firebase is working correctly!');
      } else {
        setTestResult(`❌ Firebase test failed: ${result.message}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error?.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test Screen</Text>
      <Button 
        title={isLoading ? "Testing..." : "Test Firebase Connection"} 
        onPress={runTest}
        disabled={isLoading}
      />
      <Text style={styles.result}>{testResult}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
}); 