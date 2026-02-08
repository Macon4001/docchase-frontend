# DocChase - AI Document Collection Assistant

DocChase is an AI-powered WhatsApp assistant that automatically chases accountants' clients for bank statements, collects the documents, converts them via BankToFile, and saves them to Google Drive.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) with TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL
- **Auth:** NextAuth.js
- **Messaging:** Twilio WhatsApp Business API
- **AI:** Claude API (Haiku for replies)
- **File Storage:** Google Drive API
- **PDF Conversion:** BankToFile API

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or hosted on Neon/Supabase)
- Twilio account with WhatsApp sandbox access
- Google Cloud project with Drive API enabled
- Anthropic API key
- BankToFile API access

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/docchase

# Auth
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/webhooks/twilio

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/settings/google-callback

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# BankToFile API
BANKTOFILE_API_URL=https://banktofile.com
BANKTOFILE_API_KEY=your-banktofile-api-key

# Cron Secret
CRON_SECRET=<generate-random-string>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Run the migration script to create database tables:

```bash
npm run db:migrate
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Twilio WhatsApp Sandbox Setup

For local development:

1. Go to [Twilio Console](https://console.twilio.com/) > Messaging > Try it out > WhatsApp
2. Send `join <sandbox-word>` to the sandbox number from your phone
3. Use ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```
4. Update `TWILIO_WEBHOOK_URL` in `.env` with your ngrok URL
5. Configure webhook in Twilio Console: `https://your-ngrok-url.ngrok.io/api/webhooks/twilio`

### 7. Google Drive Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/api/settings/google-callback`
6. Copy Client ID and Client Secret to `.env`

## Project Structure

```
docchase/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── clients/       # Client management
│   │   ├── campaigns/     # Campaign management
│   │   ├── cron/          # Scheduled jobs
│   │   └── webhooks/      # Twilio webhook
│   ├── dashboard/         # Main dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── db.ts              # Database client
│   ├── twilio.ts          # Twilio helpers
│   ├── google-drive.ts    # Google Drive helpers
│   ├── claude.ts          # Claude AI integration
│   ├── banktofile.ts      # BankToFile API
│   ├── schema.sql         # Database schema
│   └── types.ts           # TypeScript types
└── scripts/
    └── migrate.ts         # Database migration script
```

## Features

### Phase 1: Core Flow ✅

- [x] Database setup
- [x] Auth (register/login)
- [x] Add clients manually
- [x] Send WhatsApp message to client
- [x] Receive WhatsApp message (webhook)
- [x] Save incoming files to Google Drive
- [x] Basic dashboard showing clients and status

### Phase 2: Automation ✅

- [x] Create campaign
- [x] Auto-send initial messages to all clients
- [x] Cron job for reminders
- [x] Cron job for flagging stuck
- [x] Claude integration for smart replies

### Phase 3: To Do

- [ ] CSV import for clients
- [ ] Email notifications to accountant
- [ ] Conversation view
- [ ] Settings page with Google Drive connection
- [ ] Campaign detail page

## Deployment

### Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/flag-stuck",
      "schedule": "0 10 * * *"
    }
  ]
}
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new accountant
- `POST /api/auth/login` - Login (handled by NextAuth)
- `GET /api/auth/me` - Get current user

### Clients

- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client details
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

### Campaigns

- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `POST /api/campaigns/[id]/start` - Start campaign (send initial messages)

### Webhooks

- `POST /api/webhooks/twilio` - Receive WhatsApp messages

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
