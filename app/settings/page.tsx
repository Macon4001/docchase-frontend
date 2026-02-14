'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthClient } from '@/lib/auth-client';
import { AppLayout } from '@/components/AppLayout';
import { Mail, FileText, FolderOpen, Rocket, AlertTriangle, User, Bot, Bell, AlertOctagon } from 'lucide-react';

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
  contactDetails: string;
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
  const [contactDetails, setContactDetails] = useState('');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationStuck, setNotificationStuck] = useState(true);

  // Danger zone state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<'documents' | 'clients' | 'account' | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Test email state
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

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
      setContactDetails(data.settings.contactDetails || '');
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
          contactDetails,
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

  const openDeleteModal = (type: 'documents' | 'clients' | 'account') => {
    setDeleteType(type);
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteType(null);
    setDeleteConfirmation('');
  };

  const handleDeleteData = async () => {
    if (!deleteType) return;

    setIsDeleting(true);
    setMessage(null);

    try {
      const session = AuthClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      if (deleteType === 'account') {
        // Account deletion
        const response = await fetch(`${API_URL}/api/settings/account`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ confirmation: deleteConfirmation })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete account');
        }

        // Account deleted successfully - logout and redirect
        AuthClient.logout();
        return;
      } else {
        // Data deletion (documents or clients)
        const response = await fetch(`${API_URL}/api/settings/data?type=${deleteType}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete data');
        }

        setMessage({
          type: 'success',
          text: `Successfully deleted ${data.deletedCount} ${deleteType}${data.googleDrive?.deleted ? ` and ${data.googleDrive.deleted} files from Google Drive` : ''}`
        });
        closeDeleteModal();
      }
    } catch (error: any) {
      console.error('Error deleting data:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete data' });
      setIsDeleting(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    setMessage(null);

    try {
      const session = AuthClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/notifications/test-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setMessage({
        type: 'success',
        text: `Test email sent to ${settings?.email}! Check your inbox.`
      });
    } catch (error: any) {
      console.error('Error sending test email:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send test email. Check your SMTP configuration.'
      });
    } finally {
      setSendingTestEmail(false);
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
    <AppLayout>
      <div className="max-w-4xl mx-auto">
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
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                  <p className="text-sm text-gray-600">Your email and practice details</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Amy Configuration */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Amy AI Assistant</h2>
                  <p className="text-sm text-gray-600">Configure your AI assistant</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assistant Name
                </label>
                <input
                  type="text"
                  value={amyName}
                  onChange={(e) => setAmyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Details
                </label>
                <textarea
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="e.g., Phone: 020 1234 5678 or Email: hello@yourpractice.com"
                  rows={3}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Amy will use this when clients need to contact you directly
                </p>
              </div>
            </div>
          </div>

          {/* Google Drive Integration */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
                    <p className="text-sm text-gray-600">Control your email preferences</p>
                  </div>
                </div>
                <button
                  onClick={handleSendTestEmail}
                  disabled={sendingTestEmail || !notificationEmail}
                  className="px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title={!notificationEmail ? "Enable email notifications first" : "Send a test email"}
                >
                  <Mail className="w-4 h-4" />
                  {sendingTestEmail ? 'Sending...' : 'Send Test Email'}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Email notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive email alerts for document uploads, campaign updates, and important events
                  </p>
                </div>
              </label>

              {notificationEmail && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-emerald-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationStuck}
                      onChange={(e) => setNotificationStuck(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Stuck client alerts</p>
                      <p className="text-sm text-gray-600">
                        Get notified when clients haven't responded after 9 days
                      </p>
                    </div>
                  </label>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-800" />
                      <p className="text-sm text-blue-800 font-semibold">
                        You'll receive emails for:
                      </p>
                    </div>
                    <ul className="mt-2 space-y-2 text-sm text-blue-700">
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        Document uploads from clients
                      </li>
                      <li className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 flex-shrink-0" />
                        Files saved to Google Drive
                      </li>
                      <li className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 flex-shrink-0" />
                        Campaign starts and completions
                      </li>
                      {notificationStuck && (
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          Clients who need follow-up
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {!notificationEmail && (
                <div className="ml-7 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    Enable email notifications to receive updates about your campaigns directly in your inbox.
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white shadow-sm border-2 border-red-300 rounded-lg overflow-hidden">
            <div className="border-b border-red-300 bg-red-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                  <p className="text-sm text-red-700">Permanent actions that cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="p-6">

            <div className="space-y-3">
              {/* Delete All Documents */}
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Delete All Documents</h3>
                  <p className="text-sm text-gray-600">Remove all uploaded documents and Google Drive files</p>
                </div>
                <button
                  onClick={() => openDeleteModal('documents')}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-100 border border-red-300 rounded-lg transition-colors"
                >
                  Delete Documents
                </button>
              </div>

              {/* Delete All Clients */}
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Delete All Clients</h3>
                  <p className="text-sm text-gray-600">Remove all clients, messages, and associated data</p>
                </div>
                <button
                  onClick={() => openDeleteModal('clients')}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-100 border border-red-300 rounded-lg transition-colors"
                >
                  Delete Clients
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 bg-red-100 border-2 border-red-400 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                </div>
                <button
                  onClick={() => openDeleteModal('account')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-lg transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
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

        {/* Deletion Confirmation Modal */}
        {showDeleteModal && deleteType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {deleteType === 'account' ? 'Delete Account' : deleteType === 'documents' ? 'Delete All Documents' : 'Delete All Clients'}
                  </h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                {deleteType === 'account' && (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      This will permanently delete your account and <strong>all associated data</strong>, including:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
                      <li>All clients and their information</li>
                      <li>All campaigns and messages</li>
                      <li>All documents (database and Google Drive)</li>
                      <li>Your account settings and preferences</li>
                    </ul>
                    <p className="text-sm font-medium text-red-700 mb-4">
                      To confirm, please type your email address: <span className="font-mono">{settings?.email}</span>
                    </p>
                  </>
                )}
                {deleteType === 'documents' && (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      This will permanently delete <strong>all documents</strong> from:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
                      <li>Your database records</li>
                      <li>Google Drive (if connected)</li>
                    </ul>
                    <p className="text-sm font-medium text-red-700 mb-4">
                      Type <span className="font-mono">DELETE</span> to confirm:
                    </p>
                  </>
                )}
                {deleteType === 'clients' && (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      This will permanently delete <strong>all clients</strong> and their:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
                      <li>Client information and contact details</li>
                      <li>All messages and conversation history</li>
                      <li>All documents (database and Google Drive)</li>
                      <li>Campaign associations</li>
                    </ul>
                    <p className="text-sm font-medium text-red-700 mb-4">
                      Type <span className="font-mono">DELETE</span> to confirm:
                    </p>
                  </>
                )}

                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={deleteType === 'account' ? settings?.email : 'DELETE'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteData}
                  disabled={
                    isDeleting ||
                    (deleteType === 'account'
                      ? deleteConfirmation !== settings?.email
                      : deleteConfirmation !== 'DELETE')
                  }
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
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
