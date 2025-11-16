import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-md w-full p-6 text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The standalone editor keeps settings local for now. Future versions can reintroduce advanced preferences here.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
