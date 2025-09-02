import { create } from 'zustand';
import { Note, Folder, AppSettings, AuthState } from '../types';
import { supabase } from '../lib/supabase';

interface Store {
  // Notes
  notes: Note[];
  activeNoteId: string | null;
  
  // Folders
  folders: Folder[];
  selectedFolderId: string | null;
  
  // Settings
  settings: AppSettings;
  
  // Auth
  auth: AuthState;
  
  // UI State
  sidebarOpen: boolean;
  searchQuery: string;
  
  // Actions
  createNote: (folderId?: string) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  toggleNoteFavorite: (id: string) => Promise<void>;
  loadNotes: () => Promise<void>;
  
  createFolder: (name: string, parentId?: string) => Promise<void>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  loadFolders: () => Promise<void>;
  
  setActiveNote: (id: string | null) => void;
  setSelectedFolder: (id: string | null) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  loadSettings: () => Promise<void>;
  
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  updateLastActivity: () => void;
  lockApp: () => void;
  unlockApp: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  accentColor: '#6b7280',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 16,
  lineHeight: 1.6,
  autoSave: true,
  autoLock: false,
  autoLockTimeout: 300000, // 5 minutes
  biometricAuth: false,
  showWordCount: true,
  distractionFreeMode: false,
};

// Load settings from localStorage
const loadSettings = (): AppSettings => {
  try {
    const saved = localStorage.getItem('notepad-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

// Save settings to localStorage
const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem('notepad-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};
const defaultAuth: AuthState = {
  isAuthenticated: false,
  isLocked: false,
  hasPassword: false,
  lastActivity: new Date(),
};

export const useStore = create<Store>()(
  (set, get) => ({
      notes: [],
      activeNoteId: null,
      folders: [],
      selectedFolderId: null,
      settings: loadSettings(),
      auth: defaultAuth,
      sidebarOpen: true,
      searchQuery: '',

      loadNotes: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error loading notes:', error);
          return;
        }

        const notes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          isEncrypted: note.is_encrypted,
          isCodeMode: note.is_code_mode,
          language: note.language || 'plaintext',
          folderId: note.folder_id || undefined,
          tags: note.tags,
          createdAt: new Date(note.created_at),
          updatedAt: new Date(note.updated_at),
          isDeleted: note.is_deleted,
          isFavorite: note.is_favorite,
        }));

        set({ notes });
      },

      createNote: async (folderId) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const id = crypto.randomUUID();
        const note: Note = {
          id,
          title: 'Untitled Note',
          content: '',
          isEncrypted: false,
          isCodeMode: false,
          language: 'plaintext',
          folderId,
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
          isFavorite: false,
        };
        
        const { error } = await supabase
          .from('notes')
          .insert({
            id,
            title: note.title,
            content: note.content,
            is_encrypted: note.isEncrypted,
            is_code_mode: note.isCodeMode,
            language: note.language,
            folder_id: folderId || null,
            tags: note.tags,
            user_id: user.id,
          });

        if (error) {
          console.error('Error creating note:', error);
          throw error;
        }

        set((state) => ({
          notes: [note, ...state.notes],
          activeNoteId: id,
        }));
        
        return note;
      },

      updateNote: async (id, updates) => {
        const { data: { user } } = await supabase.auth.getUser();

        // Update local state immediately
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
        get().updateLastActivity();

        // If not authenticated, skip remote persistence
        if (!user) return;

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.isEncrypted !== undefined) dbUpdates.is_encrypted = updates.isEncrypted;
        if (updates.isCodeMode !== undefined) dbUpdates.is_code_mode = updates.isCodeMode;
        if (updates.language !== undefined) dbUpdates.language = updates.language;
        if (updates.folderId !== undefined) dbUpdates.folder_id = updates.folderId;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.isDeleted !== undefined) dbUpdates.is_deleted = updates.isDeleted;
        if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from('notes')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating note:', error);
        }
      },

      deleteNote: async (id) => {
        await get().updateNote(id, { isDeleted: true });
        set((state) => ({
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }));
      },

      restoreNote: async (id) => {
        await get().updateNote(id, { isDeleted: false });
      },

      toggleNoteFavorite: async (id) => {
        const note = get().notes.find(n => n.id === id);
        if (note) {
          await get().updateNote(id, { isFavorite: !note.isFavorite });
        }
      },

      loadFolders: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading folders:', error);
          return;
        }

        const folders: Folder[] = data.map(folder => ({
          id: folder.id,
          name: folder.name,
          color: folder.color,
          parentId: folder.parent_id || undefined,
          createdAt: new Date(folder.created_at),
        }));

        set({ folders });
      },

      createFolder: async (name, parentId) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const folder: Folder = {
          id: crypto.randomUUID(),
          name,
          color: '#6b7280',
          parentId,
          createdAt: new Date(),
        };
        
        const { error } = await supabase
          .from('folders')
          .insert({
            id: folder.id,
            name: folder.name,
            color: folder.color,
            parent_id: parentId || null,
            user_id: user.id,
          });

        if (error) {
          console.error('Error creating folder:', error);
          return;
        }

        set((state) => ({
          folders: [...state.folders, folder],
        }));
      },

      updateFolder: async (id, updates) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.color !== undefined) dbUpdates.color = updates.color;
        if (updates.parentId !== undefined) dbUpdates.parent_id = updates.parentId;

        const { error } = await supabase
          .from('folders')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating folder:', error);
          return;
        }

        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }));
      },

      deleteFolder: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('folders')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting folder:', error);
          return;
        }

        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          notes: state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: undefined } : note
          ),
        }));
      },

      setActiveNote: (id) => {
        console.log('Setting active note:', id);
        const note = get().notes.find(n => n.id === id);
        console.log('Found note:', note);
        set({ activeNoteId: id });
        get().updateLastActivity();
      },

      setSelectedFolder: (id) => {
        set({ selectedFolderId: id });
      },

      updateSettings: (updates) => {
        const newSettings = { ...get().settings, ...updates };
        // Apply immediately and persist to localStorage
        set({ settings: newSettings });
        saveSettings(newSettings);

        // Best-effort save to Supabase if authenticated
        (async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const dbUpdates: any = {};
          if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
          if (updates.accentColor !== undefined) dbUpdates.accent_color = updates.accentColor;
          if (updates.fontFamily !== undefined) dbUpdates.font_family = updates.fontFamily;
          if (updates.fontSize !== undefined) dbUpdates.font_size = updates.fontSize;
          if (updates.lineHeight !== undefined) dbUpdates.line_height = updates.lineHeight;
          if (updates.autoSave !== undefined) dbUpdates.auto_save = updates.autoSave;
          if (updates.autoLock !== undefined) dbUpdates.auto_lock = updates.autoLock;
          if (updates.autoLockTimeout !== undefined) dbUpdates.auto_lock_timeout = updates.autoLockTimeout;
          if (updates.biometricAuth !== undefined) dbUpdates.biometric_auth = updates.biometricAuth;
          if (updates.showWordCount !== undefined) dbUpdates.show_word_count = updates.showWordCount;
          if (updates.distractionFreeMode !== undefined) dbUpdates.distraction_free_mode = updates.distractionFreeMode;

          const { error } = await supabase
            .from('user_settings')
            .upsert({ user_id: user.id, ...dbUpdates });
          if (error) console.error('Error saving settings:', error);
        })();
      },

      loadSettings: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .limit(1);

          if (error) {
            console.error('Error loading settings:', error);
            return;
          }

          if (data && data.length > 0) {
            const settingsData = data[0];
            const settings: AppSettings = {
              theme: settingsData.theme as any,
              accentColor: settingsData.accent_color,
              fontFamily: settingsData.font_family,
              fontSize: settingsData.font_size,
              lineHeight: settingsData.line_height,
              autoSave: settingsData.auto_save,
              autoLock: settingsData.auto_lock,
              autoLockTimeout: settingsData.auto_lock_timeout,
              biometricAuth: settingsData.biometric_auth,
              showWordCount: settingsData.show_word_count,
              distractionFreeMode: settingsData.distraction_free_mode,
            };
            
            set({ settings });
            saveSettings(settings); // Backup to localStorage
          } else {
            // No settings found, create default settings in database
            const defaultSettingsForUser = { ...defaultSettings };
            await get().updateSettings(defaultSettingsForUser);
          }
        } catch (error) {
          console.error('Failed to load settings from Supabase:', error);
          // Fall back to localStorage
          const localSettings = loadSettings();
          set({ settings: localSettings });
        }
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      updateLastActivity: () => {
        set((state) => ({
          auth: { ...state.auth, lastActivity: new Date() },
        }));
      },
      lockApp: () => {
        set((state) => ({ auth: { ...state.auth, isLocked: true } }));
      },
      unlockApp: () => {
        set((state) => ({ auth: { ...state.auth, isLocked: false, lastActivity: new Date() } }));
      },
    })
);
