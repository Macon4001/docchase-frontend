'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthClient } from '@/lib/auth-client';

interface Settings {
  email: string;
  practiceName: string;
  amyName: string;
  amyTone: string;
  googleDriveConnected: boolean;
  googleDriveConnectedAt: string | null;
  notificationEmail: boolean;
  notificationStuck: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [practiceName, setPracticeName] = useState('');
  const [amyName, setAmyName] = useState('');
  const [amyTone, setAmyTone] = useState('friendly');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationStuck, setNotificationStuck] = useState(true);

  useEffect(() => {
    // Check for OAuth callback success/error
    const googleStatus = searchParams.get('google');
    const errorParam = searchParams.get('error');

    if (googleStatus === 'connected') {
      setMessage({ type: 'success', text: 'Google Drive connected successfully!' });
      // Clear the URL parameters
      window.history.replaceState({}, '', '/settings');
    } else if (errorParam) {
      const errorMessages: Record<string, string> = {
        google_denied: 'You denied access to Google Drive',
        google_failed: 'Failed to connect Google Drive. Please try again.',
        no_code: 'Invalid OAuth response from Google',
        no_state: 'Invalid OAuth state'
      };
      setMessage({
        type: 'error',
        text: errorMessages[errorParam] || 'An error occurred with Google Drive connection'
      });
      window.history.replaceState({}, '', '/settings');
    }

    fetchSettings();
  }, [searchParams]);

  const fetchSettings = async () => {
    try {
      const session = AuthClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/settings', {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings);

      // Populate form
      setPracticeName(data.settings.practiceName);
      setAmyName(data.settings.amyName);
      setAmyTone(data.settings.amyTone);
      setNotificationEmail(data.settings.notificationEmail);
      setNotificationStuck(data.settings.notificationStuck);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const session = AuthClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          practiceName,
          amyName,
          amyTone,
          notificationEmail,
          notificationStuck
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGoogleDrive = async () => {
    try {
      const session = AuthClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/settings/google-auth', {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get Google auth URL');
      }

      const data = await response.json();

      // Redirect to Google OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error connecting Google Drive:', error);
      setMessage({ type: 'error', text: 'Failed to start Google Drive connection' });
    }
  };

  const handleDisconnectGoogleDrive = async () => {
    if (!confirm('Are you sure you want to disconnect Google Drive? Documents will no longer be uploaded.')) {
      return;
    }

    try {
      const session = AuthClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/settings/google', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect Google Drive');
      }

      setMessage({ type: 'success', text: 'Google Drive disconnected' });
      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
      setMessage({ type: 'error', text: 'Failed to disconnect Google Drive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Practice Name
                </label>
                <input
                  type="text"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Amy Configuration */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Amy AI Assistant</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assistant Name
                </label>
                <input
                  type="text"
                  value={amyName}
                  onChange={(e) => setAmyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Amy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <select
                  value={amyTone}
                  onChange={(e) => setAmyTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Google Drive Integration */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Google Drive Integration</h2>
            <p className="text-gray-600 mb-4">
              Connect your Google Drive to automatically save client documents.
            </p>

            {settings?.googleDriveConnected ? (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Connected to Google Drive</p>
                      <p className="text-sm text-green-700">
                        Connected on {settings.googleDriveConnectedAt
                          ? new Date(settings.googleDriveConnectedAt).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectGoogleDrive}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnectGoogleDrive}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Connect Google Drive</span>
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Email notifications</p>
                  <p className="text-sm text-gray-600">Receive email updates about campaigns</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationStuck}
                  onChange={(e) => setNotificationStuck(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Stuck client alerts</p>
                  <p className="text-sm text-gray-600">Get notified when clients haven't responded</p>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
