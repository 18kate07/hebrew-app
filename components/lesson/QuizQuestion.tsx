import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { QuizQuestion as QuizQuestionType } from '../../lib/ai';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (correct: boolean) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => onAnswer(index === question.correctIndex), 1000);
  };

  const getOptionStyle = (index: number) => {
    if (selected === null) return styles.option;
    if (index === question.correctIndex) return [styles.option, styles.correct];
    if (index === selected) return [styles.option, styles.wrong];
    return [styles.option, styles.dim];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>
      <View style={styles.options}>
        {question.options.map((opt, i) => (
          <TouchableOpacity key={i} style={getOptionStyle(i)} onPress={() => handleSelect(i)}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1D',
    marginBottom: 24,
    lineHeight: 28,
  },
  options: { gap: 12 },
  option: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  correct: { backgroundColor: '#D7F7C2', borderColor: '#58CC02' },
  wrong: { backgroundColor: '#FFE5E5', borderColor: '#FF4B4B' },
  dim: { opacity: 0.4 },
  optionText: { fontSize: 16, color: '#1D1D1D', fontWeight: '600' },
});
