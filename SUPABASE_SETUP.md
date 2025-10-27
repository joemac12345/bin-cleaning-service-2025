# 🚀 Database Setup Guide - Supabase Integration

This guide will help you set up Supabase database to fix the data persistence and email issues in your bin cleaning booking system.

## 🎯 What This Fixes

✅ **Data Persistence** - Bookings will be saved permanently  
✅ **Email Reliability** - Professional email service  
✅ **Hosting Freedom** - Works on any platform  
✅ **Real-time Updates** - Live data across all instances  

## 📋 Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub (recommended) or email
4. **Free tier includes:**
   - 500MB database storage
   - 2GB bandwidth 
   - 50,000 monthly active users

## 🗄️ Step 2: Create Database Project  

1. Click "New Project"
2. Choose your organization
3. **Project Name**: `bin-cleaning-bookings`
4. **Database Password**: Create a strong password (save this!)
5. **Region**: Choose closest to your location
6. Click "Create new project" (takes ~2 minutes)

## 🔑 Step 3: Get Configuration Keys

1. In your Supabase dashboard, go to **Settings** > **General**
2. In the **Configuration** section, copy:
   - **Project URL** (starts with `https://`)
   - **Project API keys** > **anon public** (long string)

## 📁 Step 4: Configure Your App

1. **Copy environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`:**
   ```bash
   nano .env.local
   ```

3. **Add your Supabase credentials:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_long_anon_key_here
   ```

## 🏗️ Step 5: Create Database Tables

1. In Supabase dashboard, go to **Table Editor**
2. Click **Create a new table**

### Create `bookings` table:
```sql
-- Table: bookings
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  customer_info JSONB NOT NULL,
  bin_selection JSONB NOT NULL,
  collection_day TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  special_instructions TEXT,
  pricing JSONB NOT NULL,
  status TEXT DEFAULT 'new-job',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON bookings 
FOR ALL USING (true) WITH CHECK (true);
```

### Create `abandoned_forms` table:
```sql
-- Table: abandoned_forms  
CREATE TABLE abandoned_forms (
  id BIGSERIAL PRIMARY KEY,
  form_id TEXT UNIQUE NOT NULL,
  form_data JSONB NOT NULL,
  abandoned_at TIMESTAMPTZ DEFAULT NOW(),
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE abandoned_forms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON abandoned_forms 
FOR ALL USING (true) WITH CHECK (true);
```

## 📧 Step 6: Set Up Email (Optional)

### Option A: Supabase Edge Functions (Recommended)
- Use Supabase's built-in email functionality
- Configure in Supabase dashboard under **Edge Functions**

### Option B: Keep Current Email System
- Your existing Gmail SMTP will still work
- Just add the environment variables to Vercel/hosting platform

## 🚀 Step 7: Deploy & Test

1. **Deploy to your hosting platform:**
   ```bash
   git add .
   git commit -m "Add Supabase database integration"
   git push
   ```

2. **Add environment variables to your hosting:**
   - **Vercel**: Project Settings > Environment Variables
   - **Netlify**: Site Settings > Environment Variables  
   - **Railway**: Variables tab in project dashboard

3. **Test the system:**
   - Submit a booking through your form
   - Check Supabase Table Editor to see the data
   - Visit your admin panel to confirm bookings appear

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database tables created (`bookings`, `abandoned_forms`)
- [ ] Environment variables configured
- [ ] App deployed with new database
- [ ] Test booking submission works
- [ ] Admin panel shows real bookings
- [ ] Data persists between page refreshes

## 🆘 Troubleshooting

### Common Issues:

**"Cannot connect to database"**
- Check environment variables are correct
- Ensure `.env.local` is not in `.gitignore`
- Verify Supabase project URL and API key

**"Row Level Security" errors**
- Make sure RLS policies are created
- Check policies allow the operations you need

**Bookings not appearing**
- Check Supabase Table Editor directly
- Look at browser developer console for errors
- Verify API endpoints are working

## 💡 Next Steps After Setup

Once this is working, you can:
1. **Add user authentication** 
2. **Set up automated emails**
3. **Add booking notifications**
4. **Deploy to any hosting platform**

## 🎉 Benefits You'll Get

- **Permanent data storage** - No more demo-only data
- **Professional database** - PostgreSQL with automatic backups  
- **Real-time features** - Live updates across all sessions
- **Hosting flexibility** - Works with GoDaddy, Vercel, Netlify, etc.
- **Scalability** - Handles growth from day one

---

**Need help?** The setup should take about 15-20 minutes total. Each step builds on the previous one, so go through them in order!
