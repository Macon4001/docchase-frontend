'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Folder, Settings, LogOut, Plus, Edit, Play } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { AuthClient } from '@/lib/auth-client';

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
  stuck?: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingCampaignId, setStartingCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const userSession = AuthClient.getSession();

    if (!userSession) {
      router.push('/login');
      return;
    }

    setSession(userSession);
    apiClient.setToken(userSession.token);
    loadCampaigns();
  }, [router]);

  const handleLogout = () => {
    AuthClient.logout();
  };

  const loadCampaigns = async () => {
    try {
      const data = await apiClient.getCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCampaign = async (campaignId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setStartingCampaignId(campaignId);
    try {
      await apiClient.startCampaign(campaignId);
      // Reload campaigns to update status
      await loadCampaigns();
    } catch (err) {
      console.error('Failed to start campaign:', err);
      alert('Failed to start campaign. Please try again.');
    } finally {
      setStartingCampaignId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading campaigns...</p>
        </div>
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
                  Gettingdocs
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Campaigns</h2>
          <Link href="/campaigns/new">
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-600 mb-4">No campaigns yet</p>
              <Link href="/campaigns/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
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
                        <div className="bg-emerald-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-emerald-700">{campaign.received || 0}</div>
                          <div className="text-xs text-emerald-600">Received</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-blue-700">{campaign.pending || 0}</div>
                          <div className="text-xs text-blue-600">Pending</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-orange-700">{campaign.stuck || 0}</div>
                          <div className="text-xs text-orange-600">Stuck</div>
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
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400"
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
      </main>
    </div>
  );
}
