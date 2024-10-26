import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserPoints {
  points: number;
  level: number;
}

interface PointHistory {
  id: string;
  points: number;
  reason: string;
  created_at: string;
  memory_id?: string;
}

interface PointsState {
  userPoints: UserPoints | null;
  history: PointHistory[];
  loading: boolean;
  fetchUserPoints: () => Promise<void>;
  fetchPointHistory: () => Promise<void>;
}

export const usePointsStore = create<PointsState>((set) => ({
  userPoints: null,
  history: [],
  loading: false,

  fetchUserPoints: async () => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      set({ userPoints: data || { points: 0, level: 1 } });
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  },

  fetchPointHistory: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('point_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ history: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching point history:', error);
      set({ loading: false });
    }
  },
}));