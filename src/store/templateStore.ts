import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Template {
  id: string;
  title: string;
  message: string;
  category: string;
  tags: string[];
  created_at: string;
  user_id: string;
  is_public: boolean;
  usage_count: number;
}

interface TemplateState {
  templates: Template[];
  loading: boolean;
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: Omit<Template, 'id' | 'created_at' | 'user_id' | 'usage_count'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: false,

  fetchTemplates: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ templates: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching templates:', error);
      set({ loading: false });
    }
  },

  createTemplate: async (template) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      set({ templates: [data, ...get().templates] });
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  updateTemplate: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .match({ id })
        .select()
        .single();

      if (error) throw error;
      set({
        templates: get().templates.map(template => 
          template.id === id ? { ...template, ...data } : template
        ),
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .match({ id });

      if (error) throw error;
      set({ templates: get().templates.filter(template => template.id !== id) });
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },
}));