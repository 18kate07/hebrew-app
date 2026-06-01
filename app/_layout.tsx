import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../stores/useUserStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setUser, userId } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user.id, session.user.email ?? '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user.id, session.user.email ?? '');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!userId && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (userId && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [userId, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
