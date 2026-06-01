import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { reviewCard, initialCard, type Rating, type SRSCard } from '../lib/srs';

export interface WordProgress extends SRSCard {
  wordId: string;
}

interface ProgressState {
  wordProgress: Record<string, WordProgress>;
  loadProgress: (userId: string) => Promise<void>;
  reviewWord: (userId: string, wordId: string, rating: Rating) => Promise<void>;
  getDueWords: () => string[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  wordProgress: {},

  loadProgress: async (userId) => {
    const { data } = await supabase
      .from('user_words')
      .select('*')
      .eq('user_id', userId);

    if (!data) return;

    const progress: Record<string, WordProgress> = {};
    for (const row of data) {
      progress[row.word_id] = {
        wordId: row.word_id,
        interval: row.interval,
        easeFactor: row.ease_factor,
        repetitions: row.repetitions,
        nextReview: new Date(row.next_review),
      };
    }
    set({ wordProgress: progress });
  },

  reviewWord: async (userId, wordId, rating) => {
    const current = get().wordProgress[wordId] ?? { ...initialCard(), wordId };
    const updated = reviewCard(current, rating);

    set((s) => ({
      wordProgress: {
        ...s.wordProgress,
        [wordId]: { ...updated, wordId },
      },
    }));

    await supabase.from('user_words').upsert({
      user_id: userId,
      word_id: wordId,
      interval: updated.interval,
      ease_factor: updated.easeFactor,
      repetitions: updated.repetitions,
      next_review: updated.nextReview.toISOString(),
    });
  },

  getDueWords: () => {
    const now = new Date();
    return Object.values(get().wordProgress)
      .filter((w) => new Date(w.nextReview) <= now)
      .map((w) => w.wordId);
  },
}));
