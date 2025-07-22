import { create } from 'zustand';
import { Note, Folder, AppSettings, AuthState } from '../types';
import { generateUuid } from '../utils/crypto';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Store {
  // Notes
  notes: Note[];
  activeNoteId: string | null;
  
  // Folders
  folders: Folder[];
  
  // Settings
  settings: AppSettings;
  
  // Auth
  auth: AuthState;
  
  // UI State
  sidebarOpen: boolean;
  searchQuery: string;
  selectedFolderId: string | null;
  
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
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFolder: (id: string | null) => void;
  
  updateLastActivity: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  accentColor: '#6b7280',
  fontSize: 16,
  lineHeight: 1.6,
  autoSave: true,
  autoLock: false,
  autoLockTimeout: 300000, // 5 minutes
  biometricAuth: false,
  showWordCount: true,
  distractionFreeMode: false,
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
      settings: defaultSettings,
      auth: defaultAuth,
      sidebarOpen: true,
      searchQuery: '',
      selectedFolderId: null,

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

        const id = generateUuid();
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
          return;
        }

        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
        get().updateLastActivity();
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
          id: generateUuid(),
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
        set({ activeNoteId: id });
        get().updateLastActivity();
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedFolder: (id) => {
        set({ selectedFolderId: id });
      },

      updateLastActivity: () => {
        set((state) => ({
          auth: { ...state.auth, lastActivity: new Date() },
        }));
      },
    })
);