import React from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Settings, 
  Lock,
  Plus
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useTheme } from '../../hooks/useTheme';

const Header: React.FC = () => {
  const { 
    setSidebarOpen, 
    sidebarOpen, 
    setSearchQuery, 
    searchQuery,
    createNote,
    settings,
    auth
  } = useStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 relative z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            data-search-input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
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
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {auth.hasPassword && (
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            title="Lock app"
          >
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;