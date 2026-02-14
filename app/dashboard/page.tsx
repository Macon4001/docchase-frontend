'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
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
  ArrowUpRight
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
  primary: '#6366f1',
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
  color = 'blue'
}: {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
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
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { onNewNotification } = useNotifications();
  const [data, setData] = useState<DashboardData | null>(null);
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

  // Prepare chart data
  const revenueData = [
    { date: '1 Jul', grossMargin: 35, revenue: 45 },
    { date: '2 Jul', grossMargin: 45, revenue: 50 },
    { date: '3 Jul', grossMargin: 25, revenue: 55 },
    { date: '4 Jul', grossMargin: 40, revenue: 50 },
    { date: '5 Jul', grossMargin: 55, revenue: 60 },
    { date: '6 Jul', grossMargin: 60, revenue: 65 },
    { date: '7 Jul', grossMargin: 35, revenue: 70 },
    { date: '8 Jul', grossMargin: 45, revenue: 75 },
    { date: '9 Jul', grossMargin: 50, revenue: 80 },
    { date: '10 Jul', grossMargin: 55, revenue: 85 },
    { date: '11 Jul', grossMargin: 45, revenue: 90 },
    { date: '12 Jul', grossMargin: 60, revenue: 95 },
  ];

  const categoryData = [
    { name: 'Received', value: data?.stats?.received || 0, color: COLORS.success },
    { name: 'Pending', value: data?.stats?.pending || 0, color: COLORS.warning },
    { name: 'Failed', value: data?.stats?.failed || 0, color: COLORS.danger },
  ];

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
            title="Total Clients"
            value={data?.stats?.total || 0}
            change="2.5%"
            trend="up"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={`$${((data?.stats?.received || 0) * 3500).toLocaleString()}`}
            change="0.5%"
            trend="up"
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Received"
            value={data?.stats?.received || 0}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Pending"
            value={data?.stats?.pending || 0}
            icon={Clock}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Sales Chart */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Product sales</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Gross margin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-muted-foreground">Revenue</span>
                  </div>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold">$52,187</span>
                <Badge variant="outline" className="gap-1 border-0 text-emerald-700 bg-emerald-50">
                  <TrendingUp className="w-3 h-3" />
                  2.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="grossMargin" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-semibold">Document Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((item) => (
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
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
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
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
