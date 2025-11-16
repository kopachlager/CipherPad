/* eslint-disable */
import { create } from 'zustand';
import type { Note, Folder, AppSettings, AuthState, Project, Lane } from '../types';

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
      return { ...defaultSettings, ...JSON.parse(raw) };
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

interface Store {
  notes: Note[];
  activeNoteId: string | null;
  openTabs: string[];
  folders: Folder[];
  selectedFolderId: string | null;
  settings: AppSettings;
  auth: AuthState;
  sidebarOpen: boolean;
  searchQuery: string;
  projects: Project[];
  lanes: Lane[];
  selectedProjectId: string | null;
  showUndoForNoteId?: string | null;
  lastDeletedSnapshot?: Note | null;
  undoTimerId?: number | null;
  encryptionRequestForNoteId?: string | null;

  createNote: (folderId?: string) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  toggleNoteFavorite: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  loadNotes: () => Promise<void>;

  createFolder: (name: string, parentId?: string) => Promise<void>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  loadFolders: () => Promise<void>;

  setActiveNote: (id: string | null) => void;
  closeTab: (id: string) => void;
  setSelectedFolder: (id: string | null) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  loadSettings: () => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  loadProjects: () => Promise<void>;
  createProject: (name: string, color?: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  loadLanes: (projectId: string) => Promise<void>;
  createLane: (projectId: string, name: string, color?: string) => Promise<void>;
  updateLane: (id: string, updates: Partial<Lane>) => Promise<void>;
  deleteLane: (id: string) => Promise<void>;
  setSelectedProject: (id: string | null) => void;
  ensureDefaultLaneForProject?: (projectId: string) => Promise<void>;
  ensureInboxProjectAndAssign?: () => Promise<void>;

  updateLastActivity: () => void;
  lockApp: () => void;
  unlockApp: () => void;
  requestEncryption?: (noteId: string) => void;
  clearEncryptionRequest?: () => void;
  undoDelete?: () => Promise<void>;
}

const createLocalNote = (folderId?: string): Note => ({
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
  folders: [],
  selectedFolderId: null,
  settings: loadSettings(),
  auth: defaultAuth,
  sidebarOpen: true,
  searchQuery: '',
  projects: [],
  lanes: [],
  selectedProjectId: null,
  showUndoForNoteId: null,
  lastDeletedSnapshot: null,
  undoTimerId: null,
  encryptionRequestForNoteId: null,

  createNote: async (folderId) => {
    const note = createLocalNote(folderId);
    set((state) => ({
      notes: [note, ...state.notes],
      activeNoteId: note.id,
      openTabs: [note.id, ...state.openTabs.filter((id) => id !== note.id)],
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

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isDeleted: true, deletedAt: new Date() } : n
      ),
      showUndoForNoteId: id,
      lastDeletedSnapshot: { ...note },
    }));

    const timer = window.setTimeout(() => {
      set({ showUndoForNoteId: null, lastDeletedSnapshot: null, undoTimerId: null });
    }, 5000);
    set({ undoTimerId: timer });
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

  loadNotes: async () => {},

  createFolder: async () => {},
  updateFolder: async () => {},
  deleteFolder: async () => {},
  loadFolders: async () => {},

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

  setSelectedFolder: (id) => set({ selectedFolderId: id }),

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

  loadProjects: async () => {},
  createProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  loadLanes: async () => {},
  createLane: async () => {},
  updateLane: async () => {},
  deleteLane: async () => {},
  setSelectedProject: (id) => set({ selectedProjectId: id }),

  ensureDefaultLaneForProject: async () => {},
  ensureInboxProjectAndAssign: async () => {},

  updateLastActivity: () => {
    set((state) => ({ auth: { ...state.auth, lastActivity: new Date() } }));
  },

  lockApp: () => {
    set((state) => ({ auth: { ...state.auth, isLocked: true } }));
  },

  unlockApp: () => {
    set((state) => ({ auth: { ...state.auth, isLocked: false, lastActivity: new Date() } }));
  },

  requestEncryption: (noteId: string) => {
    set({ encryptionRequestForNoteId: noteId });
  },

  clearEncryptionRequest: () => {
    set({ encryptionRequestForNoteId: null });
  },

  undoDelete: async () => {
    const snapshot = get().lastDeletedSnapshot;
    if (!snapshot) return;
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === snapshot.id ? { ...n, isDeleted: false, deletedAt: undefined } : n
      ),
      showUndoForNoteId: null,
      lastDeletedSnapshot: null,
      undoTimerId: null,
    }));
  },
}));

