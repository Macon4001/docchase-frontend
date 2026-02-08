// Database Types
export interface Accountant {
  id: string;
  email: string;
  password_hash: string;
  practice_name: string;
  google_drive_token: any;
  google_drive_folder_id: string | null;
  twilio_phone_number: string | null;
  amy_name: string;
  amy_tone: string;
  notification_email: boolean;
  notification_stuck: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Client {
  id: string;
  accountant_id: string;
  name: string;
  phone: string;
  email: string | null;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Campaign {
  id: string;
  accountant_id: string;
  name: string;
  document_type: string;
  period: string;
  status: 'active' | 'completed' | 'paused';
  reminder_day_3: boolean;
  reminder_day_6: boolean;
  flag_after_day_9: boolean;
  started_at: Date;
  completed_at: Date | null;
  created_at: Date;
}

export interface CampaignClient {
  id: string;
  campaign_id: string;
  client_id: string;
  status: 'pending' | 'received' | 'stuck';
  first_message_sent_at: Date | null;
  reminder_1_sent_at: Date | null;
  reminder_2_sent_at: Date | null;
  flagged_at: Date | null;
  received_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  accountant_id: string;
  client_id: string;
  campaign_id: string | null;
  direction: 'inbound' | 'outbound';
  sender: 'client' | 'amy' | 'accountant';
  body: string;
  media_url: string | null;
  twilio_sid: string | null;
  created_at: Date;
}

export interface Document {
  id: string;
  accountant_id: string;
  client_id: string;
  campaign_id: string | null;
  original_filename: string | null;
  original_url: string | null;
  drive_file_id: string | null;
  drive_file_url: string | null;
  csv_drive_file_id: string | null;
  csv_drive_file_url: string | null;
  conversion_status: 'pending' | 'success' | 'failed';
  conversion_error: string | null;
  created_at: Date;
}

// API Types
export interface CreateClientRequest {
  name: string;
  phone: string;
  email?: string;
}

export interface CreateCampaignRequest {
  name: string;
  document_type: string;
  period: string;
  client_ids: string[];
  reminder_day_3?: boolean;
  reminder_day_6?: boolean;
  flag_after_day_9?: boolean;
}

export interface SendMessageRequest {
  client_id: string;
  body: string;
  campaign_id?: string;
}
