'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthClient } from '@/lib/auth-client';
import { Logo } from '@/components/Logo';
import { NotificationBell } from '@/components/NotificationBell';
import {
  LayoutDashboard,
  Users,
  Folder,
  Settings,
  LogOut,
  TrendingUp,
  FileText,
  Bell,
  User,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    section: 'Main',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/clients', icon: Users, label: 'Clients' },
      { href: '/campaigns', icon: Folder, label: 'Campaigns' },
    ]
  },
  {
    section: 'Account',
    items: [
      { href: '/notifications', icon: Bell, label: 'Notifications' },
      { href: '/settings', icon: Settings, label: 'Settings' },
      { href: '/pricing', icon: TrendingUp, label: 'Upgrade' },
    ]
  }
];

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

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

  // Add blog to nav items if admin
  if (isAdmin && !navItems[0].items.find(item => item.href === '/dashboard/blog')) {
    navItems[0].items.push({ href: '/dashboard/blog', icon: FileText, label: 'Blog' });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col flex-shrink-0">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Logo size={32} className="transition-transform group-hover:scale-105" />
            <span className="font-semibold text-foreground text-lg">Gettingdocs</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {navItems.map((section, idx) => (
            <div key={section.section} className={cn(idx > 0 && 'mt-6')}>
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.section}
                </h3>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 h-10 px-3 transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session?.user.practice_name || 'Practice'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 h-9 text-muted-foreground hover:text-foreground hover:bg-sidebar-hover"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Log out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium capitalize">
                  {pathname.split('/').pop()?.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
