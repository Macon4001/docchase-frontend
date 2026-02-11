'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthClient } from '@/lib/auth-client';
import { apiClient } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { NotificationBell } from '@/components/NotificationBell';
import { Notification } from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Bell,
  FileText,
  Play,
  CheckCircle2,
  Settings,
  LogOut,
  Users,
  Folder,
  TrendingUp
} from 'lucide-react';

// Google Drive icon
function DriveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 87.3 78" className={className}>
      <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/>
      <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"/>
      <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/>
      <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/>
      <path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
      <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
    </svg>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSession = AuthClient.getSession();
    if (!currentSession) {
      router.push('/login');
      return;
    }
    setSession(currentSession);
    apiClient.setToken(currentSession.token);
    fetchNotifications();
  }, [router]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/notifications');
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthClient.logout();
    router.push('/');
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiClient.post(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'client_response':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'document_uploaded':
        return <DriveIcon className="w-5 h-5" />;
      case 'campaign_started':
        return <Play className="w-5 h-5 text-purple-600" />;
      case 'campaign_completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Logo size={40} className="transition-transform group-hover:scale-105" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Gettingdocs
                </h1>
                <p className="text-xs text-gray-500">{session.user.practice_name || 'Dashboard'}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-600 px-3 py-1.5 bg-gray-100 rounded-lg">
                {session.user.email}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">View all your notifications</p>
          </div>
          {notifications.some(n => !n.read) && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600">You'll see notifications here when clients respond or documents are uploaded</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-primary bg-blue-50/50' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge variant="default" className="bg-primary">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      {notification.client_name && (
                        <p className="text-sm text-gray-600 mb-1">
                          Client: <span className="font-medium">{notification.client_name}</span>
                        </p>
                      )}
                      {notification.campaign_name && (
                        <p className="text-sm text-gray-600 mb-1">
                          Campaign: <span className="font-medium">{notification.campaign_name}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
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
