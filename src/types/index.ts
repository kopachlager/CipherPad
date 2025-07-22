export interface Note {
  id: string;
  title: string;
  content: string;
  isEncrypted: boolean;
  isCodeMode: boolean;
  language?: string;
  folderId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isFavorite: boolean;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  createdAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
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