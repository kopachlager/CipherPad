import React, { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { FileText, Heart, Trash2, Plus, Search, Lock, Unlock, Download, Share, X, Bell } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';
import Tooltip from '../Common/Tooltip';

const Sidebar: React.FC = () => {
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const notes = useStore((state) => state.notes);
  const activeNoteId = useStore((state) => state.activeNoteId);
  const searchQuery = useStore((state) => state.searchQuery);
  const { setSearchQuery, setActiveNote } = useStore(
    (state) => ({
      setSearchQuery: state.setSearchQuery,
      setActiveNote: state.setActiveNote,
    }),
    shallow
  );

  const [viewMode, setViewMode] = useState<'all'|'favorites'|'trash'>('all');

  const filteredNotes = useMemo(() => {
    const byView = notes.filter(n => viewMode==='trash' ? n.isDeleted : viewMode==='favorites' ? n.isFavorite && !n.isDeleted : !n.isDeleted);
    const bySearch = searchQuery ? byView.filter(n => (n.title + ' ' + n.content).toLowerCase().includes(searchQuery.toLowerCase())) : byView;
    return bySearch.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, viewMode, searchQuery]);

  if (!sidebarOpen) return null;

  return (
    <aside className="w-80 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 relative z-40">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              data-search-input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>
          <button aria-label="Notifications" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Access - simple list */}
        <div>
          <div className="px-2 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Access</div>
          <div className="space-y-1">
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${viewMode==='all'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-100/60 dark:hover:bg-gray-800'}`} onClick={()=>setViewMode('all')}>
              <span className="flex items-center gap-2"><FileText className="w-4 h-4"/>All Notes</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>!n.isDeleted).length}</span>
            </button>
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${viewMode==='favorites'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-100/60 dark:hover:bg-gray-800'}`} onClick={()=>setViewMode('favorites')}>
              <span className="flex items-center gap-2"><Heart className="w-4 h-4"/>Favorites</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>n.isFavorite && !n.isDeleted).length}</span>
            </button>
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${viewMode==='trash'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-100/60 dark:hover:bg-gray-800'}`} onClick={()=>setViewMode('trash')}>
              <span className="flex items-center gap-2"><Trash2 className="w-4 h-4"/>Trash</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>n.isDeleted).length}</span>
            </button>
          </div>
        </div>

        {/* Notes - simple divided list */}
        <div>
          <div className="px-2 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {viewMode==='trash'?'Deleted Notes':viewMode==='favorites'?'Favorites':'Notes'}
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotes.map(n => (
                <div
                  key={n.id}
                  onMouseDown={(e)=>{ e.preventDefault(); setActiveNote(n.id); }}
                  className={`group flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${activeNoteId===n.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {n.isFavorite && <Heart className="w-3 h-3 text-pink-500 flex-shrink-0" />}
                    {n.isEncrypted ? (<Lock className="w-3 h-3 text-gray-600 flex-shrink-0" />) : null}
                    <div className="min-w-0">
                      <div className="text-sm text-gray-900 dark:text-gray-100 truncate">{n.title || 'Untitled'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip content="Favorite">
                      <button
                        onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); useStore.getState().toggleNoteFavorite(n.id); }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Favorite note"
                      >
                        <Heart className={`w-3 h-3 ${n.isFavorite ? 'text-pink-500' : 'text-gray-500'}`} />
                      </button>
                    </Tooltip>
                    <Tooltip content={n.isEncrypted ? 'Unlock' : 'Lock'}>
                      <button
                        onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); useStore.getState().updateNote(n.id, { isEncrypted: !n.isEncrypted }); }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label={n.isEncrypted ? 'Unlock' : 'Lock'}
                      >
                        {n.isEncrypted ? (<Unlock className="w-3 h-3 text-gray-600" />) : (<Lock className="w-3 h-3 text-gray-500" />)}
                      </button>
                    </Tooltip>
                    <Tooltip content="Download">
                      <button
                        onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); exportNote(n, 'txt'); }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Download note"
                      >
                        <Download className="w-3 h-3 text-gray-500" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Share">
                      <button
                        onMouseDown={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (navigator.share) {
                            try {
                              await navigator.share({ title: n.title, text: n.content });
                            } catch (shareError) {
                              console.warn('Share action was not completed', shareError);
                            }
                          } else {
                            void navigator.clipboard.writeText(n.content);
                          }
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Share note"
                      >
                        <Share className="w-3 h-3 text-gray-500" />
                      </button>
                    </Tooltip>
                    {viewMode==='trash' ? (
                      <Tooltip content="Restore">
                        <button
                          onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); useStore.getState().restoreNote(n.id); }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          aria-label="Restore note"
                        >
                          <Plus className="w-3 h-3 text-gray-500" />
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip content="Delete">
                        <button
                          onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); useStore.getState().deleteNote(n.id); }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          aria-label="Delete note"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
              {filteredNotes.length===0 && (
                <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">No notes</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
