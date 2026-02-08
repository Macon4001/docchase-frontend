-- DocChase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Accountants (users of DocChase)
CREATE TABLE IF NOT EXISTS accountants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  practice_name VARCHAR(255) NOT NULL,
  google_drive_token JSONB,
  google_drive_folder_id VARCHAR(255),
  twilio_phone_number VARCHAR(20),
  amy_name VARCHAR(50) DEFAULT 'Amy',
  amy_tone VARCHAR(20) DEFAULT 'friendly',
  notification_email BOOLEAN DEFAULT true,
  notification_stuck BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Clients (accountant's customers)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID REFERENCES accountants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(accountant_id, phone)
);

-- Campaigns (monthly collection runs)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID REFERENCES accountants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  document_type VARCHAR(50) DEFAULT 'bank_statement',
  period VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  reminder_day_3 BOOLEAN DEFAULT true,
  reminder_day_6 BOOLEAN DEFAULT true,
  flag_after_day_9 BOOLEAN DEFAULT true,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaign Clients (which clients are in which campaign)
CREATE TABLE IF NOT EXISTS campaign_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  first_message_sent_at TIMESTAMP,
  reminder_1_sent_at TIMESTAMP,
  reminder_2_sent_at TIMESTAMP,
  flagged_at TIMESTAMP,
  received_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(campaign_id, client_id)
);

-- Messages (conversation history)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID REFERENCES accountants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  direction VARCHAR(10) NOT NULL,
  sender VARCHAR(20) NOT NULL,
  body TEXT NOT NULL,
  media_url VARCHAR(500),
  twilio_sid VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents (collected files)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID REFERENCES accountants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  original_filename VARCHAR(255),
  original_url VARCHAR(500),
  drive_file_id VARCHAR(255),
  drive_file_url VARCHAR(500),
  csv_drive_file_id VARCHAR(255),
  csv_drive_file_url VARCHAR(500),
  conversion_status VARCHAR(20) DEFAULT 'pending',
  conversion_error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_accountant ON clients(accountant_id);
CREATE INDEX IF NOT EXISTS idx_messages_client ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_accountant ON messages(accountant_id);
CREATE INDEX IF NOT EXISTS idx_campaign_clients_status ON campaign_clients(status);
CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_accountant ON campaigns(accountant_id);
CREATE INDEX IF NOT EXISTS idx_campaign_clients_campaign ON campaign_clients(campaign_id);
