import React from 'react';
import type { Note } from '../../types';
import { Clock, Hash, Star } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  projectColor: string;
  onOpen: () => void;
  onReorder?: (dragId: string, hoverId: string) => void;
  showTagToggles?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, projectColor, onOpen, onReorder, showTagToggles }) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', note.id);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const dragId = event.dataTransfer.getData('text/plain');
    if (dragId && dragId !== note.id) {
      onReorder?.(dragId, note.id);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onOpen}
      draggable={Boolean(onReorder)}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: projectColor }} />
          <span className="text-xs uppercase tracking-wide text-gray-500">
            {note.tags && note.tags.length > 0 ? note.tags.join(', ') : 'Note'}
          </span>
        </div>
        {note.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-300" />}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
          {note.title || 'Untitled Note'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {note.isCodeMode ? 'Code snippet' : note.content.replace(/<[^>]+>/g, ' ')}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {note.updatedAt ? note.updatedAt.toLocaleDateString() : '—'}
        </span>
        <span className="flex items-center gap-1">
          <Hash className="w-3 h-3" />
          {note.language || 'plaintext'}
        </span>
      </div>
      {showTagToggles && (
        <div className="flex items-center gap-2 flex-wrap">
          {['todo', 'note'].map((tag) => {
            const active = note.tags?.includes(tag);
            return (
              <span
                key={tag}
                className={`px-2 py-1 text-xs rounded-full border ${
                  active
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-600 border-gray-200 dark:border-gray-700'
                }`}
              >
                {tag.toUpperCase()}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NoteCard;
