# DocChase Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create a PostgreSQL database and add the connection string to `.env`:

```bash
# Using local PostgreSQL
createdb docchase

# Or use Neon (recommended for production)
# Sign up at https://neon.tech and create a database
```

Run migrations:

```bash
npm run db:migrate
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update with your credentials (see detailed setup below).

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Detailed Setup

### Database Setup (PostgreSQL)

#### Option 1: Neon (Recommended for Production)

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string
4. Add to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require
   ```

#### Option 2: Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection pooler string
5. Add to `.env`

#### Option 3: Local PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt-get install postgresql
sudo systemctl start postgresql

# Create database
createdb docchase

# Connection string
DATABASE_URL=postgresql://localhost:5432/docchase
```

### NextAuth Secret

Generate a secure random string:

```bash
openssl rand -base64 32
```

Add to `.env`:
```
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000
```

### Twilio WhatsApp Setup

#### Development (Sandbox)

1. Sign up at [https://www.twilio.com](https://www.twilio.com)
2. Go to Console > Messaging > Try it out > WhatsApp
3. Note your Account SID and Auth Token
4. Send the join message from your phone
5. Install ngrok for local webhooks:
   ```bash
   brew install ngrok  # macOS
   # or download from https://ngrok.com
   ```
6. Start ngrok:
   ```bash
   ngrok http 3000
   ```
7. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
8. Configure Twilio webhook:
   - Go to Console > Messaging > Settings > WhatsApp Sandbox Settings
   - Set "When a message comes in" to: `https://abc123.ngrok.io/api/webhooks/twilio`
   - Set HTTP method to POST

Add to `.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886  # Sandbox number
TWILIO_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/webhooks/twilio
```

#### Production

1. Apply for WhatsApp Business API access in Twilio Console
2. Get approval and activate your business number
3. Update webhook URL to production domain

### Google Drive API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API:
   - Go to APIs & Services > Library
   - Search for "Google Drive API"
   - Click Enable
4. Create OAuth 2.0 Credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: Web application
   - Name: DocChase
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/settings/google-callback`
     - Production: `https://yourdomain.com/api/settings/google-callback`
5. Copy Client ID and Client Secret

Add to `.env`:
```
GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/settings/google-callback
```

### Anthropic Claude API

1. Sign up at [https://console.anthropic.com](https://console.anthropic.com)
2. Go to API Keys
3. Create a new API key
4. Copy the key

Add to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### BankToFile API

Contact BankToFile for API access and credentials.

Add to `.env`:
```
BANKTOFILE_API_URL=https://api.banktofile.com
BANKTOFILE_API_KEY=your-api-key
```

### Cron Secret

Generate a random string for securing cron endpoints:

```bash
openssl rand -hex 32
```

Add to `.env`:
```
CRON_SECRET=<generated-secret>
```

---

## Testing the Setup

### 1. Test Registration

1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in practice name, email, password
4. Click "Create Account"

### 2. Test Login

1. Go to http://localhost:3000/login
2. Enter email and password
3. Should redirect to dashboard

### 3. Test Client Creation

1. From dashboard, go to "Clients"
2. Click "Add Client"
3. Enter client details
4. Save

### 4. Test WhatsApp Integration

1. Make sure ngrok is running
2. Create a campaign with a client
3. Start the campaign
4. You should receive a WhatsApp message on the number you registered in Twilio sandbox
5. Reply with a message
6. Check the logs to see if webhook was triggered

---

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/docchase.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables (same as `.env` but update URLs)
5. Deploy

### 3. Update URLs

After deployment, update these in Vercel environment variables:

```
NEXTAUTH_URL=https://docchase.vercel.app
TWILIO_WEBHOOK_URL=https://docchase.vercel.app/api/webhooks/twilio
GOOGLE_REDIRECT_URI=https://docchase.vercel.app/api/settings/google-callback
NEXT_PUBLIC_APP_URL=https://docchase.vercel.app
```

### 4. Configure Webhooks

Update Twilio webhook URL to your production URL.

### 5. Cron Jobs

Vercel will automatically configure cron jobs from `vercel.json`:
- Reminders run daily at 9 AM
- Stuck flagging runs daily at 10 AM

To manually trigger:
```bash
curl -X POST https://docchase.vercel.app/api/cron/send-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Troubleshooting

### Database Connection Issues

- Check DATABASE_URL is correct
- Ensure database is running
- For hosted databases, check IP whitelist settings

### Twilio Webhook Not Working

- Verify ngrok is running
- Check webhook URL is correct in Twilio console
- Look at Twilio debugger for error messages
- Check your server logs

### Google Drive Integration Issues

- Verify redirect URI exactly matches in Google Console
- Check that Drive API is enabled
- Ensure OAuth consent screen is configured

### Claude API Errors

- Check API key is valid
- Verify you have credits/subscription
- Check rate limits

---

## Next Steps

1. Complete the Settings page for Google Drive connection UI
2. Build Campaign creation wizard
3. Add CSV import functionality
4. Implement email notifications
5. Add conversation view for client messages
6. Build analytics dashboard

---

## Support

For issues, check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)
- [Google Drive API Docs](https://developers.google.com/drive)
- [Anthropic API Docs](https://docs.anthropic.com)
