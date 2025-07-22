import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import EditorView from './components/Editor/EditorView';
import FloatingActionButton from './components/FloatingActionButton';
import AuthModal from './components/Auth/AuthModal';
import { useStore } from './hooks/useStore';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const App: React.FC = () => {
  const { settings, updateLastActivity, loadNotes, loadFolders } = useStore();
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  useTheme();
  useKeyboardShortcuts();

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading data...');
      loadNotes();
      loadFolders();
    }
  }, [user, loadNotes, loadFolders]);

  // Show auth modal if not authenticated and not loading
  useEffect(() => {
    if (!loading && !user) {
      console.log('User not authenticated, showing auth modal');
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, loading]);

  // Auto-lock functionality
  useEffect(() => {
    if (!settings.autoLock || !user) return;

    const checkAutoLock = () => {
      // Auto-lock logic would go here
    };

    const interval = setInterval(checkAutoLock, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings.autoLock, settings.autoLockTimeout, user]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => updateLastActivity();
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => 
      document.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      events.forEach(event =>
        document.removeEventListener(event, handleActivity)
      );
    };
  }, [updateLastActivity]);

  // PWA installation
  useEffect(() => {
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if user is not authenticated
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }
  return (
    <Router>
      <div className={`h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-inter transition-all duration-300 ${
        settings.distractionFreeMode ? 'distraction-free' : ''
      }`}>
        {!settings.distractionFreeMode && <Header />}
        
        <div className={`flex-1 flex overflow-hidden ${
          settings.distractionFreeMode ? 'p-8' : ''
        }`}>
          {!settings.distractionFreeMode && <Sidebar />}
          <EditorView />
        </div>
        
        {!settings.distractionFreeMode && <FloatingActionButton />}
      </div>
    </Router>
  );
};

export default App;