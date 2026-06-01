import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../stores/useUserStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { FlashCard } from '../../components/flashcard/FlashCard';
import { SRSControls } from '../../components/flashcard/SRSControls';
import { NikudToggle } from '../../components/ui/NikudToggle';
import type { Rating } from '../../lib/srs';

interface Word {
  id: string;
  hebrew: string;
  transliteration: string;
  translation: string;
}

export default function PracticeScreen() {
  const { userId, addXP } = useUserStore();
  const { loadProgress, getDueWords, reviewWord } = useProgressStore();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadProgress(userId).then(() => fetchDueWords());
  }, [userId]);

  const fetchDueWords = async () => {
    setLoading(true);
    const dueIds = getDueWords();

    if (dueIds.length === 0) {
      // load some new words instead
      const { data } = await supabase.from('words').select('*').limit(10);
      setWords(data ?? []);
    } else {
      const { data } = await supabase.from('words').select('*').in('id', dueIds.slice(0, 10));
      setWords(data ?? []);
    }
    setLoading(false);
  };

  const handleRate = async (rating: Rating) => {
    if (!userId || !words[currentIndex]) return;
    await reviewWord(userId, words[currentIndex].id, rating);
    if (rating > 0) addXP(rating === 2 ? 15 : 10);

    if (currentIndex + 1 >= words.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    );
  }

  if (sessionDone || words.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>Сессия завершена!</Text>
        <Text style={styles.doneSub}>Возвращайся завтра за новыми карточками</Text>
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => { setSessionDone(false); setCurrentIndex(0); fetchDueWords(); }}
        >
          <Text style={styles.restartText}>Ещё раз</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const word = words[currentIndex];
  const progress = (currentIndex + 1) / words.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.counter}>{currentIndex + 1} / {words.length}</Text>
        <NikudToggle />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.cardContainer}>
        <FlashCard word={word} />
      </View>

      <SRSControls onRate={handleRate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', padding: 24, paddingTop: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  counter: { fontSize: 16, fontWeight: '700', color: '#aaa' },
  progressTrack: { height: 8, backgroundColor: '#E5E5E5', borderRadius: 8, overflow: 'hidden', marginBottom: 40 },
  progressFill: { height: '100%', backgroundColor: '#58CC02', borderRadius: 8 },
  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  doneEmoji: { fontSize: 72, marginBottom: 16 },
  doneTitle: { fontSize: 28, fontWeight: '900', color: '#1D1D1D' },
  doneSub: { fontSize: 16, color: '#777', marginTop: 8, textAlign: 'center' },
  restartBtn: { marginTop: 32, backgroundColor: '#58CC02', borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  restartText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
