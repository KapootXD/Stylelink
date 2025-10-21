import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trash2, 
  Database,
  AlertTriangle,
  Info
} from 'lucide-react';
import Button from '../components/Button';
import { 
  clearPersistedData, 
  getStorageInfo,
  getUserPreferences,
  saveUserPreferences,
  updateLastVisit 
} from '../utils/localStorage';

const SettingsPage: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });
  const [preferences, setPreferences] = useState(getUserPreferences());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setStorageInfo(getStorageInfo());
    updateLastVisit();
  }, []);

  const handleClearData = () => {
    clearPersistedData();
    setStorageInfo(getStorageInfo());
    setLastUpdated(new Date());
    setShowClearConfirm(false);
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    saveUserPreferences(newPreferences);
    setLastUpdated(new Date());
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStoragePercentage = (): number => {
    return Math.round((storageInfo.used / storageInfo.available) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your StyleLink data and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Data Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
          </div>

          {/* Storage Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">{formatBytes(storageInfo.used)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-medium">{formatBytes(storageInfo.available)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getStoragePercentage()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {getStoragePercentage()}% of available storage used
              </p>
            </div>
          </div>

          {/* Clear Data */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Clear All Data</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Remove all saved likes, comments, and preferences
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
          
          <div className="space-y-6">
            {/* Theme Preference */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Theme</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose your preferred theme
                </p>
              </div>
              <select
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Receive notifications for new posts and interactions
                </p>
              </div>
              <button
                onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.notifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-lg border border-blue-200 p-6"
        >
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">About Data Storage</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your data is stored locally in your browser and includes your liked posts, 
                saved outfits, comments, and preferences. This data is not shared with 
                external servers and remains private to you.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all your saved likes, comments, and preferences. 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleClearData}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Clear Data
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
