import React, { useMemo, useState } from 'react';
import { FileText, Folder, Star, Trash2, Plus, Search, Lock, Code, Unlock, Download, Share, FolderOpen, X } from 'lucide-react';
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
  const [showMoveMenuFor, setShowMoveMenuFor] = useState<string | null>(null);

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
              <span className="flex items-center gap-2"><Star className="w-4 h-4"/>Favorites</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>n.isFavorite && !n.isDeleted).length}</span>
            </button>
            <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${viewMode==='trash'?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-50 dark:hover:bg-gray-800'}`} onClick={()=>{setViewMode('trash'); setSelectedFolder(null);}}>
              <span className="flex items-center gap-2"><Trash2 className="w-4 h-4"/>Trash</span>
              <span className="text-xs text-gray-500">{notes.filter(n=>n.isDeleted).length}</span>
            </button>
          </div>
        </div>

        {/* Folders */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Folders</div>
            <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" onClick={()=>setShowNewFolder(v=>!v)} title="New Folder"><Plus className="w-3 h-3 text-gray-500"/></button>
          </div>
          <div className="px-3 pb-3 space-y-1">
            {showNewFolder && (
              <div className="flex items-center gap-2 mb-2">
                <input value={newFolderName} onChange={(e)=>setNewFolderName(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') addFolder(); if(e.key==='Escape'){ setShowNewFolder(false); setNewFolderName(''); } }} className="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded" placeholder="Folder name" autoFocus />
                <button onClick={addFolder} className="px-2 py-1 text-xs rounded bg-gray-900 text-white hover:bg-gray-800">Add</button>
              </div>
            )}
            {folders.map(f => (
              <button key={f.id} onClick={()=>{ setSelectedFolder(f.id); setViewMode('all'); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${selectedFolderId===f.id?'bg-gray-100 dark:bg-gray-800':'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: f.color }} />
                <span className="truncate flex-1 text-left">{f.name}</span>
                <span className="text-xs text-gray-500">{notes.filter(n=>n.folderId===f.id && !n.isDeleted).length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between p-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{viewMode==='trash'?'Deleted Notes':viewMode==='favorites'?'Favorite Notes':selectedFolderId?'Folder Notes':'All Notes'} ({filteredNotes.length})</div>
            <button onClick={()=>createNote()} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="New Note"><Plus className="w-3 h-3 text-gray-500"/></button>
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
                    <Star className={`w-3 h-3 ${n.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={(e)=>{ e.stopPropagation(); useStore.getState().setActiveNote(n.id); useStore.getState().requestEncryption?.(n.id); }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={n.isEncrypted ? 'Unlock (remove encryption)' : 'Encrypt note'}
                    aria-label={n.isEncrypted ? 'Unlock note' : 'Encrypt note'}
                  >
                    {n.isEncrypted ? (<Unlock className="w-3 h-3 text-gray-600" />) : (<Lock className="w-3 h-3 text-gray-500" />)}
                  </button>
                  <button
                    onClick={(e)=>{ e.stopPropagation(); setActiveNote(n.id); }}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    title={formatDate(new Date(n.updatedAt))}
                  >
                    {formatDate(new Date(n.updatedAt))}
                  </button>
                  <button
                    onClick={(e)=>{ e.stopPropagation(); useStore.getState().updateNote(n.id, { isFavorite: !n.isFavorite }); }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={n.isFavorite ? 'Unfavorite' : 'Favorite'}
                  >
                    <Star className={`w-3 h-3 ${n.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={(e)=>{ e.stopPropagation(); useStore.getState().updateNote(n.id, { isEncrypted: !n.isEncrypted }); }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title={n.isEncrypted ? 'Unlock (remove encryption)' : 'Encrypt note'}
                    aria-label={n.isEncrypted ? 'Unlock note' : 'Encrypt note'}
                  >
                    {n.isEncrypted ? (<Unlock className="w-3 h-3 text-gray-600" />) : (<Lock className="w-3 h-3 text-gray-500" />)}
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e)=>{ e.stopPropagation(); setShowMoveMenuFor(showMoveMenuFor===n.id?null:n.id); }}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Move to folder"
                      aria-label="Move to folder"
                    >
                      <FolderOpen className="w-3 h-3 text-gray-500" />
                    </button>
                    {showMoveMenuFor===n.id && (
                      <div className="absolute right-0 top-6 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-40 p-1">
                        <button
                          onClick={(e)=>{ e.stopPropagation(); useStore.getState().updateNote(n.id, { folderId: undefined }); setShowMoveMenuFor(null); }}
                          className={`w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${!n.folderId ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                        >No Folder</button>
                        {folders.map(f => (
                          <button key={f.id}
                            onClick={(e)=>{ e.stopPropagation(); useStore.getState().updateNote(n.id, { folderId: f.id }); setShowMoveMenuFor(null); }}
                            className={`w-full text-left px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${n.folderId===f.id ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                          >
                            <span className="inline-block w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: f.color }} />{f.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
