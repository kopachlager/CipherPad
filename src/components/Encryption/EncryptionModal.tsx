import React, { useState } from 'react';
import { X, Lock, Unlock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { encryptData, decryptData } from '../../utils/crypto';

interface EncryptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: any;
  onSave: (encryptedContent: string, isEncrypted: boolean) => void;
}

const EncryptionModal: React.FC<EncryptionModalProps> = ({
  isOpen,
  onClose,
  note,
  onSave,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(note?.isEncrypted || false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (isDecrypting) {
      // Decrypt the note
      try {
        const decryptedContent = decryptData(note.content, password);
        if (!decryptedContent) {
          setError('Invalid password or corrupted data');
          return;
        }
        onSave(decryptedContent, false);
        setPassword('');
        setConfirmPassword('');
        onClose();
      } catch (err) {
        setError('Failed to decrypt note. Please check your password.');
      }
    } else {
      // Encrypt the note
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      try {
        const encryptedContent = encryptData(note.content, password);
        onSave(encryptedContent, true);
        setPassword('');
        setConfirmPassword('');
        onClose();
      } catch (err) {
        setError('Failed to encrypt note');
      }
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {isDecrypting ? (
              <Unlock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isDecrypting ? 'Decrypt Note' : 'Encrypt Note'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isDecrypting && (
            <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Important:</p>
                <p>If you forget your password, you won't be able to decrypt this note. Make sure to use a password you'll remember.</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isDecrypting ? 'Enter password to decrypt' : 'Create encryption password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isDecrypting && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-md transition-colors"
            >
              {isDecrypting ? 'Decrypt' : 'Encrypt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EncryptionModal;