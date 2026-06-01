import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Rating } from '../../lib/srs';

interface SRSControlsProps {
  onRate: (rating: Rating) => void;
}

export function SRSControls({ onRate }: SRSControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.btn, styles.fail]} onPress={() => onRate(0)}>
        <Text style={styles.emoji}>😕</Text>
        <Text style={styles.label}>Снова</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.good]} onPress={() => onRate(1)}>
        <Text style={styles.emoji}>🙂</Text>
        <Text style={styles.label}>Хорошо</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.easy]} onPress={() => onRate(2)}>
        <Text style={styles.emoji}>😄</Text>
        <Text style={styles.label}>Легко</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  fail: { backgroundColor: '#FF4B4B' },
  good: { backgroundColor: '#1CB0F6' },
  easy: { backgroundColor: '#58CC02' },
  emoji: { fontSize: 24 },
  label: { fontSize: 13, color: '#fff', fontWeight: '700', marginTop: 4 },
});
