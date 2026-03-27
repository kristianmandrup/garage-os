# GarageOS Operations Guide

## Manual Setup Steps

### 1. Google OAuth (Supabase Auth)

**Prerequisites**: Google Cloud project with billing enabled.

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: `GarageOS`
   - Authorized redirect URIs:
     - `https://hvvivbogypvkmutvtowx.supabase.co/auth/v1/callback`
     - `http://localhost:3330/auth/callback` (for local dev)
3. Copy **Client ID** and **Client Secret**
4. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/hvvivbogypvkmutvtowx/auth/providers)
5. Enable **Google** provider, paste Client ID and Secret
6. Save

### 2. Vercel Deployment

**Prerequisites**: Vercel account linked to GitHub.

1. Import project from GitHub in Vercel
2. For **site** deployment:
   - Root Directory: `packages/site`
   - Framework: Next.js
   - Build Command: `npx turbo run build --filter=@garageos/site`
   - Install Command: `npm install`
3. For **app** deployment:
   - Root Directory: `packages/app`
   - Framework: Next.js
   - Build Command: `npx turbo run build --filter=@garageos/app`
   - Install Command: `npm install`
   - Environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://hvvivbogypvkmutvtowx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
     ```
4. Set up custom domains if needed

### 3. Supabase Realtime

Realtime is used by NotificationCenter for live updates. Ensure it's enabled:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/hvvivbogypvkmutvtowx/database/replication)
2. Under **Realtime**, enable replication for:
   - `job_cards` table
   - `customers` table
   - `parts` table

### 4. Supabase Storage (for photos)

AI Inspection and Job Card photos require Supabase Storage:

1. Go to Storage in Supabase Dashboard
2. Create bucket: `job-photos` (public)
3. Add RLS policies:
   - Allow authenticated users to upload to their shop's folder
   - Allow public read access for report sharing

### 5. Twilio (SMS/WhatsApp messaging)

1. Create Twilio account
2. Get Account SID, Auth Token, and phone number
3. Add to Vercel environment variables:
   ```
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   ```

### 6. LINE Messaging API

1. Create LINE Developer account
2. Create a Messaging API channel
3. Get Channel Secret and Channel Access Token
4. Add to environment variables:
   ```
   LINE_CHANNEL_SECRET=
   LINE_CHANNEL_ACCESS_TOKEN=
   ```
5. Set webhook URL: `https://your-app-domain.com/api/webhooks/line`

### 7. Resend (Email)

Used by the site for contact form submissions:

1. Create [Resend](https://resend.com) account
2. Verify your domain
3. Get API key
4. Add to site environment variables:
   ```
   RESEND_API_KEY=
   ```

## Monitoring

### Supabase Dashboard
- Monitor database size, API usage, and auth events
- Check Edge Function logs if using any
- Monitor realtime connections

### Vercel Dashboard
- Monitor deployment status, build times
- Check function execution logs
- Monitor bandwidth and serverless function invocations

### Lighthouse CI
- Run `npx lighthouse <url>` periodically
- Current baseline scores:
  - Performance: 81
  - Accessibility: 100
  - Best Practices: 96
  - SEO: 100

## Database Maintenance

### Backups
Supabase Pro plan includes daily backups. For free tier:
```bash
supabase db dump --linked > backup_$(date +%Y%m%d).sql
```

### Migrations
```bash
# Create a new migration
supabase migration new <name>

# Push migrations to remote
supabase db push --linked

# Check migration status
supabase migration list --linked
```

### RLS Policies
All tables have Row Level Security enabled. Policies are defined in `supabase/migrations/0001_rls_policies.sql`. Any new tables must have RLS policies added.
