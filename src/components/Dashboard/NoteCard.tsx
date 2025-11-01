import React, { useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { Heart, Lock, Unlock, X, Share, Download, GripVertical, CheckSquare, StickyNote } from 'lucide-react';
import type { Note } from '../../types';
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
  const { toggleNoteFavorite, updateNote, deleteNote } = useStore(
    (state) => ({
      toggleNoteFavorite: state.toggleNoteFavorite,
      updateNote: state.updateNote,
      deleteNote: state.deleteNote,
    }),
    shallow
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = React.useState(false);

  const title = note.title || 'Untitled';
  const excerpt = useMemo(() => {
    const plain = (note.content || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return plain.length > 160 ? `${plain.slice(0, 157)}…` : plain;
  }, [note.content]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', note.id);
    event.dataTransfer.effectAllowed = 'move';
    ref.current?.classList.add('opacity-60');
  };

  const handleDragEnd = () => {
    ref.current?.classList.remove('opacity-60');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dragId = event.dataTransfer.getData('text/plain');
    if (dragId && dragId !== note.id) {
      onReorder(dragId, note.id);
    }
    setIsOver(false);
  };

  return (
    <div
      ref={ref}
      className={`group relative h-44 overflow-hidden rounded-xl border bg-white shadow transition-shadow dark:bg-gray-900 ${
        isOver ? 'border-blue-300 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      onMouseDown={(e) => {
        e.preventDefault();
        onOpen();
      }}
      role="button"
      aria-label={`Open note ${title}`}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: projectColor }} />

      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/80 px-1.5 py-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:bg-gray-900/90">
        <span className="cursor-grab p-1 text-gray-400" title="Drag to reorder">
          <GripVertical className="h-3 w-3" />
        </span>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNoteFavorite(note.id);
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle favorite"
        >
          <Heart className={`h-3 w-3 ${note.isFavorite ? 'text-pink-500' : 'text-gray-500'}`} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateNote(note.id, { isEncrypted: !note.isEncrypted });
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={note.isEncrypted ? 'Unlock note' : 'Lock note'}
        >
          {note.isEncrypted ? <Unlock className="h-3 w-3 text-gray-600" /> : <Lock className="h-3 w-3 text-gray-500" />}
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            exportNote(note, 'txt');
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Download note"
        >
          <Download className="h-3 w-3 text-gray-500" />
        </button>
        <button
          onMouseDown={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (navigator.share) {
              try {
                await navigator.share({ title: note.title, text: note.content });
              } catch (shareError) {
                console.warn('Share action was not completed', shareError);
              }
            } else {
              void navigator.clipboard.writeText(note.content);
            }
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Share note"
        >
          <Share className="h-3 w-3 text-gray-500" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteNote(note.id);
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Delete note"
        >
          <X className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      <div className="flex h-full flex-col p-3">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{title}</div>
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {excerpt || '—'}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2 text-[10px] text-gray-400">
          {showTagToggles ? (
            <div className="flex items-center gap-1">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const hasTodo = (note.tags || []).includes('todo');
                  const nextTags = hasTodo ? (note.tags || []).filter((tag) => tag !== 'todo') : [...(note.tags || []), 'todo'];
                  updateNote(note.id, { tags: nextTags });
                }}
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 ${ (note.tags || []).includes('todo') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }`}
              >
                <CheckSquare className="h-3 w-3" />
                Todo
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const hasNote = (note.tags || []).includes('note');
                  const nextTags = hasNote ? (note.tags || []).filter((tag) => tag !== 'note') : [...(note.tags || []), 'note'];
                  updateNote(note.id, { tags: nextTags });
                }}
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 ${ (note.tags || []).includes('note') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }`}
              >
                <StickyNote className="h-3 w-3" />
                Note
              </button>
            </div>
          ) : (
            <span />
          )}
          <span>{new Date(note.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
