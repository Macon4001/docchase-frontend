'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format, subDays } from 'date-fns';
import { AuthClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api';
import { AppLayout } from '@/components/AppLayout';
import { useNotifications } from '@/components/NotificationProvider';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  FileText,
  MessageSquare
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Campaign {
  id: string;
  name: string;
  period: string;
  document_type: string;
  status: string;
  total_clients?: number;
  received?: number;
  pending?: number;
  failed?: number;
  created_at: string;
}

const COLORS = {
  primary: '#16a152',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316',
  teal: '#14b8a6',
  cyan: '#06b6d4',
};

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = 'blue',
  subtitle
}: {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {change && (
                <Badge variant="outline" className={`gap-1 border-0 ${trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                  {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {change}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityData {
  date: string;
  received: number;
  pending: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { onNewNotification } = useNotifications();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activity, setActivity] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // Get all campaigns (same as campaigns page)
      const campaignsResult = await apiClient.getCampaigns();
      const campaigns = campaignsResult.campaigns || [];

      // Filter to active campaigns
      const activeCampaigns = campaigns.filter((c: Campaign) => c.status === 'active');

      if (activeCampaigns.length > 0) {
        // Aggregate stats across ALL active campaigns
        const aggregatedStats = activeCampaigns.reduce((acc: {
          total_clients: number;
          received: number;
          pending: number;
          failed: number;
        }, c: Campaign) => ({
          total_clients: acc.total_clients + Number(c.total_clients || 0),
          received: acc.received + Number(c.received || 0),
          pending: acc.pending + Number(c.pending || 0),
          failed: acc.failed + Number(c.failed || 0),
        }), { total_clients: 0, received: 0, pending: 0, failed: 0 });

        // Create a virtual "All Campaigns" campaign with aggregated stats
        const aggregatedCampaign: Campaign = {
          id: 'all',
          name: 'All Active Campaigns',
          period: '',
          document_type: '',
          status: 'active',
          created_at: new Date().toISOString(),
          ...aggregatedStats
        };

        setCampaign(aggregatedCampaign);

        // Generate activity data from campaign creation dates and stats
        // Group campaigns by date and aggregate their stats
        const activityMap = new Map<string, { received: number; pending: number }>();

        activeCampaigns.forEach((c: Campaign) => {
          const date = c.created_at.split('T')[0]; // Get YYYY-MM-DD
          const existing = activityMap.get(date) || { received: 0, pending: 0 };
          activityMap.set(date, {
            received: existing.received + Number(c.received || 0),
            pending: existing.pending + Number(c.pending || 0),
          });
        });

        // Convert to array and sort by date
        const activityArray = Array.from(activityMap.entries())
          .map(([date, stats]) => ({ date, ...stats }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7); // Last 7 days of activity

        setActivity(activityArray);
      } else {
        setCampaign(null);
        setActivity([]);
      }
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
  }, [router, loadDashboard]);

  // Subscribe to notifications and auto-refresh dashboard
  useEffect(() => {
    const unsubscribe = onNewNotification(() => {
      loadDashboard(true);
    });

    return unsubscribe;
  }, [onNewNotification, loadDashboard]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertCircle className="w-6 h-6" />
              <p className="font-semibold">Error Loading Dashboard</p>
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadDashboard()} variant="default">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  // Calculate completion rate
  const completionRate = campaign?.total_clients ?
    Math.round(((campaign.received || 0) / campaign.total_clients) * 100) : 0;

  // Format activity data for the chart
  const collectionActivity = activity.length > 0
    ? activity.map(item => ({
        date: format(new Date(item.date), 'MMM dd'),
        received: item.received,
        pending: item.pending,
        total: item.received + item.pending
      }))
    : Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          date: format(date, 'MMM dd'),
          received: 0,
          pending: 0,
          total: 0
        };
      });

  const statusData = [
    { name: 'Received', value: campaign?.received || 0, color: COLORS.success },
    { name: 'Pending', value: campaign?.pending || 0, color: COLORS.warning },
    { name: 'Failed', value: campaign?.failed || 0, color: COLORS.danger },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign?.name || 'Overview of your document collection'}
            </p>
          </div>
          <Link href="/campaigns/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Chases"
            value={campaign?.total_clients || 0}
            subtitle="Document requests sent"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Received"
            value={campaign?.received || 0}
            subtitle={`${completionRate}% completion rate`}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Pending"
            value={campaign?.pending || 0}
            subtitle="Being chased"
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Failed"
            value={campaign?.failed || 0}
            subtitle="Unsuccessful attempts"
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collection Activity Chart */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Document Collection Activity</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-muted-foreground">Received</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-muted-foreground">Pending</span>
                  </div>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold">{campaign?.total_clients || 0}</span>
                <span className="text-sm text-muted-foreground">total chases • {campaign?.received || 0} received</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={collectionActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="received" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-semibold">Collection Status</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Current campaign breakdown</p>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {campaign && (
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your campaigns and clients
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <Link href="/clients" className="block">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">All Clients</span>
                  </Button>
                </Link>
                <Link href="/campaigns" className="block">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">All Campaigns</span>
                  </Button>
                </Link>
                <Link href="/campaigns/new" className="block">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">New Campaign</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
