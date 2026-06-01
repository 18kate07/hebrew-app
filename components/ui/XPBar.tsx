import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../stores/useUserStore';

const XP_PER_LEVEL = 100;

export function XPBar() {
  const xp = useUserStore((s) => s.xp);
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const progress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Уровень {level}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpText}>{xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 13, color: '#777', marginBottom: 4 },
  track: {
    height: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 10,
  },
  xpText: { fontSize: 12, color: '#aaa', marginTop: 3, textAlign: 'right' },
});
