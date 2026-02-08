# DocChase - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Setup Environment (2 min)

Create `.env` file:

```bash
cp .env.example .env
```

**Minimum required for local testing:**

```env
# Database (use Neon for quick setup)
DATABASE_URL=postgresql://user:password@hostname/database

# Auth Secret (generate one)
NEXTAUTH_SECRET=any-random-32-character-string-here
NEXTAUTH_URL=http://localhost:3000

# For testing without external APIs (optional)
TWILIO_ACCOUNT_SID=test
TWILIO_AUTH_TOKEN=test
TWILIO_WHATSAPP_NUMBER=+1234567890
TWILIO_WEBHOOK_URL=http://localhost:3000/api/webhooks/twilio

GOOGLE_CLIENT_ID=test
GOOGLE_CLIENT_SECRET=test
GOOGLE_REDIRECT_URI=http://localhost:3000/api/settings/google-callback

ANTHROPIC_API_KEY=test
BANKTOFILE_API_URL=http://example.com
BANKTOFILE_API_KEY=test

CRON_SECRET=any-random-string

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get a free database in 30 seconds:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create database
4. Copy connection string to `DATABASE_URL`

### 3. Setup Database (1 min)

```bash
npm run db:migrate
```

### 4. Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ You're Done!

### Test It Out:

1. **Register** - Create an account at `/register`
2. **Login** - Sign in at `/login`
3. **Add Client** - Go to Clients > Add Client
4. **View Dashboard** - See the main dashboard

---

## 🔧 Full Setup (Production)

For production with all features working:

### Required APIs:

1. **Twilio WhatsApp** (for messaging)
   - Sign up at [twilio.com](https://twilio.com)
   - Use sandbox for free testing
   - See [SETUP.md](./SETUP.md) for details

2. **Google Drive** (for file storage)
   - Create project at [console.cloud.google.com](https://console.cloud.google.com)
   - Enable Drive API
   - Create OAuth credentials

3. **Anthropic Claude** (for AI responses)
   - Get API key at [console.anthropic.com](https://console.anthropic.com)
   - Haiku model is cheap (~$0.25/1M tokens)

4. **BankToFile** (for PDF conversion)
   - Contact BankToFile for API access
   - Optional - can work without this

---

## 📁 Project Structure

```
docchase/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── login/             # Login page
│   └── register/          # Register page
├── components/ui/         # shadcn/ui components
├── lib/                   # Utilities & integrations
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Database client
│   ├── twilio.ts         # WhatsApp integration
│   ├── google-drive.ts   # Drive integration
│   ├── claude.ts         # AI integration
│   └── schema.sql        # Database schema
└── scripts/              # Database migrations
```

---

## 🎯 What Works Right Now

✅ **Authentication** - Register, login, sessions
✅ **Client Management** - CRUD operations
✅ **Campaigns** - Create and track campaigns
✅ **Dashboard** - Live progress tracking
✅ **WhatsApp Integration** - Send/receive messages
✅ **AI Responses** - Claude-powered replies
✅ **File Upload** - Google Drive storage
✅ **PDF Conversion** - BankToFile integration
✅ **Automation** - Scheduled reminders
✅ **Production Ready** - Builds successfully

---

## 📚 Documentation

- **[README.md](./README.md)** - Full project overview
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical architecture

---

## 🆘 Common Issues

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection

```bash
# Test connection
npm run db:migrate
```

If fails, check:
- `DATABASE_URL` is correct
- Database is running
- Network allows connections

### Port Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

---

## 🚢 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com
# 3. Import your repo
# 4. Add environment variables
# 5. Deploy!
```

---

## 💡 Next Steps

1. **Setup Twilio** - Get WhatsApp working
2. **Connect Google Drive** - Enable file uploads
3. **Add Clients** - Import your client list
4. **Create Campaign** - Start chasing documents!

---

## 🎉 Built With

- Next.js 16
- TypeScript
- shadcn/ui
- Tailwind CSS
- PostgreSQL
- Twilio WhatsApp API
- Claude AI
- Google Drive API

---

**Questions?** Check the docs or open an issue!

**Ready to chase some documents?** Let's go! 🚀
