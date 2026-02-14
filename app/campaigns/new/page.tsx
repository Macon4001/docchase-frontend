'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AuthClient } from '@/lib/auth-client';
import { AppLayout } from '@/components/AppLayout';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [period, setPeriod] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState('');

  // Custom reminder schedule settings
  const [reminder1Days, setReminder1Days] = useState(3);
  const [reminder2Days, setReminder2Days] = useState(6);
  const [reminder3Days, setReminder3Days] = useState(9);
  const [reminderSendTime, setReminderSendTime] = useState('10:00');
  const [initialMessage, setInitialMessage] = useState(
    'Hi {client_name}, this is {practice_name}. We need your {document_type} for {period}. Please send them at your earliest convenience. Thank you!'
  );

  useEffect(() => {
    const userSession = AuthClient.getSession();

    if (!userSession) {
      router.push('/login');
      return;
    }

    apiClient.setToken(userSession.token);
    loadClients();
  }, [router]);

  const loadClients = async () => {
    try {
      const data = await apiClient.getClients();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoadingClients(false);
    }
  };

  const toggleClient = (clientId: string) => {
    setSelectedClientIds(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleAll = () => {
    if (selectedClientIds.length === clients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(clients.map(c => c.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedClientIds.length === 0) {
      setError('Please select at least one client');
      return;
    }

    setLoading(true);

    try {
      await apiClient.createCampaign({
        name,
        period,
        document_type: 'bank_statement',
        client_ids: selectedClientIds,
        reminder_1_days: reminder1Days,
        reminder_2_days: reminder2Days,
        reminder_3_days: reminder3Days,
        reminder_send_time: reminderSendTime,
        initial_message: initialMessage,
      });

      router.push('/campaigns');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClients) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to campaigns
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>
              Start a new document collection campaign for your clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
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

              {/* Initial Message Template */}
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
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
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

                <div className="space-y-2 pt-2 border-t border-primary/20">
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
                  <strong className="text-gray-700">Example:</strong> With settings of 3, 6, and 9 days, clients will receive:
                  <ul className="list-disc list-inside mt-1 space-y-0.5 ml-2">
                    <li>First reminder after 3 days of no response</li>
                    <li>Second reminder after 6 days of no response</li>
                    <li>Flagged as "failed" after 9 days of no response</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Select Clients</Label>
                  {clients.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleAll}
                    >
                      {selectedClientIds.length === clients.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  )}
                </div>

                {loadingClients ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="p-8 border-2 border-dashed rounded-lg text-center">
                    <p className="text-muted-foreground mb-4">No clients yet</p>
                    <Link href="/clients">
                      <Button type="button" variant="outline" size="sm">
                        Add Clients First
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="border rounded-lg divide-y">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center space-x-3 p-3 hover:bg-primary/5 transition-colors"
                      >
                        <Checkbox
                          id={client.id}
                          checked={selectedClientIds.includes(client.id)}
                          onCheckedChange={() => toggleClient(client.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={client.id}
                          className="flex-1 cursor-pointer"
                        >
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.phone}</p>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {selectedClientIds.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedClientIds.length} client{selectedClientIds.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || clients.length === 0}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/60"
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </Button>
                <Link href="/campaigns" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
