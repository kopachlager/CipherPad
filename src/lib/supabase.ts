import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let _supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    // Validate URL
    new URL(supabaseUrl);
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web'
        }
      }
    });
  } catch (e) {
    console.error('Invalid Supabase configuration. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
} else {
  console.error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = _supabase;

export const supabaseConfigured = Boolean(_supabase);

export const supabaseClientOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
};

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
      user_settings: {
        Row: {
          user_id: string;
          theme: string;
          accent_color: string;
          font_family: string;
          font_size: number;
          line_height: number;
          auto_save: boolean;
          auto_lock: boolean;
          auto_lock_timeout: number;
          biometric_auth: boolean;
          show_word_count: boolean;
          distraction_free_mode: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: string;
          accent_color?: string;
          font_family?: string;
          font_size?: number;
          line_height?: number;
          auto_save?: boolean;
          auto_lock?: boolean;
          auto_lock_timeout?: number;
          biometric_auth?: boolean;
          show_word_count?: boolean;
          distraction_free_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: string;
          accent_color?: string;
          font_family?: string;
          font_size?: number;
          line_height?: number;
          auto_save?: boolean;
          auto_lock?: boolean;
          auto_lock_timeout?: number;
          biometric_auth?: boolean;
          show_word_count?: boolean;
          distraction_free_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
