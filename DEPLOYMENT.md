# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, you need to set up a PostgreSQL database. Here are some free options:

1. **Vercel Postgres** (Recommended) - Free tier available
2. **Neon** (https://neon.tech) - Generous free tier
3. **Supabase** (https://supabase.com) - Free tier with PostgreSQL
4. **ElephantSQL** (https://www.elephantsql.com) - Free tier available

## Step 1: Create a PostgreSQL Database

### Using Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database
3. Select "Postgres"
4. Follow the setup wizard
5. Copy the `DATABASE_URL` connection string

### Using Neon (Alternative)

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@host/database`)

## Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
DATABASE_URL=your-postgresql-connection-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ENABLE_EMAIL=true
NODE_ENV=production
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

### Option B: Deploy via Git Integration

1. Push your code to GitHub
2. Import the repository in Vercel dashboard
3. Vercel will automatically deploy

## Step 4: Verify Deployment

After deployment:

1. Visit your Vercel URL
2. Test student registration
3. Test admin panel (admin.html)
4. Post a notice and verify emails are sent

## Important Notes

- **Local Development**: The app automatically uses SQLite when running locally
- **Production**: The app automatically uses PostgreSQL when `DATABASE_URL` is set
- **Email**: Make sure to use a Gmail App Password, not your regular password
- **Database Tables**: Tables are created automatically on first run

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Ensure the PostgreSQL database is accessible
- Check that SSL is enabled in the connection string if required

### Email Not Sending

- Verify `EMAIL_USER` and `EMAIL_PASS` are set correctly
- Ensure `ENABLE_EMAIL=true` in production
- Check Gmail App Password is valid

### Build Warnings

The npm warnings about deprecated packages are non-critical and won't affect deployment. They will be addressed in future updates.

## Database Migration (If You Have Existing Data)

If you have existing SQLite data you want to migrate to PostgreSQL:

1. Export data from SQLite:
   ```bash
   sqlite3 student_notices.db .dump > data.sql
   ```

2. Convert SQLite syntax to PostgreSQL (mainly `AUTOINCREMENT` → `SERIAL`)

3. Import to PostgreSQL using your database provider's tools

## Next Steps

After successful deployment:
- Share the Vercel URL with your users
- Monitor the deployment logs in Vercel dashboard
- Set up custom domain (optional)
