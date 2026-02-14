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
  Filter,
  LayoutGrid
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
  failed?: number;
}

interface CampaignsSidebarProps {
  campaigns: Campaign[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function CampaignsSidebar({ campaigns, selectedFilter, onFilterChange }: CampaignsSidebarProps) {
  // Calculate statistics - ensure we're working with actual numbers
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

  // Convert all values to numbers explicitly and sum them up
  let totalClients = 0;
  let totalReceived = 0;
  let totalPending = 0;
  let totalFailed = 0;

  campaigns.forEach(campaign => {
    totalClients += Number(campaign.total_clients) || 0;
    totalReceived += Number(campaign.received) || 0;
    totalPending += Number(campaign.pending) || 0;
    totalFailed += Number(campaign.failed) || 0;
  });

  const filters = [
    { id: 'all', label: 'All Campaigns', count: totalCampaigns },
    { id: 'active', label: 'Active', count: activeCampaigns },
    { id: 'draft', label: 'Draft', count: draftCampaigns },
    { id: 'completed', label: 'Completed', count: completedCampaigns },
  ];

  const progressPercentage = totalClients > 0 ? Math.round((totalReceived / totalClients) * 100) : 0;

  return (
    <div className="sticky top-20 space-y-4">
      {/* Single Unified Card */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-600" />
            Campaign Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Statistics Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-lg p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-medium">Received</span>
                </div>
                <div className="text-2xl font-bold text-emerald-700">{totalReceived.toString()}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">Pending</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{totalPending.toString()}</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">Failed</span>
                </div>
                <div className="text-2xl font-bold text-red-700">{totalFailed.toString()}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600 font-medium">Total</span>
                </div>
                <div className="text-2xl font-bold text-gray-700">{totalClients.toString()}</div>
              </div>
            </div>

            {totalClients > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Overall Progress</span>
                  <span className="font-bold text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Status
            </h3>
            <div className="space-y-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? 'default' : 'ghost'}
                  className={`w-full justify-between ${
                    selectedFilter === filter.id
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onFilterChange(filter.id)}
                >
                  <span className="capitalize">{filter.label}</span>
                  <Badge
                    variant={selectedFilter === filter.id ? 'secondary' : 'outline'}
                    className={selectedFilter === filter.id ? 'bg-emerald-700 text-white border-emerald-800' : ''}
                  >
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Document Types Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document Types
            </h3>
            <div className="space-y-2">
              {Array.from(new Set(campaigns.map(c => c.document_type))).map((type) => {
                const count = campaigns.filter(c => c.document_type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                    <span className="text-sm text-gray-700 capitalize font-medium">
                      {type.replace('_', ' ')}
                    </span>
                    <Badge variant="outline" className="bg-white">{count}</Badge>
                  </div>
                );
              })}
              {campaigns.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No campaigns yet
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
