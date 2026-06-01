import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    const { error: e } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (e) {
      setError(e.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>✉️</Text>
        <Text style={styles.title}>Проверь почту</Text>
        <Text style={styles.subtitle}>Мы отправили письмо подтверждения на {email}</Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Войти</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>🇮🇱</Text>
      <Text style={styles.title}>Создай аккаунт</Text>
      <Text style={styles.subtitle}>Начни учить иврит сегодня</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль (минимум 6 символов)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Зарегистрироваться</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkBtn}>
            <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '900', color: '#1D1D1D' },
  subtitle: { fontSize: 16, color: '#777', marginBottom: 32, textAlign: 'center' },
  form: { width: '100%', gap: 14 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#1D1D1D',
  },
  error: { color: '#FF4B4B', fontSize: 14, textAlign: 'center' },
  btn: {
    backgroundColor: '#58CC02',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  linkBtn: { alignItems: 'center', marginTop: 8 },
  linkText: { color: '#1CB0F6', fontSize: 15 },
});
