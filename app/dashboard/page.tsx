'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { AuthClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { NotificationBell } from '@/components/NotificationBell';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Plus,
  Settings,
  LogOut,
  Folder
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  period: string;
  document_type: string;
}

interface Client {
  id: string;
  name: string;
  status: string;
  updated_at: string;
}

interface Stats {
  total: number;
  received: number;
  pending: number;
  stuck: number;
  clients: Client[];
}

interface DashboardData {
  campaign: Campaign | null;
  stats: Stats | null;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    received: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: 'Received',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    pending: {
      icon: <Clock className="w-3 h-3" />,
      label: 'Chasing',
      className: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    stuck: {
      icon: <AlertCircle className="w-3 h-3" />,
      label: 'Stuck',
      className: 'bg-red-50 text-red-700 border-red-200'
    },
  };

  const config = variants[status] || {
    icon: null,
    label: status,
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = AuthClient.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    apiClient.setToken(session.token);
    loadDashboard();
  }, [router]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthClient.logout();
  };

  const session = AuthClient.getSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <p className="font-semibold">Error Loading Dashboard</p>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadDashboard} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = data?.stats ?
    (data.stats.total > 0 ? Math.round((data.stats.received / data.stats.total) * 100) : 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size={40} className="transition-transform group-hover:scale-105" />
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
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Upgrade</span>
                </Button>
              </Link>
              <NotificationBell />
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
            <p className="text-gray-600 mt-1">Track your document collection campaigns</p>
          </div>
          <Link href="/campaigns/new">
            <Button className="gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {data?.campaign && data?.stats ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Clients */}
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Clients</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">{data.stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Received */}
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Received</p>
                      <p className="text-3xl font-bold text-emerald-900 mt-2">{data.stats.received}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending */}
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-amber-50 to-amber-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">Chasing</p>
                      <p className="text-3xl font-bold text-amber-900 mt-2">{data.stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stuck */}
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-red-50 to-red-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">Stuck</p>
                      <p className="text-3xl font-bold text-red-900 mt-2">{data.stats.stuck}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Progress */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{data.campaign.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {data.campaign.period} • {data.campaign.document_type.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">{progressPercentage}% Complete</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Campaign Progress</span>
                    <span className="text-gray-600">
                      {data.stats.received} of {data.stats.total} collected
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client List */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Client Status</h3>
                <div className="space-y-2">
                  {data.stats.clients.length > 0 ? (
                    data.stats.clients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {client.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(client.updated_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={client.status} />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No clients in this campaign</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Empty State */
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Campaign</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first document collection campaign
              </p>
              <Link href="/campaigns/new">
                <Button className="gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600">
                  <Plus className="w-4 h-4" />
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
