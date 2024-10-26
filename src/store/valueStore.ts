import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface ValueTag {
  id: string;
  name: string;
  description: string;
  point_value: number;
  category: 'culture' | 'principle' | 'behavior';
  icon: string;
}

interface ValueState {
  tags: ValueTag[];
  loading: boolean;
  fetchTags: () => Promise<void>;
  createTag: (tag: Omit<ValueTag, 'id'>) => Promise<void>;
  updateTag: (id: string, updates: Partial<ValueTag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
}

export const useValueStore = create<ValueState>((set, get) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('value_tags')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      set({ tags: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching value tags:', error);
      set({ loading: false });
    }
  },

  createTag: async (tag) => {
    try {
      const { data, error } = await supabase
        .from('value_tags')
        .insert([tag])
        .select()
        .single();

      if (error) throw error;
      set({ tags: [...get().tags, data] });
    } catch (error) {
      console.error('Error creating value tag:', error);
      throw error;
    }
  },

  updateTag: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('value_tags')
        .update(updates)
        .match({ id })
        .select()
        .single();

      if (error) throw error;
      set({
        tags: get().tags.map(tag => 
          tag.id === id ? { ...tag, ...data } : tag
        ),
      });
    } catch (error) {
      console.error('Error updating value tag:', error);
      throw error;
    }
  },

  deleteTag: async (id) => {
    try {
      const { error } = await supabase
        .from('value_tags')
        .delete()
        .match({ id });

      if (error) throw error;
      set({ tags: get().tags.filter(tag => tag.id !== id) });
    } catch (error) {
      console.error('Error deleting value tag:', error);
      throw error;
    }
  },
}));