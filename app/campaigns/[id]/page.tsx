'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api';
import { Play, ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';

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
  const { data: session, status } = useSession();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [clients, setClients] = useState<CampaignClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session) {
      loadCampaignDetails();
    }
  }, [status, session, router, campaignId]);

  const loadCampaignDetails = async () => {
    try {
      const token = (session as any)?.apiToken;
      if (token) {
        apiClient.setToken(token);
      }

      // For now, we'll just load the campaign
      // TODO: Add endpoint to get campaign with clients
      const campaignData = await apiClient.getCampaigns();
      const foundCampaign = campaignData.campaigns?.find((c: Campaign) => c.id === campaignId);

      if (foundCampaign) {
        setCampaign(foundCampaign);
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

    setStarting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = (session as any)?.apiToken;
      if (token) {
        apiClient.setToken(token);
      }

      const result = await apiClient.startCampaign(campaign.id);

      if (result.success) {
        setSuccessMessage(
          `Campaign started! ${result.results.success} messages sent successfully.` +
          (result.results.failed > 0 ? ` ${result.results.failed} failed.` : '')
        );

        // Reload campaign to get updated status
        await loadCampaignDetails();
      }
    } catch (err) {
      console.error('Failed to start campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to start campaign');
    } finally {
      setStarting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold">DocChase</h1>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DocChase</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/clients">
              <Button variant="outline">Clients</Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="outline">Campaigns</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Alert className="mb-6 border-green-600 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
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
                    {campaign.status === 'draft' && (
                      <Button
                        onClick={handleStartCampaign}
                        disabled={starting}
                        size="lg"
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
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-lg font-medium">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reminders</p>
                    <p className="text-lg font-medium">
                      {[
                        campaign.reminder_day_3 && 'Day 3',
                        campaign.reminder_day_6 && 'Day 6',
                        campaign.flag_after_day_9 && 'Flag Day 9'
                      ].filter(Boolean).join(', ') || 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Document Type</p>
                    <p className="text-lg font-medium capitalize">
                      {campaign.document_type.replace('_', ' ')}
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p className="text-lg font-medium text-foreground">Campaign Active!</p>
                    <p className="text-sm mt-2">WhatsApp messages have been sent to all clients</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Amy will automatically respond and process documents as they arrive
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
