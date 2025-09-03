import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Monitor, 
  Type, 
  Eye, 
  Lock, 
  Save,
  Palette,
  Keyboard,
  Shield,
  FileText
} from 'lucide-react';
import { useStore, defaultSettings } from '../../hooks/useStore';
import { useTheme } from '../../hooks/useTheme';
import { AnimatePresence, motion } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useStore();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  if (!isOpen) return null;

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'editor', label: 'Editor', icon: <Type className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
  ];

  const SettingItem: React.FC<{
    label: string;
    description?: string;
    children: React.ReactNode;
  }> = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</h4>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  const Toggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700'
          : checked 
            ? 'bg-gray-900 dark:bg-gray-100' 
            : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-4">
      <SettingItem
        label="Theme"
        description="Choose your preferred color scheme"
      >
        <div className="flex space-x-2">
          {[
            { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
            { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
            { value: 'paper', icon: <FileText className="w-4 h-4" />, label: 'Paper' },
            { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
          ].map((themeOption) => (
            <button
              key={themeOption.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); updateSettings({ theme: themeOption.value as any }); }}
              className={`p-2 rounded-md border transition-colors ${
                settings.theme === themeOption.value
                  ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={themeOption.label}
            >
              {themeOption.icon}
            </button>
          ))}
        </div>
      </SettingItem>

      <SettingItem
        label="Accent Color"
        description="Choose your preferred accent color"
      >
        <div className="flex space-x-2">
          {[
            { value: '#6b7280', label: 'Gray' },
            { value: '#3b82f6', label: 'Blue' },
            { value: '#10b981', label: 'Green' },
            { value: '#f59e0b', label: 'Yellow' },
            { value: '#ef4444', label: 'Red' },
            { value: '#8b5cf6', label: 'Purple' },
          ].map((color) => (
            <button
              key={color.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); updateSettings({ accentColor: color.value }); }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                settings.accentColor === color.value
                  ? 'border-gray-900 dark:border-gray-100 scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
      </SettingItem>

      <SettingItem
        label="Distraction-Free Mode"
        description="Hide all UI elements except the editor"
      >
        <Toggle
          checked={settings.distractionFreeMode}
          onChange={(checked) => {
            updateSettings({ distractionFreeMode: checked });
          }}
        />
      </SettingItem>
    </div>
  );

  const renderEditorSettings = () => (
    <div className="space-y-4">
      <SettingItem
        label="Font Family"
        description="Choose your preferred font for the editor"
      >
        <select
          value={settings.fontFamily}
          onChange={(e) => {
            updateSettings({ fontFamily: e.target.value });
          }}
          className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value={defaultSettings.fontFamily}>Inter (Default)</option>
          <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
          <option value="'Fira Code', monospace">Fira Code</option>
          <option value="'Source Code Pro', monospace">Source Code Pro</option>
          <option value="Monaco, monospace">Monaco</option>
          <option value="Consolas, monospace">Consolas</option>
          <option value="'Roboto Mono', monospace">Roboto Mono</option>
          <option value="'Ubuntu Mono', monospace">Ubuntu Mono</option>
        </select>
      </SettingItem>

      <SettingItem
        label="Font Size"
        description="Adjust the editor font size"
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const newSize = Math.max(settings.fontSize - 2, 12); updateSettings({ fontSize: newSize }); }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Type className="w-3 h-3" />
          </button>
          <span className="text-sm font-mono w-8 text-center">{settings.fontSize}</span>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); const newSize = Math.min(settings.fontSize + 2, 24); updateSettings({ fontSize: newSize }); }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </SettingItem>

      <SettingItem
        label="Line Height"
        description="Adjust line spacing for better readability"
      >
        <select
          value={settings.lineHeight}
          onChange={(e) => {
            updateSettings({ lineHeight: parseFloat(e.target.value) });
          }}
          className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value={1.2}>Tight (1.2)</option>
          <option value={1.4}>Normal (1.4)</option>
          <option value={1.6}>Relaxed (1.6)</option>
          <option value={1.8}>Loose (1.8)</option>
        </select>
      </SettingItem>

      <SettingItem
        label="Auto-Save"
        description="Automatically save changes as you type"
      >
        <Toggle
          checked={settings.autoSave}
          onChange={(checked) => {
            updateSettings({ autoSave: checked });
          }}
        />
      </SettingItem>

      <SettingItem
        label="Show Word Count"
        description="Display word and character count in status bar"
      >
        <Toggle
          checked={settings.showWordCount}
          onChange={(checked) => {
            updateSettings({ showWordCount: checked });
          }}
        />
      </SettingItem>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-1">
      <SettingItem
        label="Auto-Lock"
        description="Automatically lock the app after inactivity"
      >
        <Toggle
          checked={settings.autoLock}
          onChange={(checked) => {
            updateSettings({ autoLock: checked });
          }}
        />
      </SettingItem>

      {settings.autoLock && (
        <SettingItem
          label="Auto-Lock Timeout"
          description="Time before auto-lock activates"
        >
          <select
            value={settings.autoLockTimeout}
            onChange={(e) => {
              updateSettings({ autoLockTimeout: parseInt(e.target.value) });
            }}
            className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
            <option value={600000}>10 minutes</option>
            <option value={1800000}>30 minutes</option>
          </select>
        </SettingItem>
      )}

      <SettingItem
        label="Biometric Authentication"
        description="Coming soon — Passkeys/FaceID/TouchID integration"
      >
        <Toggle
          checked={false}
          onChange={() => {}}
          disabled={true}
        />
      </SettingItem>
    </div>
  );

  const renderShortcutsSettings = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>New Note</span>
            <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">Ctrl+N</kbd>
          </div>
          <div className="flex justify-between">
            <span>Toggle Sidebar</span>
            <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">Ctrl+B</kbd>
          </div>
          <div className="flex justify-between">
            <span>Search</span>
            <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">Ctrl+F</kbd>
          </div>
          <div className="flex justify-between">
            <span>Focus Mode</span>
            <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">Ctrl+Shift+D</kbd>
          </div>
          <div className="flex justify-between">
            <span>Save</span>
            <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">Ctrl+S</kbd>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4 pointer-events-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Reset all settings to defaults?')) {
                  updateSettings({ ...defaultSettings });
                }
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Reset to defaults
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4 pointer-events-auto">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab(tab.id); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <SettingsContentPane activeTab={activeTab}
            renderAppearance={renderAppearanceSettings}
            renderEditor={renderEditorSettings}
            renderSecurity={renderSecuritySettings}
            renderShortcuts={renderShortcutsSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

// Fixed-top, fade-switched content pane with stable frame height.
const SettingsContentPane: React.FC<{
  activeTab: string;
  renderAppearance: () => React.ReactNode;
  renderEditor: () => React.ReactNode;
  renderSecurity: () => React.ReactNode;
  renderShortcuts: () => React.ReactNode;
}> = ({ activeTab, renderAppearance, renderEditor, renderSecurity, renderShortcuts }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeTab]);

  return (
    <div className="flex-1 p-6">
      <div className="relative h-[380px] md:h-[420px] lg:h-[460px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            ref={contentRef}
            className="absolute inset-0 overflow-auto pr-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {activeTab === 'appearance' && renderAppearance()}
            {activeTab === 'editor' && renderEditor()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'shortcuts' && renderShortcuts()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
