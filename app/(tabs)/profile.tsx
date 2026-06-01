import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useUserStore } from '../../stores/useUserStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { XPBar } from '../../components/ui/XPBar';
import { StreakBadge } from '../../components/ui/StreakBadge';

export default function ProfileScreen() {
  const { email, xp, streak, showNikud, toggleNikud, signOut } = useUserStore();
  const { wordProgress } = useProgressStore();

  const totalWords = Object.keys(wordProgress).length;
  const masteredWords = Object.values(wordProgress).filter((w) => w.repetitions >= 5).length;
  const level = Math.floor(xp / 100) + 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>👤 Профиль</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{level}</Text>
          <Text style={styles.statLabel}>Уровень</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{xp}</Text>
          <Text style={styles.statLabel}>XP всего</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>🔥 Дней</Text>
        </View>
      </View>

      <XPBar />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Словарный запас</Text>
        <View style={styles.wordsRow}>
          <View style={styles.wordStat}>
            <Text style={styles.wordStatValue}>{totalWords}</Text>
            <Text style={styles.wordStatLabel}>Изучено слов</Text>
          </View>
          <View style={styles.wordStat}>
            <Text style={styles.wordStatValue}>{masteredWords}</Text>
            <Text style={styles.wordStatLabel}>Усвоено</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>

        <View style={styles.setting}>
          <View>
            <Text style={styles.settingLabel}>Огласовки (никуд)</Text>
            <Text style={styles.settingDesc}>Показывать знаки огласовки в словах</Text>
          </View>
          <Switch
            value={showNikud}
            onValueChange={toggleNikud}
            trackColor={{ false: '#E5E5E5', true: '#58CC02' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: '900', color: '#1D1D1D' },
  email: { fontSize: 15, color: '#aaa', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 26, fontWeight: '900', color: '#1D1D1D' },
  statLabel: { fontSize: 12, color: '#aaa', marginTop: 4, fontWeight: '600' },
  section: { marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1D1D1D', marginBottom: 14 },
  wordsRow: { flexDirection: 'row', gap: 12 },
  wordStat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  wordStatValue: { fontSize: 32, fontWeight: '900', color: '#58CC02' },
  wordStatLabel: { fontSize: 13, color: '#777', marginTop: 4, fontWeight: '600' },
  setting: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  settingLabel: { fontSize: 16, fontWeight: '700', color: '#1D1D1D' },
  settingDesc: { fontSize: 13, color: '#aaa', marginTop: 2 },
  signOutBtn: {
    marginTop: 36,
    borderWidth: 2,
    borderColor: '#FF4B4B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  signOutText: { color: '#FF4B4B', fontSize: 16, fontWeight: '800' },
});
