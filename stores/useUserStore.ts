import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserState {
  userId: string | null;
  email: string | null;
  xp: number;
  streak: number;
  showNikud: boolean;
  setUser: (userId: string, email: string) => void;
  setXP: (xp: number) => void;
  setStreak: (streak: number) => void;
  addXP: (amount: number) => void;
  toggleNikud: () => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  email: null,
  xp: 0,
  streak: 0,
  showNikud: true,

  setUser: (userId, email) => set({ userId, email }),
  setXP: (xp) => set({ xp }),
  setStreak: (streak) => set({ streak }),

  addXP: (amount) => {
    const newXP = get().xp + amount;
    set({ xp: newXP });
    const { userId } = get();
    if (userId) {
      supabase.from('users').update({ xp: newXP }).eq('id', userId);
    }
  },

  toggleNikud: () => set((s) => ({ showNikud: !s.showNikud })),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ userId: null, email: null, xp: 0, streak: 0 });
  },
}));
