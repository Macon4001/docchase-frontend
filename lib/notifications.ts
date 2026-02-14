export interface Notification {
  id: string;
  accountant_id: string;
  type: 'client_response' | 'document_uploaded' | 'campaign_started' | 'campaign_completed' | 'payment_failed' | 'subscription_updated' | 'message_failed' | 'client_stuck';
  title: string;
  message: string;
  client_name?: string;
  campaign_name?: string;
  read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}
