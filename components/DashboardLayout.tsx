'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthClient } from '@/lib/auth-client';
import { Logo } from '@/components/Logo';
import { NotificationBell } from '@/components/NotificationBell';
import {
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Folder,
  FileText
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const session = AuthClient.getSession();

    if (!session) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleLogout = () => {
    AuthClient.logout();
  };

  const session = AuthClient.getSession();
  const isAdmin = session?.user.email === 'macon4001@gmail.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
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
              {isAdmin && (
                <Link href="/dashboard/blog">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Blog</span>
                  </Button>
                </Link>
              )}
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
        {children}
      </main>
    </div>
  );
}
