import React from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Settings, 
  Plus,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../hooks/useStore';
import { useTheme } from '../../hooks/useTheme';
import SettingsModal from '../Settings/SettingsModal';

const Header: React.FC = () => {
  const { 
    setSidebarOpen, 
    sidebarOpen, 
    setSearchQuery, 
    searchQuery,
    createNote,
    settings,
  } = useStore();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 relative z-50 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            CipherWrite
          </h1>
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
            onClick={() => createNote()}
            className="p-2 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-colors duration-150"
            title="New note"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            title="Toggle theme"
          >
            {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 hidden sm:block"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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