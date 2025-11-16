import React, { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import EditorView from './components/Editor/EditorView';
import FloatingActionButton from './components/FloatingActionButton';
import { useStore } from './hooks/useStore';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const App: React.FC = () => {
  const settings = useStore((state) => state.settings);
  const auth = useStore((state) => state.auth);
  const unlockApp = useStore((state) => state.unlockApp);
  const { showUndoForNoteId, undoDelete, lastDeletedSnapshot } = useStore(
    (state) => ({
      showUndoForNoteId: state.showUndoForNoteId,
      undoDelete: state.undoDelete,
      lastDeletedSnapshot: state.lastDeletedSnapshot,
    }),
    shallow
  );
  useTheme();
  useKeyboardShortcuts();

  useEffect(() => {
    const state = useStore.getState();
    if (state.notes.length === 0) {
      const now = new Date();
      const mockNote = {
        id: 'local-note',
        title: 'Welcome to CipherWrite',
        content:
          '<p>This standalone editor keeps everything local. Create more notes from the sidebar or floating button.</p>',
        isEncrypted: false,
        isCodeMode: false,
        language: 'plaintext',
        folderId: null,
        projectId: null,
        laneId: null,
        position: 0,
        tags: [],
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
        isFavorite: false,
      };
      useStore.setState({
        notes: [mockNote],
        activeNoteId: mockNote.id,
        openTabs: [mockNote.id],
      });
    }
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 font-inter transition-all duration-300 ${
        settings.distractionFreeMode ? 'distraction-free' : ''
      } p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
            settings.distractionFreeMode
              ? 'h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)]'
              : 'h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]'
          }`}
        >
          <div className="h-full flex flex-col">
            {!settings.distractionFreeMode && <Header />}

            <div className={`flex-1 flex ${settings.distractionFreeMode ? 'p-8' : ''} overflow-hidden min-h-0`}>
              {!settings.distractionFreeMode && <Sidebar />}
              <div className="flex-1 overflow-hidden min-h-0">
                <EditorView />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!settings.distractionFreeMode && <FloatingActionButton />}
      {showUndoForNoteId && !auth.isLocked && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Note deleted</span>
            <button
              onClick={() => undoDelete?.()}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Undo
            </button>
            {lastDeletedSnapshot?.title && (
              <span className="ml-1 text-xs text-gray-400 truncate max-w-[160px]">{lastDeletedSnapshot.title}</span>
            )}
          </div>
        </div>
      )}
      {auth.isLocked && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-sm w-full text-center">
            <div className="mb-3 text-lg font-semibold">Session Locked</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">You’ve been inactive. Unlock to continue.</p>
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
  );
};

export default App;
