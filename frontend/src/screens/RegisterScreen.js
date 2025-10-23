import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { TextInput, Button, Text, Title, HelperText, Provider as PaperProvider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Gradient Header */}
          <Animatable.View animation="fadeInDown" duration={900} style={styles.header}>
            <Title style={styles.title}>Create Your Account</Title>
            <Text style={styles.subtitle}>Join and enjoy the best shopping experience!</Text>
          </Animatable.View>

          {/* Form Container */}
          <Animatable.View animation="fadeInUp" duration={1000} style={styles.formContainer}>
            <TextInput
              label="Full Name *"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              mode="outlined"
              style={styles.input}
              theme={customTheme}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              theme={customTheme}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Password *"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              theme={customTheme}
              left={<TextInput.Icon icon="lock" />}
            />

            <TextInput
              label="Confirm Password *"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              theme={customTheme}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              left={<TextInput.Icon icon="lock-check" />}
            />

            <TextInput
              label="Address (Optional)"
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={2}
              theme={customTheme}
              left={<TextInput.Icon icon="map-marker" />}
            />

            <TextInput
              label="Phone (Optional)"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              theme={customTheme}
              left={<TextInput.Icon icon="phone" />}
            />

            {error ? (
              <HelperText type="error" visible={true} style={styles.error}>
                {error}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
              theme={customTheme}
            >
              Register
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
              labelStyle={{ color: '#D32F2F', fontWeight: 'bold' }}
            >
              Already have an account? Login
            </Button>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

// Custom Theme
const customTheme = {
  colors: {
    primary: '#D32F2F',
    background: '#FFF8E1',
    surface: '#FFFFFF',
    text: '#212121',
    placeholder: '#757575',
  },
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 30,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFE0B2',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 10,
  },
  error: {
    fontSize: 14,
    color: 'red',
  },
});
