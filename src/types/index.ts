export interface Note {
  id: string;
  title: string;
  content: string;
  isEncrypted: boolean;
  isCodeMode: boolean;
  language?: string;
  projectId?: string;
  laneId?: string;
  position?: number;
  folderId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isFavorite: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  color: string;
  position: number;
  createdAt: Date;
}

export interface Lane {
  id: string;
  projectId: string;
  name: string;
  color: string;
  position: number;
  createdAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  createdAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system' | 'paper';
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  autoSave: boolean;
  autoLock: boolean;
  autoLockTimeout: number;
  biometricAuth: boolean;
  showWordCount: boolean;
  distractionFreeMode: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLocked: boolean;
  hasPassword: boolean;
  lastActivity: Date;
}

export interface SearchResult {
  note: Note;
  matches: Array<{
    line: number;
    preview: string;
    highlighted: string;
  }>;
}
