import React, { useMemo, useRef } from 'react';
import { Heart, Lock, Unlock, X, Share, Download, GripVertical, CheckSquare, StickyNote } from 'lucide-react';
import { Note } from '../../types';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';

interface NoteCardProps {
  note: Note;
  projectColor: string;
  onOpen: () => void;
  onReorder: (dragId: string, hoverId: string) => void;
  showTagToggles?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, projectColor, onOpen, onReorder, showTagToggles = false }) => {
  const { toggleNoteFavorite, updateNote, deleteNote } = useStore();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = React.useState(false);

  const title = note.title || 'Untitled';
  const excerpt = useMemo(() => {
    const plain = (note.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return plain.length > 160 ? plain.slice(0, 157) + '…' : plain;
  }, [note.content]);

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', note.id);
    e.dataTransfer.effectAllowed = 'move';
    ref.current?.classList.add('opacity-50');
  };
  const handleDragEnd = () => {
    ref.current?.classList.remove('opacity-50');
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData('text/plain');
    if (dragId && dragId !== note.id) onReorder(dragId, note.id);
    setIsOver(false);
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };
  const handleDragLeave = () => {
    setIsOver(false);
  };

  return (
    <div
      ref={ref}
      className={`group relative bg-white dark:bg-gray-900 border ${isOver ? 'border-blue-400' : 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-sm hover:shadow transition-shadow h-44 overflow-hidden cursor-pointer`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={(e)=>{ e.preventDefault(); onOpen(); }}
      role="button"
      aria-label={`Open note ${title}`}
    >
      {/* Color bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: projectColor }} />
      {/* Actions */}
      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="p-1 text-gray-400 cursor-grab"><GripVertical className="w-3 h-3" /></span>
        <button
          onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); toggleNoteFavorite(note.id); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Favorite"
        >
          <Heart className={`w-3 h-3 ${note.isFavorite ? 'text-pink-500' : 'text-gray-500'}`} />
        </button>
        <button
          onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); updateNote(note.id, { isEncrypted: !note.isEncrypted }); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={note.isEncrypted ? 'Unlock' : 'Lock'}
        >
          {note.isEncrypted ? <Lock className="w-3 h-3 text-gray-600" /> : <Unlock className="w-3 h-3 text-gray-500" />}
        </button>
        <button
          onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); exportNote(note, 'txt'); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Download"
        >
          <Download className="w-3 h-3 text-gray-500" />
        </button>
        <button
          onMouseDown={async (e)=>{ e.preventDefault(); e.stopPropagation(); if (navigator.share) { try { await navigator.share({ title: note.title, text: note.content }); } catch (shareError) { console.warn('Share cancelled', shareError); } } else { void navigator.clipboard.writeText(note.content); } }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Share"
        >
          <Share className="w-3 h-3 text-gray-500" />
        </button>
        <button
          onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); deleteNote(note.id); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Delete"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      {/* Content */}
      <div className="h-full flex flex-col p-3">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{title}</div>
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {excerpt || '—'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          {showTagToggles ? (
            <div className="flex items-center gap-1">
              <button
                onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); const has = (note.tags||[]).includes('todo'); const next = has ? (note.tags||[]).filter(t=>t!=='todo') : ([...(note.tags||[]), 'todo']); updateNote(note.id, { tags: next }); }}
                className={`px-2 py-0.5 rounded text-[10px] ${ (note.tags||[]).includes('todo') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600' }`}
              >
                <span className="inline-flex items-center gap-1"><CheckSquare className="w-3 h-3"/>Todo</span>
              </button>
              <button
                onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); const has = (note.tags||[]).includes('note'); const next = has ? (note.tags||[]).filter(t=>t!=='note') : ([...(note.tags||[]), 'note']); updateNote(note.id, { tags: next }); }}
                className={`px-2 py-0.5 rounded text-[10px] ${ (note.tags||[]).includes('note') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600' }`}
              >
                <span className="inline-flex items-center gap-1"><StickyNote className="w-3 h-3"/>Note</span>
              </button>
            </div>
          ) : <div />}
          <div className="text-[10px] text-gray-400">{new Date(note.updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
