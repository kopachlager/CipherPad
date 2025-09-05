import React, { useMemo, useRef } from 'react';
import { Heart, Lock, Unlock, X, Share, Download } from 'lucide-react';
import { Note } from '../../types';
import { useStore } from '../../hooks/useStore';
import { exportNote } from '../../utils/helpers';

interface NoteCardProps {
  note: Note;
  projectColor: string;
  onOpen: () => void;
  onReorder: (dragId: string, hoverId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, projectColor, onOpen, onReorder }) => {
  const { toggleNoteFavorite, updateNote, deleteNote } = useStore();
  const ref = useRef<HTMLDivElement | null>(null);

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
  };

  return (
    <div
      ref={ref}
      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow transition-shadow h-44 overflow-hidden cursor-pointer"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseDown={(e)=>{ e.preventDefault(); onOpen(); }}
      role="button"
      aria-label={`Open note ${title}`}
    >
      {/* Color bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: projectColor }} />
      {/* Actions */}
      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          onMouseDown={async (e)=>{ e.preventDefault(); e.stopPropagation(); if (navigator.share) { try { await navigator.share({ title: note.title, text: note.content }); } catch {} } else { navigator.clipboard.writeText(note.content); } }}
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
        <div className="mt-auto pt-2 text-[10px] text-gray-400">
          {new Date(note.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

