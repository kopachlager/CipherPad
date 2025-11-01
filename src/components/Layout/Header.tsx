import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Settings,
  Plus,
  LogOut,
  Loader2,
  LayoutDashboard,
} from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../hooks/useStore';
import { useTheme } from '../../hooks/useTheme';
import SettingsModal from '../Settings/SettingsModal';

const Header: React.FC = () => {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const createNote = useStore((state) => state.createNote);
  const showDashboard = useStore((state) => state.showDashboard);
  const { setShowDashboard, setSelectedProject, loadProjects } = useStore(
    (state) => ({
      setShowDashboard: state.setShowDashboard,
      setSelectedProject: state.setSelectedProject,
      loadProjects: state.loadProjects,
    }),
    shallow
  );
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = React.useState(false);
  const [isCreatingNote, setIsCreatingNote] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleCreateNote = async () => {
    setIsCreatingNote(true);
    try {
      await createNote();
    } finally {
      setTimeout(() => setIsCreatingNote(false), 500); // Show animation briefly
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <>
      <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 relative z-50 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">CipherWrite</h1>
          <button
            onClick={async () => {
              setShowDashboard(!showDashboard);
              if (!showDashboard) { await loadProjects(); setSelectedProject(null); }
            }}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            title={showDashboard ? 'Back to Editor' : 'Open Dashboard'}
            aria-label={showDashboard ? 'Back to Editor' : 'Open Dashboard'}
          >
            <LayoutDashboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            data-search-input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handleCreateNote}
            disabled={isCreatingNote}
            className="p-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50"
            title="New note"
          >
            {isCreatingNote ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 transition-transform duration-150 hover:rotate-90" />
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 hover:scale-105 active:scale-95"
            title="Toggle theme"
          >
            {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 hover:rotate-12" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 hover:scale-105 active:scale-95 hidden sm:block disabled:opacity-50"
              title="Sign out"
            >
              {isSigningOut ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-400" />
              ) : (
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-150 hover:translate-x-1" />
              )}
            </button>
          )}

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 hover:scale-105 active:scale-95"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 hover:rotate-90" />
          </button>
        </div>
      </header>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default Header;
