import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          is_encrypted: boolean;
          is_code_mode: boolean;
          language: string | null;
          folder_id: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
          is_favorite: boolean;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          is_encrypted?: boolean;
          is_code_mode?: boolean;
          language?: string | null;
          folder_id?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
          is_favorite?: boolean;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          is_encrypted?: boolean;
          is_code_mode?: boolean;
          language?: string | null;
          folder_id?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
          is_favorite?: boolean;
          user_id?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          name: string;
          color: string;
          parent_id: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          parent_id?: string | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          parent_id?: string | null;
          created_at?: string;
          user_id?: string;
        };
      };
    };
  };
};