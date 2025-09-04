import React, { useMemo, useState } from 'react';
import { FileText, Heart, Trash2, Plus, Search, Lock, Code, Unlock, Download, Share, X } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { formatDate, exportNote } from '../../utils/helpers';

const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    notes,
    folders,
    activeNoteId,
    selectedFolderId,
    searchQuery,
    setSearchQuery,
    createNote,
    createFolder,
    setActiveNote,
    setSelectedFolder,
  } = useStore();

  const [viewMode, setViewMode] = useState<'all'|'favorites'|'trash'>('all');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredNotes = useMemo(() => {
    const byView = notes.filter(n => viewMode==='trash' ? n.isDeleted : viewMode==='favorites' ? n.isFavorite && !n.isDeleted : !n.isDeleted);
    const byFolder = selectedFolderId ? byView.filter(n => n.folderId===selectedFolderId) : byView;
    const bySearch = searchQuery ? byFolder.filter(n => (n.title + ' ' + n.content).toLowerCase().includes(searchQuery.toLowerCase())) : byFolder;
    return bySearch.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, viewMode, selectedFolderId, searchQuery]);

  const addFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolder(newFolderName.trim());
    setNewFolderName('');
    setShowNewFolder(false);
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="w-80 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 relative z-40">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            data-search-input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Access */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-600">
          <div className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Access</div>
          <div className="px-3 pb-3 space-y-1">
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${viewMode==='all'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-50 dark:hover:bg-gray-800'}`} onClick={()=>{setViewMode('all'); setSelectedFolder(null);}}>
              <span className="flex items-center gap-2"><FileText className="w-4 h-4"/>All Notes</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>!n.isDeleted).length}</span>
            </button>
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${viewMode==='favorites'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-50 dark:hover:bg-gray-800'}`} onClick={()=>{setViewMode('favorites'); setSelectedFolder(null);}}>
              <span className="flex items-center gap-2"><Heart className="w-4 h-4"/>Favorites</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>n.isFavorite && !n.isDeleted).length}</span>
            </button>
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${viewMode==='trash'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-50 dark:hover:bg-gray-800'}`} onClick={()=>{setViewMode('trash'); setSelectedFolder(null);}}>
              <span className="flex items-center gap-2"><Trash2 className="w-4 h-4"/>Trash</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>n.isDeleted).length}</span>
            </button>
          </div>
        </div>

        {/* Folders removed for project-based organization */}

        {/* Notes */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between p-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{viewMode==='trash'?'Deleted Notes':viewMode==='favorites'?'Favorite Notes':'All Notes'} ({filteredNotes.length})</div>
            <div className="flex items-center gap-2">
              {viewMode==='trash' ? (
                <button
                  onMouseDown={async (e)=>{ e.preventDefault(); if (confirm('Permanently delete all notes in Trash?')) { await useStore.getState().emptyTrash(); } }}
                  className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Empty Trash"
                >
                  Empty
                </button>
              ) : (
                <button onClick={()=>createNote()} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="New Note"><Plus className="w-3 h-3 text-gray-500"/></button>
              )}
            </div>
          </div>
          <div className="px-3 pb-3 space-y-1 max-h-96 overflow-y-auto framed-scrollbar">
            {filteredNotes.map(n => (
              <div key={n.id} className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm ${activeNoteId===n.id?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <button onClick={()=>setActiveNote(n.id)} className="flex items-center gap-2 min-w-0 flex-1 text-left">
                  {/* Remove duplicate status icons next to title; keep clean title */}
                  <span className="truncate">{n.title || 'Untitled'}</span>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e)=>{ e.stopPropagation(); useStore.getState().updateNote(n.id, { isFavorite: !n.isFavorite }); }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={n.isFavorite ? 'Unfavorite' : 'Favorite'}
                    aria-label={n.isFavorite ? 'Unfavorite' : 'Favorite'}
                  >
                    <Heart className={`w-3 h-3 ${n.isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={(e)=>{ e.stopPropagation(); useStore.getState().setActiveNote(n.id); useStore.getState().requestEncryption?.(n.id); }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={n.isEncrypted ? 'Unlock (remove encryption)' : 'Encrypt note'}
                    aria-label={n.isEncrypted ? 'Unlock note' : 'Encrypt note'}
                  >
                    {n.isEncrypted ? (<Unlock className="w-3 h-3 text-gray-600" />) : (<Lock className="w-3 h-3 text-gray-500" />)}
                  </button>
                  
                  {/* Move to folder removed */}
                  <button
                    onClick={(e)=>{ e.stopPropagation(); exportNote(n, 'txt'); }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Download"
                    aria-label="Download note"
                  >
                    <Download className="w-3 h-3 text-gray-500" />
                  </button>
                  <button
                    onClick={async (e)=>{ e.stopPropagation(); if (navigator.share) { try { await navigator.share({ title: n.title, text: n.content }); } catch {} } else { navigator.clipboard.writeText(n.content); } }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Share"
                    aria-label="Share note"
                  >
                    <Share className="w-3 h-3 text-gray-500" />
                  </button>
                  {viewMode==='trash' ? (
                    <button
                      onClick={(e)=>{ e.stopPropagation(); useStore.getState().restoreNote(n.id); }}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Restore"
                      aria-label="Restore note"
                    >
                      <Plus className="w-3 h-3 text-gray-500" />
                    </button>
                  ) : (
                    <button
                      onClick={(e)=>{ e.stopPropagation(); useStore.getState().deleteNote(n.id); }}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Delete"
                      aria-label="Delete note"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
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
    </aside>
  );
};

export default Sidebar;
