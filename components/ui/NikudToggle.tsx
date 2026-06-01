import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../stores/useUserStore';

export function NikudToggle() {
  const { showNikud, toggleNikud } = useUserStore();

  return (
    <TouchableOpacity style={[styles.btn, showNikud && styles.active]} onPress={toggleNikud}>
      <Text style={[styles.text, showNikud && styles.activeText]}>
        {showNikud ? 'נִקּוּד ✓' : 'נקוד ✗'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#58CC02',
  },
  active: {
    backgroundColor: '#58CC02',
  },
  text: {
    fontSize: 15,
    color: '#58CC02',
    fontWeight: '700',
  },
  activeText: {
    color: '#fff',
  },
});
