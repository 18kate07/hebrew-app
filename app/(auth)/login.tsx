import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (e) setError(e.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>🇮🇱</Text>
      <Text style={styles.title}>Учи иврит</Text>
      <Text style={styles.subtitle}>Войди в аккаунт</Text>

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
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Войти</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.linkBtn}>
            <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
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
  subtitle: { fontSize: 16, color: '#777', marginBottom: 32 },
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
