import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const FloatingActionButton: React.FC = () => {
  const { createNote } = useStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => createNote()}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg z-50 flex items-center justify-center md:hidden"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
};

export default FloatingActionButton;