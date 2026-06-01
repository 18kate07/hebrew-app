import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../stores/useUserStore';

export function StreakBadge() {
  const streak = useUserStore((s) => s.streak);

  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  fire: { fontSize: 18 },
  count: { fontSize: 16, fontWeight: '800', color: '#FF9600', marginLeft: 4 },
});
