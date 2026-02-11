'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Notification, NotificationResponse } from '@/lib/notifications';
import { toast } from 'sonner';
import { AuthClient } from '@/lib/auth-client';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onNewNotification: (callback: () => void) => () => void; // Subscribe to new notifications
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(-1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [callbacks, setCallbacks] = useState<Set<() => void>>(new Set());

  useEffect(() => {
    // Check if user is authenticated
    const session = AuthClient.getSession();
    if (session) {
      setIsAuthenticated(true);
      apiClient.setToken(session.token);
      fetchNotifications();

      // Poll for new notifications every 5 seconds
      const interval = setInterval(fetchNotifications, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/api/notifications');
      const data = response as NotificationResponse;

      console.log(`📊 [Global] Notification poll - Previous: ${previousCount}, Current: ${data.unread_count}`);

      // Check if there are new notifications (increased count, but skip initial load)
      if (data.unread_count > previousCount && previousCount > -1) {
        console.log(`🔔 [Global] NEW NOTIFICATIONS! Previous: ${previousCount}, Current: ${data.unread_count}`);

        // Show toast for newest unread notification
        const newest = data.notifications.find(n => !n.read);
        if (newest) {
          console.log(`📢 [Global] Showing toast: "${newest.title}"`);

          toast.success(newest.title, {
            description: newest.message,
            duration: 5000,
          });

          console.log(`✅ [Global] Toast triggered!`);
        }

        // Call all registered callbacks
        console.log(`🔄 [Global] Triggering ${callbacks.size} registered callbacks`);
        callbacks.forEach(callback => {
          try {
            callback();
          } catch (err) {
            console.error('Error in notification callback:', err);
          }
        });
      }

      setPreviousCount(data.unread_count);
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('❌ [Global] Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiClient.post(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const onNewNotification = useCallback((callback: () => void) => {
    console.log(`📝 [Global] Registering new notification callback`);
    setCallbacks(prev => new Set(prev).add(callback));

    // Return cleanup function
    return () => {
      console.log(`🗑️ [Global] Removing notification callback`);
      setCallbacks(prev => {
        const next = new Set(prev);
        next.delete(callback);
        return next;
      });
    };
  }, []); // Empty deps - function never changes

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications: fetchNotifications,
        markAsRead,
        markAllAsRead,
        onNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
