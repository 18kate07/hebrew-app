import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useNikud } from '../../hooks/useNikud';

const { width } = Dimensions.get('window');

interface Word {
  id: string;
  hebrew: string;
  transliteration: string;
  translation: string;
}

interface FlashCardProps {
  word: Word;
}

export function FlashCard({ word }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const rotation = useSharedValue(0);
  const { applyNikud } = useNikud();

  const flip = () => {
    rotation.value = withTiming(flipped ? 0 : 180, { duration: 400 });
    setFlipped(!flipped);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
  }));

  return (
    <TouchableOpacity onPress={flip} activeOpacity={0.9} style={styles.container}>
      <Animated.View style={[styles.card, styles.front, frontStyle]}>
        <Text style={styles.hebrew}>{applyNikud(word.hebrew)}</Text>
        <Text style={styles.transliteration}>{word.transliteration}</Text>
        <Text style={styles.hint}>Нажми, чтобы увидеть перевод</Text>
      </Animated.View>

      <Animated.View style={[styles.card, styles.back, backStyle]}>
        <Text style={styles.translation}>{word.translation}</Text>
        <Text style={styles.hebrewSmall}>{applyNikud(word.hebrew)}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 48,
    height: 220,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  front: {
    backgroundColor: '#fff',
  },
  back: {
    backgroundColor: '#58CC02',
  },
  hebrew: {
    fontSize: 52,
    fontWeight: '700',
    color: '#1D1D1D',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 18,
    color: '#777',
    marginTop: 8,
  },
  hint: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 16,
  },
  translation: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  hebrewSmall: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    writingDirection: 'rtl',
  },
});
