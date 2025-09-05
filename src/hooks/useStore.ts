import { create } from 'zustand';
import { Note, Folder, AppSettings, AuthState, Project, Lane } from '../types';
import { supabase } from '../lib/supabase';

interface Store {
  // Notes
  notes: Note[];
  activeNoteId: string | null;
  openTabs: string[];
  
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
  // Dashboard
  projects: Project[];
  lanes: Lane[];
  selectedProjectId: string | null;
  showDashboard: boolean;
  // Undo toast state
  showUndoForNoteId?: string | null;
  lastDeletedSnapshot?: Note | null;
  undoTimerId?: number | null;
  undoDelete?: () => Promise<void>;
  loadProjects: () => Promise<void>;
  createProject: (name: string, color?: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  loadLanes: (projectId: string) => Promise<void>;
  createLane: (projectId: string, name: string, color?: string) => Promise<void>;
  updateLane: (id: string, updates: Partial<Lane>) => Promise<void>;
  deleteLane: (id: string) => Promise<void>;
  setSelectedProject: (id: string | null) => void;
  setShowDashboard: (show: boolean) => void;
  ensureDefaultLaneForProject?: (projectId: string) => Promise<void>;
  ensureInboxProjectAndAssign?: () => Promise<void>;
  
  updateLastActivity: () => void;
  lockApp: () => void;
  unlockApp: () => void;
  // Bridge for requesting encryption modal globally
  encryptionRequestForNoteId?: string | null;
  requestEncryption?: (noteId: string) => void;
  clearEncryptionRequest?: () => void;
}

export const defaultSettings: AppSettings = {
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
      openTabs: (() => {
        try { const s = localStorage.getItem('open-tabs'); return s ? JSON.parse(s) : []; } catch { return []; }
      })(),
      projects: [],
      lanes: [],
      selectedProjectId: null,
      folders: [],
      selectedFolderId: null,
      settings: loadSettings(),
      auth: defaultAuth,
      sidebarOpen: true,
      searchQuery: '',
      showDashboard: false,
      showUndoForNoteId: null,
      lastDeletedSnapshot: null,
      undoTimerId: null,
      encryptionRequestForNoteId: null,

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
          projectId: note.project_id || undefined,
          laneId: note.lane_id || undefined,
          position: note.position || undefined,
          folderId: note.folder_id || undefined,
          tags: note.tags,
          createdAt: new Date(note.created_at),
          updatedAt: new Date(note.updated_at),
          deletedAt: note.deleted_at ? new Date(note.deleted_at) : undefined,
          isDeleted: note.is_deleted,
          isFavorite: note.is_favorite,
        }));

        set((state) => {
          const existingIds = new Set(notes.map(n => n.id));
          const prunedTabs = state.openTabs.filter(id => existingIds.has(id));
          try { localStorage.setItem('open-tabs', JSON.stringify(prunedTabs)); } catch {}
          return { notes, openTabs: prunedTabs };
        });
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
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
        if (updates.laneId !== undefined) dbUpdates.lane_id = updates.laneId;
        if (updates.position !== undefined) dbUpdates.position = updates.position;
        if (updates.folderId !== undefined) dbUpdates.folder_id = updates.folderId;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.isDeleted !== undefined) dbUpdates.is_deleted = updates.isDeleted;
        if ((updates as any).deletedAt !== undefined) dbUpdates.deleted_at = (updates as any).deletedAt;
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
        const note = get().notes.find(n => n.id === id) || null;
        await get().updateNote(id, { isDeleted: true, deletedAt: new Date() } as any);
        // Show undo toast for 5s
        const timer = window.setTimeout(() => {
          set({ showUndoForNoteId: null, lastDeletedSnapshot: null, undoTimerId: null });
        }, 5000);
        set((state) => {
          const newTabs = state.openTabs.filter(t => t !== id);
          try { localStorage.setItem('open-tabs', JSON.stringify(newTabs)); } catch {}
          return {
            activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
            showUndoForNoteId: id,
            lastDeletedSnapshot: note,
            undoTimerId: timer,
            openTabs: newTabs,
          };
        });
      },

      restoreNote: async (id) => {
        await get().updateNote(id, { isDeleted: false, deletedAt: null } as any);
        // Hide undo toast if it matches
        const st = get();
        if (st.showUndoForNoteId === id) {
          if (st.undoTimerId) window.clearTimeout(st.undoTimerId);
          set({ showUndoForNoteId: null, lastDeletedSnapshot: null, undoTimerId: null });
        }
      },

      toggleNoteFavorite: async (id) => {
        const note = get().notes.find(n => n.id === id);
        if (note) {
          await get().updateNote(id, { isFavorite: !note.isFavorite });
        }
      },

      emptyTrash: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        // Permanently delete trashed notes older than 5 days
        const threshold = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('user_id', user.id)
          .eq('is_deleted', true)
          .not('deleted_at', 'is', null)
          .lte('deleted_at', threshold);
        if (error) {
          console.error('Error emptying trash:', error);
          return;
        }
        set((state) => ({ notes: state.notes.filter(n => !(n.isDeleted && n.deletedAt && n.deletedAt <= new Date(threshold))) }));
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
        const note = id ? get().notes.find(n => n.id === id) : null;
        console.log('Found note:', note);
        set((state) => {
          let tabs = state.openTabs;
          if (id && !tabs.includes(id)) tabs = [...tabs, id];
          try { localStorage.setItem('open-tabs', JSON.stringify(tabs)); } catch {}
          return { activeNoteId: id, openTabs: tabs };
        });
        get().updateLastActivity();
      },
      closeTab: (id: string) => {
        const s = get();
        const idx = s.openTabs.indexOf(id);
        if (idx === -1) return;
        const newTabs = s.openTabs.filter(t => t !== id);
        let nextActive = s.activeNoteId;
        if (s.activeNoteId === id) {
          const neighbor = newTabs[Math.max(0, idx - 1)] || newTabs[0] || null;
          nextActive = neighbor || null;
        }
        set({ openTabs: newTabs, activeNoteId: nextActive });
        try { localStorage.setItem('open-tabs', JSON.stringify(newTabs)); } catch {}
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
      // Dashboard actions
      undoDelete: async () => {
        const id = get().showUndoForNoteId;
        if (!id) return;
        if (get().undoTimerId) window.clearTimeout(get().undoTimerId!);
        await get().restoreNote(id);
      },
      // Utility: ensure a project has a default "Notes" lane
      ensureDefaultLaneForProject: async (projectId: string) => {
        const { data, error } = await supabase.from('lanes').select('id').eq('project_id', projectId).limit(1);
        if (error) { console.error('ensureDefaultLaneForProject', error); return; }
        if (!data || data.length === 0) {
          await get().createLane(projectId, 'Notes');
        }
      },
      // Ensure Inbox project and Notes lane exist, and assign all unassigned notes
      ensureInboxProjectAndAssign: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        // Find or create Inbox project
        let inbox = get().projects.find(p => p.name.toLowerCase() === 'inbox');
        if (!inbox) {
          const proj: any = { id: crypto.randomUUID(), user_id: user.id, name: 'Inbox', color: '#6b7280', position: Date.now() };
          const { error } = await supabase.from('projects').insert(proj);
          if (error) { console.error('ensureInbox create project', error); }
          inbox = { id: proj.id, userId: proj.user_id, name: 'Inbox', color: proj.color, position: proj.position, createdAt: new Date() };
          set(s => ({ projects: [inbox!, ...s.projects] }));
        }
        // Ensure default lane exists
        await get().ensureDefaultLaneForProject!(inbox.id);
        // Load lanes for inbox to find Notes lane id
        const { data: lanesData, error: lanesErr } = await supabase.from('lanes').select('*').eq('project_id', inbox.id).order('position', { ascending: true });
        if (lanesErr) { console.error('ensureInbox load lanes', lanesErr); return; }
        const lanes: Lane[] = (lanesData || []).map((l: any) => ({ id: l.id, projectId: l.project_id, name: l.name, color: l.color, position: l.position || 0, createdAt: new Date(l.created_at) }));
        const notesLane = lanes.find(l => l.name.toLowerCase() === 'notes') || lanes[0];
        // Assign all unassigned notes
        const { data: unassigned, error: unErr } = await supabase.from('notes').select('id').eq('user_id', user.id).is('project_id', null).eq('is_deleted', false);
        if (unErr) { console.error('ensureInbox fetch unassigned', unErr); return; }
        if (unassigned && unassigned.length > 0) {
          const ids = unassigned.map((n: any) => n.id);
          const { error: updErr } = await supabase.from('notes').update({ project_id: inbox.id, lane_id: notesLane?.id || null }).in('id', ids);
          if (updErr) { console.error('ensureInbox assign', updErr); }
          // Update local state
          set(s => ({ notes: s.notes.map(n => ids.includes(n.id) ? { ...n, projectId: inbox!.id, laneId: notesLane?.id } : n) }));
        }
      },
      loadProjects: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id).order('position', { ascending: false });
        if (error) { console.error('loadProjects', error); return; }
        const projects: Project[] = (data || []).map((p: any) => ({ id: p.id, userId: p.user_id, name: p.name, color: p.color, position: p.position || 0, createdAt: new Date(p.created_at) }));
        set({ projects });
        // Ensure Inbox exists and unassigned notes are assigned
        await get().ensureInboxProjectAndAssign!();
      },
      createProject: async (name, color = '#6b7280') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const proj: any = { id: crypto.randomUUID(), user_id: user.id, name, color, position: Date.now() };
        const { error } = await supabase.from('projects').insert(proj);
        if (error) { console.error('createProject', error); return; }
        set((s) => ({ projects: [{ id: proj.id, userId: proj.user_id, name, color, position: proj.position, createdAt: new Date() }, ...s.projects] }));
      },
      updateProject: async (id, updates) => {
        const db: any = {};
        if (updates.name !== undefined) db.name = updates.name;
        if (updates.color !== undefined) db.color = updates.color;
        if (updates.position !== undefined) db.position = updates.position;
        const { error } = await supabase.from('projects').update(db).eq('id', id);
        if (error) { console.error('updateProject', error); return; }
        set(s => ({ projects: s.projects.map(p => p.id===id ? { ...p, ...updates } : p) }));
      },
      deleteProject: async (id) => {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) { console.error('deleteProject', error); return; }
        set(s => ({ projects: s.projects.filter(p => p.id!==id), selectedProjectId: s.selectedProjectId===id ? null : s.selectedProjectId }));
      },
      loadLanes: async (projectId: string) => {
        const { data, error } = await supabase.from('lanes').select('*').eq('project_id', projectId).order('position', { ascending: true });
        if (error) { console.error('loadLanes', error); return; }
        const lanes: Lane[] = (data || []).map((l: any) => ({ id: l.id, projectId: l.project_id, name: l.name, color: l.color, position: l.position || 0, createdAt: new Date(l.created_at) }));
        set({ lanes });
        if (lanes.length === 0) {
          await get().ensureDefaultLaneForProject!(projectId);
          // Reload lanes
          const { data: data2 } = await supabase.from('lanes').select('*').eq('project_id', projectId).order('position', { ascending: true });
          const lanes2: Lane[] = (data2 || []).map((l: any) => ({ id: l.id, projectId: l.project_id, name: l.name, color: l.color, position: l.position || 0, createdAt: new Date(l.created_at) }));
          set({ lanes: lanes2 });
        }
      },
      createLane: async (projectId: string, name: string, color = '#e5e7eb') => {
        const lane: any = { id: crypto.randomUUID(), project_id: projectId, name, color, position: Date.now() };
        const { error } = await supabase.from('lanes').insert(lane);
        if (error) { console.error('createLane', error); return; }
        set(s => ({ lanes: [...s.lanes, { id: lane.id, projectId, name, color, position: lane.position, createdAt: new Date() }] }));
      },
      updateLane: async (id: string, updates: Partial<Lane>) => {
        const db: any = {};
        if (updates.name !== undefined) db.name = updates.name;
        if (updates.color !== undefined) db.color = updates.color;
        if (updates.position !== undefined) db.position = updates.position;
        const { error } = await supabase.from('lanes').update(db).eq('id', id);
        if (error) { console.error('updateLane', error); return; }
        set(s => ({ lanes: s.lanes.map(l => l.id===id ? { ...l, ...updates } : l) }));
      },
      deleteLane: async (id: string) => {
        const { error } = await supabase.from('lanes').delete().eq('id', id);
        if (error) { console.error('deleteLane', error); return; }
        set(s => ({ lanes: s.lanes.filter(l => l.id!==id) }));
      },
      setSelectedProject: (id) => {
        set({ selectedProjectId: id });
        if (id) get().loadLanes(id);
      },
      setShowDashboard: (show) => {
        set({ showDashboard: show });
        if (show) get().loadProjects();
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
      requestEncryption: (noteId: string) => {
        set({ encryptionRequestForNoteId: noteId });
      },
      clearEncryptionRequest: () => {
        set({ encryptionRequestForNoteId: null });
      },
    })
);
