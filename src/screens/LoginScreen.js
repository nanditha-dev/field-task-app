import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { user, signIn } = useContext(AuthContext);
  const { colors } = useTheme();

  useEffect(() => {
    if (user) {
      navigation.replace('TaskList');
    }
  }, [user, navigation]);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    signIn(email);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          { backgroundColor: colors.inputBg || colors.card, borderColor: colors.border, color: colors.text },
        ]}
        placeholderTextColor={colors.mutedText || '#AFB2BF'}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <TouchableOpacity onPress={handleLogin} style={[styles.buttonStyle, { backgroundColor: colors.primary || '#3B63A8' }]}>
        <Text style={{ color: '#FFF', fontWeight: '600' }}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1, 
    padding: 12,
    marginBottom: 20, 
    borderRadius: 8,
  },
  buttonStyle:{
    justifyContent:'center',
    alignItems:'center',
    padding:14,
    borderRadius:10,
  }
});