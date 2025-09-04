import React, { useMemo, useState } from 'react';
import { FileText, Heart, Trash2, Plus, Search, Lock, Code, Unlock, Download, Share, X, Bell } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { formatDate, exportNote } from '../../utils/helpers';
import Tooltip from '../Common/Tooltip';
import PopoverSelect from '../Common/PopoverSelect';

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
  const [assignForId, setAssignForId] = useState<string | null>(null);

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
          <button
            title="Notifications"
            aria-label="Notifications"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
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
                  <Tooltip content="Download">
                    <button
                      onClick={(e)=>{ e.stopPropagation(); exportNote(n, 'txt'); }}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      aria-label="Download note"
                    >
                      <Download className="w-3 h-3 text-gray-500" />
                    </button>
                  </Tooltip>
                  {/* Assign project/lane */}
                  {viewMode!=='trash' && (
                    <div className="relative">
                      <Tooltip content="Assign">
                        <button
                          onClick={(e)=>{ e.stopPropagation(); setAssignForId(assignForId===n.id?null:n.id); if (assignForId!==n.id) { if (n.projectId) { useStore.getState().loadLanes(n.projectId); } } }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          aria-label="Assign note"
                        >
                          <span className="text-[10px] px-1 text-gray-600">Assign</span>
                        </button>
                      </Tooltip>
                      {assignForId===n.id && (
                        <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-2 z-20 w-56" onMouseDown={(e)=>e.stopPropagation()}>
                          <div className="text-xs text-gray-500 mb-1">Project</div>
                          <PopoverSelect
                            value={n.projectId || ''}
                            options={useStore.getState().projects.map(p => ({ label: p.name, value: p.id }))}
                            onChange={async (projectId) => {
                              const { loadLanes, createLane, updateNote } = useStore.getState();
                              if (!projectId) return;
                              await loadLanes(projectId);
                              let lanes = useStore.getState().lanes.filter(l => l.projectId === projectId);
                              if (lanes.length === 0) {
                                await createLane(projectId, 'Notes');
                                await loadLanes(projectId);
                                lanes = useStore.getState().lanes.filter(l => l.projectId === projectId);
                              }
                              const defaultLane = lanes.find(l => l.name.toLowerCase()==='notes') || lanes[0];
                              await updateNote(n.id, { projectId, laneId: defaultLane?.id });
                            }}
                            buttonClassName="w-full px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            menuClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md"
                          />
                          <div className="text-xs text-gray-500 mt-2 mb-1">Lane</div>
                          <PopoverSelect
                            value={n.laneId || ''}
                            options={useStore.getState().lanes.filter(l => l.projectId === (n.projectId || '')).map(l => ({ label: l.name, value: l.id }))}
                            onChange={async (laneId) => {
                              if (!laneId) return;
                              await useStore.getState().updateNote(n.id, { laneId });
                              setAssignForId(null);
                            }}
                            buttonClassName="w-full px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            menuClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={async (e)=>{ e.stopPropagation(); if (navigator.share) { try { await navigator.share({ title: n.title, text: n.content }); } catch {} } else { navigator.clipboard.writeText(n.content); } }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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
