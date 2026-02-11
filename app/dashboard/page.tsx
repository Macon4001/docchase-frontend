'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { AuthClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useNotifications } from '@/components/NotificationProvider';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Plus,
  Folder,
  Zap
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
  const { onNewNotification } = useNotifications();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [billingInfo, setBillingInfo] = useState<{
    plan: string;
    chaseLimit: number;
    chasesUsed: number;
  } | null>(null);

  const loadBillingInfo = useCallback(async () => {
    try {
      const result = await apiClient.getBillingInfo();
      setBillingInfo({
        plan: result.billing.plan,
        chaseLimit: result.billing.chaseLimit,
        chasesUsed: result.billing.chasesUsed,
      });
    } catch (err) {
      console.error('Failed to load billing info:', err);
    }
  }, []);

  const loadDashboard = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const result = await apiClient.getDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      if (!silent) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const session = AuthClient.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    apiClient.setToken(session.token);
    loadDashboard();
    loadBillingInfo();
  }, [router, loadDashboard, loadBillingInfo]);

  // Subscribe to notifications and auto-refresh dashboard
  useEffect(() => {
    const unsubscribe = onNewNotification(() => {
      console.log('🔄 [Dashboard] Refreshing dashboard due to new notification');
      loadDashboard(true); // Silent refresh
    });

    return unsubscribe;
  }, [onNewNotification, loadDashboard]);

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
            <Button onClick={() => loadDashboard()} className="w-full bg-emerald-600 hover:bg-emerald-700">
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
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
              {refreshing && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-1">Track your document collection campaigns</p>
          </div>
          <Link href="/campaigns/new">
            <Button className="gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Chase Limit Banner for Free Plan */}
        {billingInfo && billingInfo.plan === 'free' && (
          <Card className={`mb-6 border-none shadow-lg overflow-hidden ${
            billingInfo.chasesUsed >= billingInfo.chaseLimit
              ? 'bg-gradient-to-br from-red-500 via-orange-500 to-red-600'
              : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600'
          }`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center backdrop-blur-sm ${
                    billingInfo.chasesUsed >= billingInfo.chaseLimit
                      ? 'bg-white/20 border-2 border-white/40'
                      : 'bg-white/20 border-2 border-white/40'
                  }`}>
                    {billingInfo.chasesUsed >= billingInfo.chaseLimit ? (
                      <AlertCircle className="h-7 w-7 text-white" />
                    ) : (
                      <Zap className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">
                        {billingInfo.chasesUsed >= billingInfo.chaseLimit
                          ? 'Chase Limit Reached!'
                          : 'Free Plan'}
                      </h3>
                      <Badge className="bg-white/20 text-white border-white/40 font-semibold">
                        {billingInfo.chasesUsed} / {billingInfo.chaseLimit}
                      </Badge>
                    </div>
                    <p className="text-white/90 text-sm font-medium">
                      {billingInfo.chasesUsed >= billingInfo.chaseLimit
                        ? 'Upgrade now to continue sending campaigns and chasing documents'
                        : `${billingInfo.chaseLimit - billingInfo.chasesUsed} chase${billingInfo.chaseLimit - billingInfo.chasesUsed !== 1 ? 's' : ''} remaining • Upgrade for unlimited chases`}
                    </p>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button className="bg-white text-emerald-700 hover:bg-gray-100 shadow-xl font-semibold px-6 whitespace-nowrap">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              </div>

              {/* Progress bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(billingInfo.chasesUsed / billingInfo.chaseLimit) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

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
    </DashboardLayout>
  );
}
