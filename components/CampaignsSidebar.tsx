'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';

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

interface CampaignsSidebarProps {
  campaigns: Campaign[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function CampaignsSidebar({ campaigns, selectedFilter, onFilterChange }: CampaignsSidebarProps) {
  // Calculate statistics
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

  const totalClients = campaigns.reduce((sum, c) => sum + (c.total_clients || 0), 0);
  const totalReceived = campaigns.reduce((sum, c) => sum + (c.received || 0), 0);
  const totalPending = campaigns.reduce((sum, c) => sum + (c.pending || 0), 0);
  const totalStuck = campaigns.reduce((sum, c) => sum + (c.stuck || 0), 0);

  const filters = [
    { id: 'all', label: 'All Campaigns', count: totalCampaigns },
    { id: 'active', label: 'Active', count: activeCampaigns },
    { id: 'draft', label: 'Draft', count: draftCampaigns },
    { id: 'completed', label: 'Completed', count: completedCampaigns },
  ];

  return (
    <div className="space-y-6 sticky top-20">
      {/* Overall Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">Received</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700">{String(totalReceived)}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{String(totalPending)}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">Stuck</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">{String(totalStuck)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-700">{String(totalClients)}</div>
            </div>
          </div>

          {totalClients > 0 && (
            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium text-gray-900">
                  {Math.round((totalReceived / totalClients) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${(totalReceived / totalClients) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'ghost'}
              className={`w-full justify-between ${
                selectedFilter === filter.id
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onFilterChange(filter.id)}
            >
              <span>{filter.label}</span>
              <Badge
                variant={selectedFilter === filter.id ? 'secondary' : 'outline'}
                className={selectedFilter === filter.id ? 'bg-emerald-700 text-white' : ''}
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Campaign Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from(new Set(campaigns.map(c => c.document_type))).map((type) => {
            const count = campaigns.filter(c => c.document_type === type).length;
            return (
              <div key={type} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700 capitalize">
                  {type.replace('_', ' ')}
                </span>
                <Badge variant="outline">{count}</Badge>
              </div>
            );
          })}
          {campaigns.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No campaigns yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
