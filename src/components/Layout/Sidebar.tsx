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
  Unlock,
  Download,
  Share,
  ChevronDown,
  ChevronRight,
  Calendar,
  SortAsc,
  SortDesc,
  Filter,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';
import { formatDate } from '../../utils/helpers';

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
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title' | 'size'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [groupBy, setGroupBy] = useState<'none' | 'folder' | 'date' | 'tag'>('none');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'size':
        comparison = a.content.length - b.content.length;
        break;
      case 'updated':
      default:
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Group notes
  const groupedNotes = React.useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Notes': sortedNotes };
    }
    
    const groups: { [key: string]: typeof sortedNotes } = {};
    
    sortedNotes.forEach(note => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'folder':
          if (note.folderId) {
            const folder = folders.find(f => f.id === note.folderId);
            groupKey = folder ? folder.name : 'Unknown Folder';
          } else {
            groupKey = 'No Folder';
          }
          break;
        case 'date':
          const date = new Date(note.updatedAt);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          
          if (date.toDateString() === today.toDateString()) {
            groupKey = 'Today';
          } else if (date.toDateString() === yesterday.toDateString()) {
            groupKey = 'Yesterday';
          } else if (date > weekAgo) {
            groupKey = 'This Week';
          } else {
            groupKey = 'Older';
          }
          break;
        case 'tag':
          if (note.tags.length > 0) {
            groupKey = note.tags[0]; // Use first tag
          } else {
            groupKey = 'No Tags';
          }
          break;
        default:
          groupKey = 'All Notes';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(note);
    });
    
    return groups;
  }, [sortedNotes, groupBy, folders]);

  const toggleGroup = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };
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
        <aside className="w-80 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xs border border-gray-200 dark:border-gray-700">
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
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xs border border-gray-200 dark:border-gray-700">
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
            {sortedNotes.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-xs border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {viewMode === 'trash' ? 'Deleted Notes' : 
                     viewMode === 'favorites' ? 'Favorite Notes' : 
                     selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name || 'Folder Notes' :
                     'All Notes'} ({sortedNotes.length})
                  </h3>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        showFilters ? 'bg-gray-200 dark:bg-gray-700' : ''
                      }`}
                      title="Filters & Sort"
                    >
                      <Filter className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
                      <div className="flex items-center space-x-1">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
                        >
                          <option value="updated">Last Modified</option>
                          <option value="created">Date Created</option>
                          <option value="title">Title</option>
                          <option value="size">Size</option>
                        </select>
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                          {sortOrder === 'asc' ? 
                            <SortAsc className="w-3 h-3" /> : 
                            <SortDesc className="w-3 h-3" />
                          }
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Group by:</span>
                      <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value as any)}
                        className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
                      >
                        <option value="none">No Grouping</option>
                        <option value="folder">Folder</option>
                        <option value="date">Date Modified</option>
                        <option value="tag">Tags</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-96 overflow-y-auto framed-scrollbar">
                  {Object.entries(groupedNotes).map(([groupName, groupNotes]) => (
                    <div key={groupName}>
                      {groupBy !== 'none' && (
                        <button
                          onClick={() => toggleGroup(groupName)}
                          className="w-full flex items-center justify-between px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        </div>
                        >
                          <div className="flex items-center space-x-2">
                            {collapsedGroups.has(groupName) ? 
                              <ChevronRight className="w-3 h-3" /> : 
                              <ChevronDown className="w-3 h-3" />
                            }
                            <span>{groupName}</span>
                          </div>
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {groupNotes.length}
                          </span>
                        </button>
                      )}
                      
                      {(!collapsedGroups.has(groupName) || groupBy === 'none') && (
                        <div className="space-y-1">
                          {groupNotes.map((note) => (
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
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">
                                    {note.title || 'Untitled'}
                                  </div>
                                  <div className="text-xs text-gray-400 truncate">
                                    {formatDate(note.updatedAt)} • {note.content.length} chars
                                    {note.folderId && groupBy !== 'folder' && (
                                      <span> • {folders.find(f => f.id === note.folderId)?.name}</span>
                                    )}
                                  </div>
                                </div>
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
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateNote(note.id, { isEncrypted: !note.isEncrypted });
                                  }}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                                  title={note.isEncrypted ? "Remove encryption" : "Encrypt note"}
                                >
                                  {note.isEncrypted ? (
                                    <Lock className="w-3 h-3 text-gray-500" />
                                  ) : (
                                    <Unlock className="w-3 h-3 text-gray-500" />
                                  )}
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportNote(note, 'txt');
                                  }}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                                  title="Download note"
                                >
                                  <Download className="w-3 h-3 text-gray-500" />
                                </button>
                                
                                <button
                                  onClick={async (e) => {
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
                                  }}
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
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sortedNotes.length === 0 && (
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