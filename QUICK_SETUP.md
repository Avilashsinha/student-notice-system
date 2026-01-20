# Quick Setup: PostgreSQL for Vercel

Your app is deployed at **https://emailreg.vercel.app** but needs a database to work!

## Fastest Method: Vercel Postgres (5 minutes)

### Step 1: Login to Vercel
Visit: https://vercel.com/dashboard

### Step 2: Open Your Project
Click on "emailreg" project

### Step 3: Create Database
1. Click "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Click "Continue"
5. Accept default settings
6. Click "Create"

### Step 4: Connect Database to Project
1. After database is created, click "Connect to Project"
2. Select "emailreg" project
3. Click "Connect"
4. Vercel will automatically add `DATABASE_URL` environment variable

### Step 5: Add Other Environment Variables
1. Go to Settings → Environment Variables
2. Add these variables:

```
EMAIL_USER = agencyhack91@gmail.com
EMAIL_PASS = joyk tnax uhqg wbuy
ENABLE_EMAIL = true
NODE_ENV = production
```

### Step 6: Redeploy
1. Go to Deployments tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Wait 1-2 minutes

### Step 7: Test Your App!
Visit: https://emailreg.vercel.app

✅ Registration should work  
✅ Admin panel should load  
✅ Email notifications should send

---

## Alternative: Neon (Free Forever)

If you prefer not to use Vercel Postgres:

1. **Sign up**: https://neon.tech
2. **Create project**: Click "New Project"
3. **Copy connection string**: It looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb
   ```
4. **Add to Vercel**:
   - Go to Vercel → emailreg → Settings → Environment Variables
   - Add `DATABASE_URL` with your Neon connection string
5. **Redeploy** from Vercel dashboard

---

## Troubleshooting

### Still getting 500 errors?
- Check that `DATABASE_URL` is set in Vercel environment variables
- Make sure you redeployed after adding environment variables
- Check Vercel deployment logs for specific errors

### Emails not sending?
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Make sure `ENABLE_EMAIL=true`
- Check that the Gmail app password is valid

### Database connection errors?
- Ensure PostgreSQL database is running
- Verify connection string format is correct
- Check that SSL is enabled (Vercel Postgres handles this automatically)

---

## Current Status

✅ **Deployed**: https://emailreg.vercel.app  
✅ **UI Working**: Beautiful design loads perfectly  
⚠️ **Database**: Needs PostgreSQL configuration  
⚠️ **Functionality**: Will work once database is configured

**Estimated time to complete setup: 5-10 minutes**
