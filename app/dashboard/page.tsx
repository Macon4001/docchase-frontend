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
  failed: number;
  clients: Client[];
}

interface DashboardData {
  campaign: Campaign | null;
  stats: Stats | null;
}

const COLORS = {
  primary: '#15a349',
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
  const [data, setData] = useState<DashboardData | null>(null);
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
      const [dashboardResult, activityResult] = await Promise.all([
        apiClient.getDashboard(),
        apiClient.getDashboardActivity()
      ]);
      setData(dashboardResult);
      setActivity(activityResult.activity || []);
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
  const completionRate = data?.stats?.total ?
    Math.round((data.stats.received / data.stats.total) * 100) : 0;

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
    { name: 'Received', value: data?.stats?.received || 0, color: COLORS.success },
    { name: 'Pending', value: data?.stats?.pending || 0, color: COLORS.warning },
    { name: 'Failed', value: data?.stats?.failed || 0, color: COLORS.danger },
  ];

  // Calculate average response time (mock - replace with real data)
  const avgResponseTime = '2.5 days';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {data?.campaign?.name || 'Overview of your document collection'}
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
            value={data?.stats?.total || 0}
            subtitle="Document requests sent"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Received"
            value={data?.stats?.received || 0}
            subtitle={`${completionRate}% completion rate`}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Pending"
            value={data?.stats?.pending || 0}
            subtitle="Being chased"
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Failed"
            value={data?.stats?.failed || 0}
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
                <span className="text-2xl font-bold">{data?.stats?.total || 0}</span>
                <span className="text-sm text-muted-foreground">total chases • {data?.stats?.received || 0} received</span>
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

        {/* Recent Clients */}
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Latest client interactions</p>
              </div>
              <Link href="/clients">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {data?.stats?.clients && data.stats.clients.length > 0 ? (
                data.stats.clients.slice(0, 5).map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(client.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        client.status === 'received'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : client.status === 'pending'
                          ? 'border-orange-200 bg-orange-50 text-orange-700'
                          : 'border-red-200 bg-red-50 text-red-700'
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No recent activity</p>
                  <p className="text-xs mt-1">Create a campaign to start collecting documents</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
