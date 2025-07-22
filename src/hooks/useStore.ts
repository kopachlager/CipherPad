import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Folder, AppSettings, AuthState } from '../types';
import { encryptData, decryptData } from '../utils/crypto';
import { generateId } from '../utils/helpers';

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
  createNote: (folderId?: string) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;
  
  createFolder: (name: string, parentId?: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  
  setActiveNote: (id: string | null) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFolder: (id: string | null) => void;
  
  authenticate: (password?: string) => boolean;
  lock: () => void;
  setPassword: (password: string) => void;
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
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      folders: [],
      settings: defaultSettings,
      auth: defaultAuth,
      sidebarOpen: true,
      searchQuery: '',
      selectedFolderId: null,

      createNote: (folderId) => {
        const id = generateId();
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
        
        set((state) => ({
          notes: [note, ...state.notes],
          activeNoteId: id,
        }));
        
        return note;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
        get().updateLastActivity();
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isDeleted: true } : note
          ),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }));
      },

      restoreNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isDeleted: false } : note
          ),
        }));
      },

      toggleNoteFavorite: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
          ),
        }));
      },

      createFolder: (name, parentId) => {
        const folder: Folder = {
          id: generateId(),
          name,
          color: '#6b7280',
          parentId,
          createdAt: new Date(),
        };
        
        set((state) => ({
          folders: [...state.folders, folder],
        }));
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }));
      },

      deleteFolder: (id) => {
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

      authenticate: (password) => {
        // Simple authentication logic - in production, use proper hashing
        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: true,
            isLocked: false,
            lastActivity: new Date(),
          },
        }));
        return true;
      },

      lock: () => {
        set((state) => ({
          auth: { ...state.auth, isLocked: true, isAuthenticated: false },
        }));
      },

      setPassword: (password) => {
        // In production, properly hash the password
        set((state) => ({
          auth: { ...state.auth, hasPassword: true },
        }));
      },

      updateLastActivity: () => {
        set((state) => ({
          auth: { ...state.auth, lastActivity: new Date() },
        }));
      },
    }),
    {
      name: 'notepad-storage',
      partialize: (state) => ({
        notes: state.notes,
        folders: state.folders,
        settings: state.settings,
        auth: {
          hasPassword: state.auth.hasPassword,
          isLocked: state.auth.isLocked,
        },
      }),
    }
  )
);