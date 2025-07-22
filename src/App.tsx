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
  const { settings, updateLastActivity, loadNotes, loadFolders, loadSettings } = useStore();
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = React.useState(true);
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
      </div>
    </Router>
  );
};

export default App;