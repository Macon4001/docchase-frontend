'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Users, Folder, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AuthClient } from '@/lib/auth-client';

interface Campaign {
  id: string;
  name: string;
  document_type: string;
  period: string;
  status: string;
  reminder_1_days?: number;
  reminder_2_days?: number;
  reminder_3_days?: number;
  reminder_send_time?: string;
  initial_message?: string;
  reminder_day_3: boolean;
  reminder_day_6: boolean;
  flag_after_day_9: boolean;
}

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [session, setSession] = useState<any>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [period, setPeriod] = useState('');
  const [reminder1Days, setReminder1Days] = useState(3);
  const [reminder2Days, setReminder2Days] = useState(6);
  const [reminder3Days, setReminder3Days] = useState(9);
  const [reminderSendTime, setReminderSendTime] = useState('10:00');
  const [initialMessage, setInitialMessage] = useState('Hi {client_name}, this is {practice_name}. We need your {document_type} for {period}. Please send them at your earliest convenience. Thank you!');
  const [reminderDay3, setReminderDay3] = useState(true);
  const [reminderDay6, setReminderDay6] = useState(true);
  const [flagAfterDay9, setFlagAfterDay9] = useState(true);

  useEffect(() => {
    const userSession = AuthClient.getSession();

    if (!userSession) {
      router.push('/login');
      return;
    }

    setSession(userSession);
    apiClient.setToken(userSession.token);
    loadCampaign();
  }, [router, campaignId]);

  const handleLogout = () => {
    AuthClient.logout();
  };

  const loadCampaign = async () => {
    try {
      const data = await apiClient.getCampaigns();
      const foundCampaign = data.campaigns?.find((c: Campaign) => c.id === campaignId);

      if (foundCampaign) {
        setCampaign(foundCampaign);
        setName(foundCampaign.name);
        setPeriod(foundCampaign.period);
        setReminder1Days(foundCampaign.reminder_1_days || 3);
        setReminder2Days(foundCampaign.reminder_2_days || 6);
        setReminder3Days(foundCampaign.reminder_3_days || 9);
        setReminderSendTime(foundCampaign.reminder_send_time || '10:00');
        setInitialMessage(foundCampaign.initial_message || 'Hi {client_name}, this is {practice_name}. We need your {document_type} for {period}. Please send them at your earliest convenience. Thank you!');
        setReminderDay3(foundCampaign.reminder_day_3);
        setReminderDay6(foundCampaign.reminder_day_6);
        setFlagAfterDay9(foundCampaign.flag_after_day_9);
      } else {
        setError('Campaign not found');
      }
    } catch (err) {
      console.error('Failed to load campaign:', err);
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await apiClient.updateCampaign(campaignId, {
        name,
        period,
        reminder_1_days: reminder1Days,
        reminder_2_days: reminder2Days,
        reminder_3_days: reminder3Days,
        reminder_send_time: reminderSendTime,
        initial_message: initialMessage,
        reminder_day_3: reminderDay3,
        reminder_day_6: reminderDay6,
        flag_after_day_9: flagAfterDay9,
      });

      router.push(`/campaigns/${campaignId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                DocChase
              </h1>
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || 'Campaign not found'}</AlertDescription>
          </Alert>
          <Link href="/campaigns">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  DocChase
                </h1>
                <p className="text-xs text-gray-500">{session?.user.practice_name || 'Dashboard'}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-600 px-3 py-1.5 bg-gray-100 rounded-lg">
                {session?.user.email}
              </span>
              <Link href="/clients">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Clients</span>
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Folder className="w-4 h-4" />
                  <span className="hidden sm:inline">Campaigns</span>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/campaigns/${campaignId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to campaign
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Campaign</CardTitle>
            <CardDescription>
              Update campaign settings and reminder schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {campaign.status !== 'draft' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>Note:</strong> This campaign is {campaign.status}. Changes will apply to future reminders.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., January 2024 Bank Statements"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="e.g., January 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialMessage">Initial Message Template</Label>
                <Textarea
                  id="initialMessage"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Enter the initial message that will be sent to clients..."
                  rows={4}
                  required
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Available variables: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{client_name}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{practice_name}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{document_type}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{period}'}</code>
                </p>
              </div>

              {/* Reminder Schedule Configuration */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <Label className="text-base font-semibold text-gray-900">Reminder Schedule</Label>
                    <p className="text-xs text-gray-600">Customize when reminders are sent to clients</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder1Days" className="text-sm font-medium text-gray-700">
                      First Reminder
                    </Label>
                    <div className="relative">
                      <Input
                        id="reminder1Days"
                        type="number"
                        min="1"
                        max="30"
                        value={reminder1Days}
                        onChange={(e) => setReminder1Days(parseInt(e.target.value) || 3)}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">After initial message</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder2Days" className="text-sm font-medium text-gray-700">
                      Second Reminder
                    </Label>
                    <div className="relative">
                      <Input
                        id="reminder2Days"
                        type="number"
                        min="1"
                        max="30"
                        value={reminder2Days}
                        onChange={(e) => setReminder2Days(parseInt(e.target.value) || 6)}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">After initial message</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder3Days" className="text-sm font-medium text-gray-700">
                      Mark as Stuck
                    </Label>
                    <div className="relative">
                      <Input
                        id="reminder3Days"
                        type="number"
                        min="1"
                        max="30"
                        value={reminder3Days}
                        onChange={(e) => setReminder3Days(parseInt(e.target.value) || 9)}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Flag unresponsive clients</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-200">
                  <Label htmlFor="reminderSendTime" className="text-sm font-medium text-gray-700">
                    Send Time
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="reminderSendTime"
                      type="time"
                      value={reminderSendTime}
                      onChange={(e) => setReminderSendTime(e.target.value)}
                      className="w-40"
                    />
                    <span className="text-sm text-gray-600">Time of day to send reminders</span>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3 text-xs text-gray-600">
                  <strong className="text-gray-700">Current settings:</strong> Reminders at {reminder1Days}, {reminder2Days}, and {reminder3Days} days
                  {reminderSendTime && ` • Sent at ${reminderSendTime}`}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href={`/campaigns/${campaignId}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
