import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
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
  const { settings, updateLastActivity, loadNotes, loadFolders, loadSettings, auth, lockApp, unlockApp } = useStore();
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = React.useState(!user);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  useTheme();
  useKeyboardShortcuts();

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading data...');
      const loadUserData = async () => {
        try {
          await Promise.all([
            loadNotes(),
            loadFolders(),
            loadSettings()
          ]);
          console.log('User data loaded successfully');
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
      
      loadUserData();
    }
  }, [user, loadNotes, loadFolders, loadSettings]);

  // Show auth modal if not authenticated and not loading
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Show landing page for non-authenticated users
        setShowLanding(true);
        setShowAuthModal(false);
      } else {
        // Hide landing page when user is authenticated
        setShowLanding(false);
        setShowAuthModal(false);
      }
    }
  }, [user, loading]);

  // Auto-lock functionality
  useEffect(() => {
    if (!user || !settings.autoLock) return;
    const checkAutoLock = () => {
      const last = useStore.getState().auth.lastActivity;
      const now = new Date();
      const diff = now.getTime() - last.getTime();
      if (diff >= settings.autoLockTimeout && !useStore.getState().auth.isLocked) {
        lockApp();
      }
    };
    // Check every 10 seconds for responsiveness
    const interval = setInterval(checkAutoLock, 10000);
    return () => clearInterval(interval);
  }, [settings.autoLock, settings.autoLockTimeout, user, lockApp]);

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

  // Show landing page for non-authenticated users
  if (!user && !loading) {
    return (
      <div className="min-h-screen">
        {showLanding ? (
          <LandingPage onGetStarted={() => {
            setShowLanding(false);
            setShowAuthModal(true);
          }} />
        ) : null}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => {
            setShowAuthModal(false);
            setShowLanding(true);
          }} 
        />
      </div>
    );
  }
  
  return (
    <Router>
      <div className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 font-inter transition-all duration-300 ${
        settings.distractionFreeMode ? 'distraction-free' : ''
      } p-4 md:p-8`}>
        {/* Desktop Frame Container */}
        <div className="max-w-7xl mx-auto">
          <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
            settings.distractionFreeMode 
              ? 'h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)]' 
              : 'h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]'
          }`}>
            <div className="h-full flex flex-col">
              {!settings.distractionFreeMode && <Header />}
              
              <div className={`flex-1 flex ${
                settings.distractionFreeMode ? 'p-8' : ''
              } overflow-hidden`}>
                {!settings.distractionFreeMode && <Sidebar />}
                <EditorView />
              </div>
            </div>
          </div>
        </div>
        
        {!settings.distractionFreeMode && <FloatingActionButton />}
        {auth.isLocked && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-sm w-full text-center">
              <div className="mb-3 text-lg font-semibold">Session Locked</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">You've been inactive for a while. Unlock to continue.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => unlockApp()}
                  className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}
        {settings.distractionFreeMode && !auth.isLocked && (
          <button
            onClick={() => {
              // Exit focus mode quickly
              useStore.getState().updateSettings({ distractionFreeMode: false });
            }}
            className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            aria-label="Exit Focus Mode"
            title="Exit Focus Mode"
          >
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
            Exit Focus
          </button>
        )}
      </div>
    </Router>
  );
};

export default App;
