'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Play } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AuthClient } from '@/lib/auth-client';
import { AppLayout } from '@/components/AppLayout';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useNotifications } from '@/components/NotificationProvider';
import { CampaignsSidebar } from '@/components/CampaignsSidebar';

interface Campaign {
  id: string;
  name: string;
  document_type: string;
  period: string;
  status: string;
  created_at: string;
  total_clients?: number;
  pending?: number;
  received?: number;
  failed?: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const { onNewNotification } = useNotifications();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingCampaignId, setStartingCampaignId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [billingInfo, setBillingInfo] = useState<{
    chaseLimit: number;
    chasesUsed: number;
  } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const loadBillingInfo = useCallback(async () => {
    try {
      const data = await apiClient.getBillingInfo();
      setBillingInfo({
        chaseLimit: data.billing.chaseLimit,
        chasesUsed: data.billing.chasesUsed,
      });
    } catch (err) {
      console.error('Failed to load billing info:', err);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const data = await apiClient.getCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userSession = AuthClient.getSession();

    if (!userSession) {
      router.push('/login');
      return;
    }

    apiClient.setToken(userSession.token);
    loadCampaigns();
    loadBillingInfo();
  }, [router, loadCampaigns, loadBillingInfo]);

  // Subscribe to notifications and auto-refresh campaigns
  useEffect(() => {
    const unsubscribe = onNewNotification(() => {
      console.log('🔄 [Campaigns] Refreshing campaigns due to new notification');
      loadCampaigns();
    });

    return unsubscribe;
  }, [onNewNotification, loadCampaigns]);

  const handleStartCampaign = async (campaignId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check chase limit before starting
    if (billingInfo && billingInfo.chasesUsed >= billingInfo.chaseLimit) {
      setShowUpgradeModal(true);
      return;
    }

    setStartingCampaignId(campaignId);
    try {
      await apiClient.startCampaign(campaignId);
      // Reload campaigns and billing info to update status
      await loadCampaigns();
      await loadBillingInfo();
    } catch (err) {
      console.error('Failed to start campaign:', err);
      const errorMessage = err instanceof Error ? err.message : '';

      // Check if error is about chase limit
      if (errorMessage.includes('Chase limit reached') || errorMessage.includes('chase limit')) {
        setShowUpgradeModal(true);
      } else {
        alert('Failed to start campaign. Please try again.');
      }
    } finally {
      setStartingCampaignId(null);
    }
  };

  // Filter campaigns based on selected filter
  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedFilter === 'all') return true;
    return campaign.status === selectedFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Campaigns</h2>
          <Link href="/campaigns/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Sidebar + Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Hidden on mobile, shown on large screens */}
          <aside className="hidden lg:block">
            <CampaignsSidebar
              campaigns={campaigns}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </aside>

          {/* Main Content */}
          <div>

        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-600 mb-4">
                {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns match this filter'}
              </p>
              {campaigns.length === 0 && (
                <Link href="/campaigns/new">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow h-full">
                <Link href={`/campaigns/${campaign.id}`}>
                  <CardHeader className="cursor-pointer">
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>
                      {campaign.period} • {campaign.document_type.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                </Link>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'draft' ? 'secondary' : 'outline'}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Campaign Statistics */}
                  {campaign.status === 'active' && campaign.total_clients && campaign.total_clients > 0 ? (
                    <div className="mb-4 pb-4 border-b">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-primary/5 rounded-lg p-2">
                          <div className="text-lg font-bold text-primary">{campaign.received || 0}</div>
                          <div className="text-xs text-primary">Received</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-blue-700">{campaign.pending || 0}</div>
                          <div className="text-xs text-blue-600">Pending</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-red-700">{campaign.failed || 0}</div>
                          <div className="text-xs text-red-600">Failed</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-center text-gray-600">
                        {campaign.received}/{campaign.total_clients} completed ({Math.round(((campaign.received || 0) / (campaign.total_clients || 1)) * 100)}%)
                      </div>
                    </div>
                  ) : campaign.status === 'draft' ? (
                    <div className="mb-4 pb-4 border-b">
                      <div className="text-center py-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                          {campaign.total_clients || 0} client{(campaign.total_clients || 0) !== 1 ? 's' : ''} ready
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    {campaign.status === 'draft' ? (
                      <>
                        <Button
                          onClick={(e) => handleStartCampaign(campaign.id, e)}
                          disabled={startingCampaignId === campaign.id}
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/60"
                        >
                          {startingCampaignId === campaign.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              Starting...
                            </>
                          ) : (
                            <>
                              <Play className="mr-1 h-3 w-3" />
                              Start
                            </>
                          )}
                        </Button>
                        <Link href={`/campaigns/${campaign.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/campaigns/${campaign.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </div>
        </div>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="chase_limit"
          currentCount={billingInfo?.chasesUsed}
          limit={billingInfo?.chaseLimit}
        />
    </AppLayout>
  );
}
