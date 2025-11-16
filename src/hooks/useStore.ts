/* eslint-disable */
import { create } from 'zustand';
import type { Note, AppSettings, AuthState } from '../types';

export const defaultSettings: AppSettings = {
  theme: 'light',
  accentColor: '#6b7280',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 16,
  lineHeight: 1.6,
  autoSave: true,
  autoLock: false,
  autoLockTimeout: 300000,
  biometricAuth: false,
  showWordCount: true,
  distractionFreeMode: false,
};

const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem('notepad-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultSettings, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return defaultSettings;
};

const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem('notepad-settings', JSON.stringify(settings));
  } catch {
    /* ignore */
  }
};

const defaultAuth: AuthState = {
  isAuthenticated: false,
  isLocked: false,
  hasPassword: false,
  lastActivity: new Date(),
};

const createNoteModel = (folderId?: string): Note => ({
  id: crypto.randomUUID(),
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
});

interface Store {
  notes: Note[];
  activeNoteId: string | null;
  openTabs: string[];
  settings: AppSettings;
  auth: AuthState;
  sidebarOpen: boolean;
  searchQuery: string;
  showUndoForNoteId: string | null;
  lastDeletedSnapshot: Note | null;
  undoTimerId: number | null;

  createNote: (folderId?: string) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  toggleNoteFavorite: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;

  setActiveNote: (id: string | null) => void;
  closeTab: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  loadSettings: () => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  updateLastActivity: () => void;
  lockApp: () => void;
  unlockApp: () => void;
  undoDelete: () => Promise<void>;
}

export const useStore = create<Store>()((set, get) => ({
  notes: [],
  activeNoteId: null,
  openTabs: (() => {
    try {
      const raw = localStorage.getItem('open-tabs');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  })(),
  settings: loadSettings(),
  auth: defaultAuth,
  sidebarOpen: true,
  searchQuery: '',
  showUndoForNoteId: null,
  lastDeletedSnapshot: null,
  undoTimerId: null,

  createNote: async (folderId) => {
    const note = createNoteModel(folderId);
    set((state) => ({
      notes: [note, ...state.notes],
      activeNoteId: note.id,
      openTabs: [note.id, ...state.openTabs.filter((tab) => tab !== note.id)],
    }));
    return note;
  },

  updateNote: async (id, updates) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: new Date(),
            }
          : note
      ),
    }));
  },

  deleteNote: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;

    const timer = window.setTimeout(() => {
      set({ showUndoForNoteId: null, lastDeletedSnapshot: null, undoTimerId: null });
    }, 5000);

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isDeleted: true, deletedAt: new Date() } : n
      ),
      showUndoForNoteId: id,
      lastDeletedSnapshot: { ...note },
      undoTimerId: timer,
    }));
  },

  restoreNote: async (id) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isDeleted: false, deletedAt: undefined } : n
      ),
    }));
  },

  toggleNoteFavorite: async (id) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
      ),
    }));
  },

  emptyTrash: async () => {
    set((state) => ({
      notes: state.notes.filter((n) => !n.isDeleted),
    }));
  },

  setActiveNote: (id) => {
    if (!id) {
      set({ activeNoteId: null });
      return;
    }
    set((state) => {
      const tabs = state.openTabs.includes(id) ? state.openTabs : [...state.openTabs, id];
      try {
        localStorage.setItem('open-tabs', JSON.stringify(tabs));
      } catch {
        /* ignore */
      }
      return { activeNoteId: id, openTabs: tabs };
    });
    get().updateLastActivity();
  },

  closeTab: (id) => {
    const state = get();
    const newTabs = state.openTabs.filter((tab) => tab !== id);
    let nextActive = state.activeNoteId;
    if (state.activeNoteId === id) {
      nextActive = newTabs[newTabs.length - 1] || null;
    }
    set({ openTabs: newTabs, activeNoteId: nextActive });
    try {
      localStorage.setItem('open-tabs', JSON.stringify(newTabs));
    } catch {
      /* ignore */
    }
  },

  updateSettings: (updates) => {
    const newSettings = { ...get().settings, ...updates };
    set({ settings: newSettings });
    saveSettings(newSettings);
  },

  loadSettings: async () => {
    set({ settings: loadSettings() });
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  updateLastActivity: () => {
    set((state) => ({ auth: { ...state.auth, lastActivity: new Date() } }));
  },

  lockApp: () => {
    set((state) => ({ auth: { ...state.auth, isLocked: true } }));
  },

  unlockApp: () => {
    set((state) => ({ auth: { ...state.auth, isLocked: false, lastActivity: new Date() } }));
  },

  undoDelete: async () => {
    const snapshot = get().lastDeletedSnapshot;
    if (!snapshot) return;
    set({
      notes: get().notes.map((n) =>
        n.id === snapshot.id ? { ...n, isDeleted: false, deletedAt: undefined } : n
      ),
      showUndoForNoteId: null,
      lastDeletedSnapshot: null,
      undoTimerId: null,
    });
  },
}));
