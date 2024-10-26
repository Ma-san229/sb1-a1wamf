import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }
        throw error;
      }
      
      set({ user: data.user });
      toast.success('ログインしました！');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'ログインに失敗しました');
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
          data: {
            email_confirm: true,
          },
        },
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('このメールアドレスは既に登録されています');
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error('ユーザー登録に失敗しました');
      }

      if (!data.user.confirmed_at) {
        toast.success('確認メールを送信しました。メールをご確認ください。');
      } else {
        set({ user: data.user });
        toast.success('登録が完了しました！');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || '登録に失敗しました');
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
      toast.success('ログアウトしました');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('ログアウトに失敗しました');
    }
  },

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, loading: false });
      
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null });
      });
    } catch (error) {
      console.error('Initialize error:', error);
      set({ loading: false });
    }
  },
}));