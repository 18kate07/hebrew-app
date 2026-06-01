import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../stores/useUserStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { XPBar } from '../../components/ui/XPBar';

export default function DashboardScreen() {
  const router = useRouter();
  const { userId, email } = useUserStore();
  const { loadProgress, getDueWords } = useProgressStore();

  useEffect(() => {
    if (userId) loadProgress(userId);
  }, [userId]);

  const dueCount = getDueWords().length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Шалом! 👋</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <StreakBadge />
      </View>

      <XPBar />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сегодня</Text>

        <TouchableOpacity
          style={[styles.card, styles.cardGreen]}
          onPress={() => router.push('/(tabs)/practice')}
        >
          <Text style={styles.cardEmoji}>🃏</Text>
          <View>
            <Text style={styles.cardTitle}>Повторение</Text>
            <Text style={styles.cardSub}>
              {dueCount > 0 ? `${dueCount} карточек ждут` : 'Всё повторено!'}
            </Text>
          </View>
          {dueCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{dueCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardBlue]}
          onPress={() => router.push('/(tabs)/learn')}
        >
          <Text style={styles.cardEmoji}>📚</Text>
          <View>
            <Text style={styles.cardTitle}>Новый урок</Text>
            <Text style={styles.cardSub}>Продолжи обучение</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Быстрый старт</Text>
        <View style={styles.quickRow}>
          {QUICK_TOPICS.map((t) => (
            <TouchableOpacity
              key={t.label}
              style={styles.quickCard}
              onPress={() => router.push({ pathname: '/(tabs)/learn', params: { topic: t.topic } })}
            >
              <Text style={styles.quickEmoji}>{t.emoji}</Text>
              <Text style={styles.quickLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const QUICK_TOPICS = [
  { emoji: '🍎', label: 'Еда', topic: 'food' },
  { emoji: '🏠', label: 'Дом', topic: 'home' },
  { emoji: '💼', label: 'Работа', topic: 'work' },
  { emoji: '❤️', label: 'Чувства', topic: 'emotions' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { padding: 24, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 50,
  },
  greeting: { fontSize: 28, fontWeight: '900', color: '#1D1D1D' },
  email: { fontSize: 14, color: '#aaa', marginTop: 2 },
  section: { marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1D1D1D', marginBottom: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    marginBottom: 12,
    gap: 16,
  },
  cardGreen: { backgroundColor: '#D7F7C2' },
  cardBlue: { backgroundColor: '#D6F0FF' },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#1D1D1D' },
  cardSub: { fontSize: 13, color: '#555', marginTop: 2 },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#FF9600',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  quickRow: { flexDirection: 'row', gap: 12 },
  quickCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickEmoji: { fontSize: 28 },
  quickLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginTop: 6 },
});
