import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { generateQuiz } from '../../lib/ai';
import { QuizQuestion } from '../../components/lesson/QuizQuestion';
import { useUserStore } from '../../stores/useUserStore';
import type { QuizQuestion as QuizQuestionType } from '../../lib/ai';

const TOPICS = [
  { emoji: '🍎', label: 'Еда', topic: 'food' },
  { emoji: '🏠', label: 'Дом и быт', topic: 'home' },
  { emoji: '💼', label: 'Работа', topic: 'work' },
  { emoji: '❤️', label: 'Чувства', topic: 'emotions' },
  { emoji: '🕐', label: 'Время', topic: 'time' },
  { emoji: '🗣️', label: 'Глаголы', topic: 'common verbs' },
];

export default function LearnScreen() {
  const params = useLocalSearchParams<{ topic?: string }>();
  const { addXP } = useUserStore();

  const [selectedTopic, setSelectedTopic] = useState(params.topic ?? null);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const startLesson = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);
    setDone(false);
    setScore(0);
    setQuestionIndex(0);
    try {
      const qs = await generateQuiz(topic, 'intermediate');
      setQuestions(qs);
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    if (questionIndex + 1 >= questions.length) {
      const earned = (correct ? score + 1 : score) * 10;
      addXP(earned);
      setDone(true);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  if (!selectedTopic) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>📚 Уроки</Text>
        <Text style={styles.subtitle}>Выбери тему</Text>
        <View style={styles.grid}>
          {TOPICS.map((t) => (
            <TouchableOpacity key={t.topic} style={styles.topicCard} onPress={() => startLesson(t.topic)}>
              <Text style={styles.topicEmoji}>{t.emoji}</Text>
              <Text style={styles.topicLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#58CC02" />
        <Text style={styles.loadingText}>Подготавливаю урок...</Text>
      </View>
    );
  }

  if (done) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <View style={styles.center}>
        <Text style={styles.doneEmoji}>{pct >= 80 ? '🏆' : '📖'}</Text>
        <Text style={styles.doneTitle}>{pct >= 80 ? 'Отлично!' : 'Неплохо!'}</Text>
        <Text style={styles.doneScore}>{score} / {total} правильно</Text>
        <Text style={styles.xpEarned}>+{score * 10} XP</Text>
        <View style={styles.doneBtns}>
          <TouchableOpacity style={styles.retryBtn} onPress={() => startLesson(selectedTopic)}>
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedTopic(null)}>
            <Text style={styles.backText}>Другая тема</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneEmoji}>😕</Text>
        <Text style={styles.doneTitle}>Не удалось загрузить урок</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => setSelectedTopic(null)}>
          <Text style={styles.retryText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={() => setSelectedTopic(null)}>
          <Text style={styles.back}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.quizCounter}>{questionIndex + 1} / {questions.length}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((questionIndex + 1) / questions.length) * 100}%` }]} />
      </View>
      <QuizQuestion question={questions[questionIndex]} onAnswer={handleAnswer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 30, fontWeight: '900', color: '#1D1D1D', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#777', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  topicCard: {
    width: '46%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topicEmoji: { fontSize: 36 },
  topicLabel: { fontSize: 14, fontWeight: '700', color: '#1D1D1D', marginTop: 8 },
  loadingText: { fontSize: 16, color: '#777', marginTop: 16 },
  doneEmoji: { fontSize: 72, marginBottom: 16 },
  doneTitle: { fontSize: 28, fontWeight: '900', color: '#1D1D1D' },
  doneScore: { fontSize: 18, color: '#555', marginTop: 8 },
  xpEarned: { fontSize: 22, fontWeight: '800', color: '#58CC02', marginTop: 8 },
  doneBtns: { flexDirection: 'row', gap: 14, marginTop: 32 },
  retryBtn: { backgroundColor: '#58CC02', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  backBtn: { backgroundColor: '#F0F0F0', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  backText: { color: '#555', fontWeight: '700', fontSize: 15 },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  back: { fontSize: 16, color: '#1CB0F6', fontWeight: '700' },
  quizCounter: { fontSize: 15, color: '#aaa', fontWeight: '700' },
  progressTrack: { height: 8, backgroundColor: '#E5E5E5', marginHorizontal: 24, borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#58CC02', borderRadius: 8 },
});
