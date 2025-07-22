import React, { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { useTheme } from '../../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useStore();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [tempSettings, setTempSettings] = useState(settings);

  // Update temp settings when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempSettings(settings);
    }
  }, [isOpen, settings]);

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
      disabled={disabled}
      onClick={() => onChange(!checked)}
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
    <div className="space-y-1">
      <SettingItem
        label="Theme"
        description="Choose your preferred color scheme"
      >
        <div className="flex space-x-2">
          {[
            { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
            { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
            { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
          ].map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                const newSettings = { ...tempSettings, theme: themeOption.value as any };
                setTempSettings(newSettings);
                updateSettings({ theme: themeOption.value as any });
              }}
              className={`p-2 rounded-md border transition-colors ${
                tempSettings.theme === themeOption.value
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
        label="Distraction-Free Mode"
        description="Hide all UI elements except the editor"
      >
        <Toggle
          checked={tempSettings.distractionFreeMode}
          onChange={(checked) => {
            const newSettings = { ...tempSettings, distractionFreeMode: checked };
            setTempSettings(newSettings);
            updateSettings({ distractionFreeMode: checked });
          }}
        />
      </SettingItem>
    </div>
  );

  const renderEditorSettings = () => (
    <div className="space-y-1">
      <SettingItem
        label="Font Family"
        description="Choose your preferred font for the editor"
      >
        <select
          value={tempSettings.fontFamily}
          onChange={(e) => {
            const newFontFamily = e.target.value;
            const newSettings = { ...tempSettings, fontFamily: newFontFamily };
            setTempSettings(newSettings);
            updateSettings({ fontFamily: newFontFamily });
          }}
          className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="Inter">Inter (Default)</option>
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
            onClick={() => {
              const newSize = Math.max(tempSettings.fontSize - 2, 12);
              const newSettings = { ...tempSettings, fontSize: newSize };
              setTempSettings(newSettings);
              updateSettings({ fontSize: newSize });
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Type className="w-3 h-3" />
          </button>
          <span className="text-sm font-mono w-8 text-center">{tempSettings.fontSize}</span>
          <button
            onClick={() => {
              const newSize = Math.min(tempSettings.fontSize + 2, 24);
              const newSettings = { ...tempSettings, fontSize: newSize };
              setTempSettings(newSettings);
              updateSettings({ fontSize: newSize });
            }}
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
          value={tempSettings.lineHeight}
          onChange={(e) => {
            const newLineHeight = parseFloat(e.target.value);
            const newSettings = { ...tempSettings, lineHeight: newLineHeight };
            setTempSettings(newSettings);
            updateSettings({ lineHeight: newLineHeight });
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
          checked={tempSettings.autoSave}
          onChange={(checked) => {
            const newSettings = { ...tempSettings, autoSave: checked };
            setTempSettings(newSettings);
            updateSettings({ autoSave: checked });
          }}
        />
      </SettingItem>

      <SettingItem
        label="Show Word Count"
        description="Display word and character count in status bar"
      >
        <Toggle
          checked={tempSettings.showWordCount}
          onChange={(checked) => {
            const newSettings = { ...tempSettings, showWordCount: checked };
            setTempSettings(newSettings);
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
          checked={tempSettings.autoLock}
          onChange={(checked) => {
            const newSettings = { ...tempSettings, autoLock: checked };
            setTempSettings(newSettings);
            updateSettings({ autoLock: checked });
          }}
        />
      </SettingItem>

      {tempSettings.autoLock && (
        <SettingItem
          label="Auto-Lock Timeout"
          description="Time before auto-lock activates"
        >
          <select
            value={tempSettings.autoLockTimeout}
            onChange={(e) => {
              const newTimeout = parseInt(e.target.value);
              const newSettings = { ...tempSettings, autoLockTimeout: newTimeout };
              setTempSettings(newSettings);
              updateSettings({ autoLockTimeout: newTimeout });
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
        description="Use fingerprint or face recognition when available"
      >
        <Toggle
          checked={tempSettings.biometricAuth}
          onChange={(checked) => {
            const newSettings = { ...tempSettings, biometricAuth: checked };
            setTempSettings(newSettings);
            updateSettings({ biometricAuth: checked });
          }}
          disabled={!('credentials' in navigator)}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'editor' && renderEditorSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'shortcuts' && renderShortcutsSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;