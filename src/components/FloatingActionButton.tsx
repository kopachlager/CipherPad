import React from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const FloatingActionButton: React.FC = () => {
  const { createNote } = useStore();

  return (
    <button
      onClick={() => createNote()}
      className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-full shadow-2xl z-50 flex items-center justify-center md:hidden transition-all duration-150 hover:scale-105"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default FloatingActionButton;