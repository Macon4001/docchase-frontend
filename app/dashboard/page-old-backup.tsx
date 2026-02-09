'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { AuthClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api';

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
  const variants: Record<string, { variant: any; label: string }> = {
    received: { variant: 'success', label: '✅ Received' },
    pending: { variant: 'warning', label: '⏳ Chasing' },
    stuck: { variant: 'destructive', label: '❌ Stuck' },
  };

  const config = variants[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
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

    // Set API token
    apiClient.setToken(session.token);

    // Load dashboard data
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadDashboard}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DocChase</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user.email}</span>
            <Link href="/clients">
              <Button variant="outline">Clients</Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="outline">Campaigns</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline">Settings</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Link href="/campaigns/new">
            <Button>New Campaign</Button>
          </Link>
        </div>

        {data?.campaign && data?.stats ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{data.campaign.name}</CardTitle>
                <CardDescription>
                  {data.campaign.period} • {data.campaign.document_type.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">
                        {data.stats.received}/{data.stats.total} (
                        {data.stats.total > 0 ? Math.round((data.stats.received / data.stats.total) * 100) : 0}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={data.stats.total > 0 ? (data.stats.received / data.stats.total) * 100 : 0}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{data.stats.received}</div>
                      <div className="text-sm text-green-600">Received</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">{data.stats.pending}</div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">{data.stats.stuck}</div>
                      <div className="text-sm text-red-600">Stuck</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.stats.clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={client.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(client.updated_at), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>
                          <Link href={`/clients/${client.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No active campaign</p>
              <Link href="/campaigns/new">
                <Button>Start a Campaign</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
