import React, { useState } from 'react';
import {
  FileText,
  Folder,
  Star,
  Trash2,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  Download,
  Share,
  X,
  Edit3,
} from 'lucide-react';
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
    deleteNote,
    restoreNote,
    setActiveNote,
    setSelectedFolder,
  } = useStore();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'trash'>('all');

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

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDownloadNote = (note: any, e: React.MouseEvent) => {
    e.stopPropagation();
    exportNote(note, 'txt');
  };

  const handleShareNote = async (note: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(note.content);
    }
  };

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
      </div>
      )}
    </button>
  );

  const NoteItem: React.FC<{ note: any }> = ({ note }) => (
    <div
      className={`w-full text-left p-3 rounded-md transition-colors duration-150 border group ${
        activeNoteId === note.id
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
      }`}
    >
      <div onClick={() => setActiveNote(note.id)} className="cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {note.title || 'Untitled'}
        </h4>
        <div className="flex items-center space-x-1">
          {note.isFavorite && (
            <Star className="w-3 h-3 text-gray-600 dark:text-gray-400 fill-current" />
          )}
          {note.isEncrypted && (
            <div className="w-2 h-2 bg-gray-400 rounded-full" title="Encrypted" />
          )}
        </div>
      </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">
        {note.content || 'No content'}
      </p>
      <span className="text-xs text-gray-400 dark:text-gray-500">
        {formatDate(new Date(note.updatedAt))}
      </span>
      
      <div className="flex items-center justify-between mt-2">
        <select
          value={note.folderId || ''}
          onChange={(e) => handleMoveToFolder(note.id, e.target.value || null)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-gray-600 dark:text-gray-400"
        >
          <option value="">No Folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        
      <div className="flex items-center justify-end space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={(e) => handleDownloadNote(note, e)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
          title="Download note"
        >
          <Download className="w-3 h-3 text-gray-500" />
        </button>
        <button
          onClick={(e) => handleShareNote(note, e)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
          title="Share note"
        >
          <Share className="w-3 h-3 text-gray-500" />
        </button>
        {viewMode === 'trash' ? (
          <button
            onClick={(e) => handleRestoreNote(note.id, e)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
            title="Restore note"
          >
            <Edit3 className="w-3 h-3 text-gray-500" />
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
  );

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
                  onClick={() => setViewMode('all')}
                />
                <QuickAccessItem
                  icon={<Star className="w-4 h-4" />}
                  label="Favorites"
                  count={favoriteNotes.length}
                  active={viewMode === 'favorites'}
                  onClick={() => setViewMode('favorites')}
                />
                <QuickAccessItem
                  icon={<Trash2 className="w-4 h-4" />}
                  label="Trash"
                  count={trashedNotes.length}
                  active={viewMode === 'trash'}
                  onClick={() => setViewMode('trash')}
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
                  <div key={folder.id}>
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        {expandedFolders.has(folder.id) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>
                      <QuickAccessItem
                        icon={<Folder className="w-4 h-4" style={{ color: folder.color }} />}
                        label={folder.name}
                        count={notes.filter((n) => n.folderId === folder.id && !n.isDeleted).length}
                        active={selectedFolderId === folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes List */}
            {filteredNotes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {viewMode === 'trash' ? 'Deleted Notes' : viewMode === 'favorites' ? 'Favorite Notes' : 'All Notes'}
                </h3>
                <div className="space-y-2">
                  {filteredNotes
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((note) => (
                    <NoteItem key={note.id} note={note} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;