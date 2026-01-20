# Database Setup Guide

## Problem
The tables (`students` and `notices`) are not created in your Supabase PostgreSQL database.

## Solution Options

### Option 1: Use Supabase SQL Editor (Recommended - Easiest)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Sign in to your account
   - Select your project: `qlmtudaozofwaccmrdyk`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy the contents of `create-tables.sql` file
   - Paste it into the SQL editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Tables Created**
   - You should see a success message
   - The verification query at the end will show:
     ```
     table_name | column_count
     -----------+-------------
     notices    | 4
     students   | 5
     ```

5. **Check Table Browser**
   - Click on "Table Editor" in the left sidebar
   - You should now see `students` and `notices` tables

### Option 2: Use Node.js Script

If you prefer to create tables programmatically:

1. **Run the initialization script**
   ```bash
   node init-database.js
   ```

2. **Check the output**
   - You should see success messages for each table
   - The script will verify the table structure

### Option 3: Let the Server Create Tables Automatically

The server is configured to create tables automatically on startup:

1. **Start the server**
   ```bash
   npm start
   ```

2. **Check the console output**
   - Look for messages like:
     - "Connected to PostgreSQL database"
     - "Students table ready (PostgreSQL)"
     - "Notices table ready (PostgreSQL)"

## Verification

After creating the tables, verify they exist:

### Using Supabase Dashboard:
1. Go to "Table Editor"
2. You should see both `students` and `notices` tables

### Using Node.js:
Run this command to test the connection:
```bash
node test-db.js
```

## Table Schemas

### Students Table
- `id` - SERIAL PRIMARY KEY
- `name` - TEXT NOT NULL
- `phone_number` - TEXT NOT NULL
- `email` - TEXT NOT NULL UNIQUE
- `registered_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Notices Table
- `id` - SERIAL PRIMARY KEY
- `title` - TEXT NOT NULL
- `content` - TEXT NOT NULL
- `posted_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## Next Steps

Once tables are created:

1. **Test locally**
   ```bash
   npm start
   ```
   - Visit http://localhost:3000
   - Try registering a student
   - Try posting a notice from admin panel

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```
   - Or run `setup-vercel-env.bat` to configure environment variables and deploy

## Troubleshooting

### If tables still don't exist:
1. Check your DATABASE_URL is correct in `.env`
2. Verify you can connect to Supabase from your IP
3. Check Supabase project is active (not paused)

### If you get connection errors:
1. Verify the password in DATABASE_URL matches your Supabase password
2. Check the `@` symbol is URL-encoded as `%40`
3. Ensure SSL is enabled in the connection string
