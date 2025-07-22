import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import EditorView from './components/Editor/EditorView';
import FloatingActionButton from './components/FloatingActionButton';
import { useStore } from './hooks/useStore';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const App: React.FC = () => {
  const { auth, settings, updateLastActivity } = useStore();
  useTheme();
  useKeyboardShortcuts();

  // Auto-lock functionality
  useEffect(() => {
    if (!settings.autoLock || !auth.hasPassword) return;

    const checkAutoLock = () => {
      const now = new Date();
      const lastActivity = new Date(auth.lastActivity);
      const timeDiff = now.getTime() - lastActivity.getTime();

      if (timeDiff > settings.autoLockTimeout && auth.isAuthenticated) {
        // Would trigger lock function
      }
    };

    const interval = setInterval(checkAutoLock, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings.autoLock, settings.autoLockTimeout, auth.hasPassword, auth.lastActivity, auth.isAuthenticated]);

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

  return (
    <Router>
      <div className={`h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-inter ${
        settings.distractionFreeMode ? 'distraction-free' : ''
      }`}>
        {!settings.distractionFreeMode && <Header />}
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <EditorView />
        </div>
        
        <FloatingActionButton />
      </div>
    </Router>
  );
};

export default App;