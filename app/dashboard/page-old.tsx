import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

async function getActiveCampaign(accountantId: string) {
  const result = await db.query(
    `SELECT * FROM campaigns
     WHERE accountant_id = $1 AND status = 'active'
     ORDER BY created_at DESC
     LIMIT 1`,
    [accountantId]
  );
  return result.rows[0] || null;
}

async function getCampaignStats(campaignId: string) {
  const result = await db.query(
    `SELECT
       COUNT(*)::int as total,
       COUNT(*) FILTER (WHERE cc.status = 'received')::int as received,
       COUNT(*) FILTER (WHERE cc.status = 'pending')::int as pending,
       COUNT(*) FILTER (WHERE cc.status = 'stuck')::int as stuck
     FROM campaign_clients cc
     WHERE cc.campaign_id = $1`,
    [campaignId]
  );

  const clientsResult = await db.query(
    `SELECT c.id, c.name, cc.status, cc.updated_at
     FROM campaign_clients cc
     JOIN clients c ON cc.client_id = c.id
     WHERE cc.campaign_id = $1
     ORDER BY cc.updated_at DESC`,
    [campaignId]
  );

  return {
    ...result.rows[0],
    clients: clientsResult.rows,
  };
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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const campaign = await getActiveCampaign(session.user.id);
  const stats = campaign ? await getCampaignStats(campaign.id) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DocChase</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user.email}</span>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Link href="/campaigns/new">
            <Button>New Campaign</Button>
          </Link>
        </div>

        {campaign && stats ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>
                  {campaign.period} • {campaign.document_type.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">
                        {stats.received}/{stats.total} (
                        {stats.total > 0 ? Math.round((stats.received / stats.total) * 100) : 0}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={stats.total > 0 ? (stats.received / stats.total) * 100 : 0}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{stats.received}</div>
                      <div className="text-sm text-green-600">Received</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">{stats.stuck}</div>
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
                    {stats.clients.map((client: any) => (
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
