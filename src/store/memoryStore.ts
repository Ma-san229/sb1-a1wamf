import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface Memory {
  id: string;
  recipient: string;
  message: string;
  date: string;
  scheduled_date?: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  template_id?: string;
  likes_count: number;
  comments_count: number;
  comments: Comment[];
  stamps: Stamp[];
  is_public: boolean;
  status: 'draft' | 'scheduled' | 'sent';
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface Stamp {
  id: string;
  stamp_id: string;
  user_id: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

interface MemoryState {
  memories: Memory[];
  loading: boolean;
  fetchMemories: () => Promise<void>;
  createMemory: (memory: Partial<Memory>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  updateMemory: (id: string, updates: Partial<Memory>) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
  addStamp: (id: string, stampId: string) => Promise<void>;
  fetchTimeline: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  loading: false,

  fetchMemories: async () => {
    set({ loading: true });
    try {
      const { data: memories, error } = await supabase
        .from('memories')
        .select(`
          *,
          comments:memory_comments(
            id,
            user_id,
            content,
            created_at,
            user:profiles(username, avatar_url)
          ),
          stamps:memory_stamps(
            id,
            stamp_id,
            user_id,
            created_at,
            user:profiles(username, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ memories: memories || [], loading: false });
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast.error('メモリーの取得に失敗しました');
      set({ loading: false });
    }
  },

  createMemory: async (memory) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert([{ ...memory, status: memory.scheduled_date ? 'scheduled' : 'sent' }])
        .select()
        .single();
      
      if (error) throw error;
      set({ memories: [data, ...get().memories] });
      toast.success('メモリーを作成しました');
    } catch (error) {
      console.error('Error creating memory:', error);
      toast.error('メモリーの作成に失敗しました');
      throw error;
    }
  },

  deleteMemory: async (id) => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .match({ id });
      
      if (error) throw error;
      set({ memories: get().memories.filter(m => m.id !== id) });
      toast.success('メモリーを削除しました');
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast.error('メモリーの削除に失敗しました');
      throw error;
    }
  },

  updateMemory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .match({ id })
        .select()
        .single();
      
      if (error) throw error;
      set({
        memories: get().memories.map(m => 
          m.id === id ? { ...m, ...data } : m
        ),
      });
      toast.success('メモリーを更新しました');
    } catch (error) {
      console.error('Error updating memory:', error);
      toast.error('メモリーの更新に失敗しました');
      throw error;
    }
  },

  toggleLike: async (id) => {
    try {
      const { data: existingLike, error: checkError } = await supabase
        .from('memory_likes')
        .select()
        .match({ memory_id: id, user_id: supabase.auth.getUser() })
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('memory_likes')
          .delete()
          .match({ id: existingLike.id });

        if (deleteError) throw deleteError;

        set({
          memories: get().memories.map(m =>
            m.id === id ? { ...m, likes_count: m.likes_count - 1 } : m
          ),
        });
      } else {
        const { error: insertError } = await supabase
          .from('memory_likes')
          .insert({ memory_id: id, user_id: supabase.auth.getUser() });

        if (insertError) throw insertError;

        set({
          memories: get().memories.map(m =>
            m.id === id ? { ...m, likes_count: m.likes_count + 1 } : m
          ),
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('操作に失敗しました');
      throw error;
    }
  },

  addComment: async (id, content) => {
    try {
      const { data: comment, error } = await supabase
        .from('memory_comments')
        .insert({
          memory_id: id,
          content,
          user_id: supabase.auth.getUser()
        })
        .select(`
          id,
          user_id,
          content,
          created_at,
          user:profiles(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      set({
        memories: get().memories.map(m =>
          m.id === id ? {
            ...m,
            comments: [...m.comments, comment],
            comments_count: m.comments_count + 1
          } : m
        ),
      });
      toast.success('コメントを追加しました');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('コメントの追加に失敗しました');
      throw error;
    }
  },

  addStamp: async (id, stampId) => {
    try {
      const { data: stamp, error } = await supabase
        .from('memory_stamps')
        .insert({
          memory_id: id,
          stamp_id: stampId,
          user_id: supabase.auth.getUser()
        })
        .select(`
          id,
          stamp_id,
          user_id,
          created_at,
          user:profiles(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      set({
        memories: get().memories.map(m =>
          m.id === id ? {
            ...m,
            stamps: [...m.stamps, stamp]
          } : m
        ),
      });
      toast.success('スタンプを追加しました');
    } catch (error) {
      console.error('Error adding stamp:', error);
      toast.error('スタンプの追加に失敗しました');
      throw error;
    }
  },

  fetchTimeline: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          comments:memory_comments(
            id,
            user_id,
            content,
            created_at,
            user:profiles(username, avatar_url)
          ),
          stamps:memory_stamps(
            id,
            stamp_id,
            user_id,
            created_at,
            user:profiles(username, avatar_url)
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ memories: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching timeline:', error);
      toast.error('タイムラインの取得に失敗しました');
      set({ loading: false });
    }
  },
}));