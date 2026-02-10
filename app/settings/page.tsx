'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthClient } from '@/lib/auth-client';

// Helper to ensure URL has protocol
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return 'http://localhost:3001';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const API_URL = ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL);

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

function SettingsContent() {
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

      const response = await fetch(`${API_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Settings API error:', response.status, errorData);

        if (response.status === 401) {
          // Token is invalid, logout
          AuthClient.logout();
          return;
        }

        throw new Error(errorData.error || `Failed to fetch settings (${response.status})`);
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

      const response = await fetch(`${API_URL}/api/settings`, {
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

      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
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

      const response = await fetch(`${API_URL}/api/settings/google-auth`, {
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

      const response = await fetch(`${API_URL}/api/settings/google`, {
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
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 87.3 78">
                    <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/>
                    <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"/>
                    <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/>
                    <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/>
                    <path fill="#2684fc" d="m59.8 53-5.852-11.5h-13.748l-13.75 23.8 5.852 11.5h18.5c1.6 0 3.15-.45 4.5-1.2z"/>
                    <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Google Drive</h2>
                  <p className="text-sm text-gray-600">Store client documents securely</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {settings?.googleDriveConnected ? (
                <div className="space-y-4">
                  {/* Connected Status */}
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-900">Connected Successfully</p>
                      <p className="text-sm text-emerald-700 mt-1">
                        Documents will be saved to your "Amy Documents" folder
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-emerald-700">
                          Connected {settings.googleDriveConnectedAt
                            ? new Date(settings.googleDriveConnectedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'recently'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto-upload</p>
                        <p className="text-xs text-gray-600">Documents saved automatically</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Secure storage</p>
                        <p className="text-xs text-gray-600">Your data stays in your Drive</p>
                      </div>
                    </div>
                  </div>

                  {/* Disconnect Button */}
                  <button
                    onClick={handleDisconnectGoogleDrive}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                  >
                    Disconnect Google Drive
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Connect your Google Drive to automatically organize and store client documents in a dedicated folder.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-700">Automatic document backup</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-700">Organized in client folders</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-700">Accessible from anywhere</p>
                    </div>
                  </div>

                  <button
                    onClick={handleConnectGoogleDrive}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-blue-400 rounded-lg transition-all shadow-sm hover:shadow"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 87.3 78">
                      <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/>
                      <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"/>
                      <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/>
                      <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/>
                      <path fill="#2684fc" d="m59.8 53-5.852-11.5h-13.748l-13.75 23.8 5.852 11.5h18.5c1.6 0 3.15-.45 4.5-1.2z"/>
                      <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
                    </svg>
                    <span className="font-semibold text-gray-900">Connect Google Drive</span>
                  </button>
                </div>
              )}
            </div>
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
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
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
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
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
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
