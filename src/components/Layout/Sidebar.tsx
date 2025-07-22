import React, { useState } from 'react';
import {
  FileText,
  Folder,
  Star,
  Trash2,
  Plus,
  Search,
  X,
  Lock,
  Code,
  FolderOpen,
  MoreVertical,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

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
    deleteNote,
    restoreNote,
    setActiveNote,
    setSelectedFolder,
    updateNote,
  } = useStore();

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'trash'>('all');
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null);

  const filteredNotes = notes.filter((note) => {
    // Filter by view mode
    if (viewMode === 'trash' && !note.isDeleted) return false;
    if (viewMode === 'favorites' && !note.isFavorite) return false;
    if (viewMode === 'all' && note.isDeleted) return false;
    
    const matchesSearch = searchQuery
      ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesFolder = selectedFolderId
      ? note.folderId === selectedFolderId
      : !selectedFolderId || !note.folderId;
    
    return matchesSearch && matchesFolder;
  });

  const favoriteNotes = filteredNotes.filter((note) => note.isFavorite);
  const trashedNotes = notes.filter((note) => note.isDeleted);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim()).catch(console.error);
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(noteId);
  };

  const handleRestoreNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    restoreNote(noteId);
  };

  const handleMoveToFolder = (noteId: string, folderId: string | null) => {
    updateNote(noteId, { folderId });
    setShowMoveMenu(null);
  };

  const handleNoteClick = (noteId: string) => {
    console.log('Note clicked:', noteId);
    setActiveNote(noteId);
  };

  const QuickAccessItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    count?: number;
    active?: boolean;
    onClick: () => void;
  }> = ({ icon, label, count, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
        active
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  const MoveToFolderMenu: React.FC<{ noteId: string; currentFolderId?: string }> = ({ 
    noteId, 
    currentFolderId 
  }) => (
    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 min-w-32">
      <button
        onClick={() => handleMoveToFolder(noteId, null)}
        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
          !currentFolderId ? 'bg-gray-50 dark:bg-gray-700' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          <FileText className="w-3 h-3" />
          <span>No Folder</span>
        </div>
      </button>
      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => handleMoveToFolder(noteId, folder.id)}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
            currentFolderId === folder.id ? 'bg-gray-50 dark:bg-gray-700' : ''
          }`}
        >
          <div className="flex items-center space-x-2">
            <Folder className="w-3 h-3" style={{ color: folder.color }} />
            <span>{folder.name}</span>
          </div>
        </button>
      ))}
    </div>
  );

  // Close move menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowMoveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {sidebarOpen && (
        <aside className="w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                data-search-input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Quick Access
              </h3>
              <div className="space-y-1">
                <QuickAccessItem
                  icon={<FileText className="w-4 h-4" />}
                  label="All Notes"
                  count={notes.filter((n) => !n.isDeleted).length}
                  active={viewMode === 'all'}
                  onClick={() => {
                    setViewMode('all');
                    setSelectedFolder(null);
                  }}
                />
                <QuickAccessItem
                  icon={<Star className="w-4 h-4" />}
                  label="Favorites"
                  count={favoriteNotes.length}
                  active={viewMode === 'favorites'}
                  onClick={() => {
                    setViewMode('favorites');
                    setSelectedFolder(null);
                  }}
                />
                <QuickAccessItem
                  icon={<Trash2 className="w-4 h-4" />}
                  label="Trash"
                  count={trashedNotes.length}
                  active={viewMode === 'trash'}
                  onClick={() => {
                    setViewMode('trash');
                    setSelectedFolder(null);
                  }}
                />
              </div>
            </div>

            {/* Folders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Folders
                </h3>
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              
              {showNewFolder && (
                <div className="mb-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder();
                      if (e.key === 'Escape') setShowNewFolder(false);
                    }}
                    onBlur={handleCreateFolder}
                    placeholder="Folder name"
                    className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    autoFocus
                  />
                </div>
              )}

              <div className="space-y-1">
                {folders.map((folder) => (
                  <QuickAccessItem
                    key={folder.id}
                    icon={<Folder className="w-4 h-4" style={{ color: folder.color }} />}
                    label={folder.name}
                    count={notes.filter((n) => n.folderId === folder.id && !n.isDeleted).length}
                    active={selectedFolderId === folder.id}
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setViewMode('all');
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Notes List - Minimal One Line */}
            {filteredNotes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {viewMode === 'trash' ? 'Deleted Notes' : 
                   viewMode === 'favorites' ? 'Favorite Notes' : 
                   selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name || 'Folder Notes' :
                   'All Notes'}
                </h3>
                <div className="space-y-1">
                  {filteredNotes
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((note) => (
                      <div
                        key={note.id}
                        className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 ${
                          activeNoteId === note.id
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handleNoteClick(note.id)}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {note.isFavorite && (
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            )}
                            {note.isEncrypted && (
                              <Lock className="w-3 h-3 text-gray-500" />
                            )}
                            {note.isCodeMode && (
                              <Code className="w-3 h-3 text-gray-500" />
                            )}
                          </div>
                          <span className="text-sm font-medium truncate">
                            {note.title || 'Untitled'}
                          </span>
                          {note.folderId && (
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              in {folders.find(f => f.id === note.folderId)?.name}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMoveMenu(showMoveMenu === note.id ? null : note.id);
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                              title="Move to folder"
                            >
                              <FolderOpen className="w-3 h-3 text-gray-500" />
                            </button>
                            {showMoveMenu === note.id && (
                              <MoveToFolderMenu noteId={note.id} currentFolderId={note.folderId} />
                            )}
                          </div>
                          
                          {viewMode === 'trash' ? (
                            <button
                              onClick={(e) => handleRestoreNote(note.id, e)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                              title="Restore note"
                            >
                              <Plus className="w-3 h-3 text-gray-500" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleDeleteNote(note.id, e)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                              title="Delete note"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => createNote()}
                    className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Create your first note
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;