'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api';
import { AuthClient } from '@/lib/auth-client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { UpgradeModal } from '@/components/UpgradeModal';
import { FileText, Play, ArrowLeft, CheckCircle2, Clock, Edit } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  document_type: string;
  period: string;
  status: string;
  created_at: string;
  reminder_day_3: boolean;
  reminder_day_6: boolean;
  flag_after_day_9: boolean;
  reminder_1_days?: number;
  reminder_2_days?: number;
  reminder_3_days?: number;
  reminder_send_time?: string;
}

interface CampaignClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  first_message_sent_at?: string;
  document_received_at?: string;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [clients, setClients] = useState<CampaignClient[]>([]);
  const [stats, setStats] = useState<{
    total_clients: number;
    pending: number;
    received: number;
    failed: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [billingInfo, setBillingInfo] = useState<{
    chaseLimit: number;
    chasesUsed: number;
  } | null>(null);

  useEffect(() => {
    const userSession = AuthClient.getSession();

    if (!userSession) {
      router.push('/login');
      return;
    }

    apiClient.setToken(userSession.token);
    loadCampaignDetails();
    loadBillingInfo();
  }, [router, campaignId]);

  const loadBillingInfo = async () => {
    try {
      const data = await apiClient.getBillingInfo();
      setBillingInfo({
        chaseLimit: data.billing.chaseLimit,
        chasesUsed: data.billing.chasesUsed,
      });
    } catch (err) {
      console.error('Failed to load billing info:', err);
    }
  };

  const loadCampaignDetails = async () => {
    try {
      const data = await apiClient.getCampaign(campaignId);

      if (data.campaign) {
        setCampaign(data.campaign);
        setStats(data.stats || null);
      } else {
        setError('Campaign not found');
      }
    } catch (err) {
      console.error('Failed to load campaign:', err);
      setError('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCampaign = async () => {
    if (!campaign) return;

    // Check chase limit before starting
    if (billingInfo && billingInfo.chasesUsed >= billingInfo.chaseLimit) {
      setShowUpgradeModal(true);
      return;
    }

    setStarting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await apiClient.startCampaign(campaign.id);

      if (result.success) {
        setSuccessMessage(
          `Campaign started! ${result.results.success} messages sent successfully.` +
          (result.results.failed > 0 ? ` ${result.results.failed} failed.` : '')
        );

        // Reload campaign and billing info to get updated status
        await loadCampaignDetails();
        await loadBillingInfo();
      }
    } catch (err) {
      console.error('Failed to start campaign:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start campaign';

      // Check if error is about chase limit
      if (errorMessage.includes('Chase limit reached') || errorMessage.includes('chase limit')) {
        setShowUpgradeModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setStarting(false);
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
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Campaign not found'}</AlertDescription>
        </Alert>
        <Link href="/campaigns">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200 border-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <AlertDescription className="text-emerald-900 font-medium">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Campaign Info */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{campaign.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {campaign.period} • {campaign.document_type.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={campaign.status === 'active' ? 'default' : campaign.status === 'draft' ? 'secondary' : 'outline'}
                      className="text-sm px-4 py-2"
                    >
                      {campaign.status}
                    </Badge>
                    <Link href={`/campaigns/${campaign.id}/edit`}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Campaign
                      </Button>
                    </Link>
                    {campaign.status === 'draft' && (
                      <Button
                        onClick={handleStartCampaign}
                        disabled={starting}
                        size="lg"
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400"
                      >
                        {starting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Starting...
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Start Campaign
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Created
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(campaign.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document Type
                    </p>
                    <Badge variant="secondary" className="text-sm font-medium">
                      {campaign.document_type.replace('_', ' ').split(' ').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Reminder Schedule
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.reminder_day_3 && (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs">
                          Day {campaign.reminder_1_days || 3}
                        </Badge>
                      )}
                      {campaign.reminder_day_6 && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                          Day {campaign.reminder_2_days || 6}
                        </Badge>
                      )}
                      {campaign.flag_after_day_9 && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                          Flag Day {campaign.reminder_3_days || 9}
                        </Badge>
                      )}
                      {!campaign.reminder_day_3 && !campaign.reminder_day_6 && !campaign.flag_after_day_9 && (
                        <Badge variant="outline" className="text-xs">None</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Send Time
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.reminder_send_time ? (
                        new Date(`2000-01-01T${campaign.reminder_send_time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })
                      ) : '10:00 AM'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Progress */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
                <CardDescription>
                  {campaign.status === 'draft'
                    ? 'Click "Start Campaign" to send WhatsApp messages to all clients'
                    : 'Track client responses and document collection status'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {campaign.status === 'draft' ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Campaign not started yet</p>
                    <p className="text-sm mt-2">Start the campaign to begin collecting documents</p>
                  </div>
                ) : stats ? (
                  <div className="space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{stats.total_clients}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Clients</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-700">{stats.pending}</p>
                        <p className="text-sm text-blue-600 mt-1">Pending</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-700">{stats.received}</p>
                        <p className="text-sm text-emerald-600 mt-1">Received</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
                        <p className="text-sm text-red-600 mt-1">Failed</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {stats.total_clients > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{Math.round((stats.received / stats.total_clients) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="flex h-full">
                            <div
                              className="bg-emerald-500 transition-all duration-500"
                              style={{ width: `${(stats.received / stats.total_clients) * 100}%` }}
                            />
                            <div
                              className="bg-red-500 transition-all duration-500"
                              style={{ width: `${(stats.failed / stats.total_clients) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span>Received ({stats.received})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Pending ({stats.pending})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Failed ({stats.failed})</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Messages */}
                    {stats.received === stats.total_clients ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-emerald-900">All Documents Received!</p>
                          <p className="text-xs text-emerald-700 mt-1">
                            All clients have submitted their documents.
                          </p>
                        </div>
                      </div>
                    ) : stats.total_clients > 0 ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Campaign In Progress</p>
                          <p className="text-xs text-blue-700 mt-1">
                            Waiting for {stats.pending} client{stats.pending !== 1 ? 's' : ''} to respond.
                            {stats.failed > 0 && ` ${stats.failed} client${stats.failed !== 1 ? 's' : ''} flagged as failed.`}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">No clients in this campaign yet</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p className="text-lg font-medium text-foreground">Campaign Active!</p>
                    <p className="text-sm mt-2">Loading campaign statistics...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="chase_limit"
          currentCount={billingInfo?.chasesUsed}
          limit={billingInfo?.chaseLimit}
        />
    </DashboardLayout>
  );
}
