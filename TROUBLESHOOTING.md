# 🔧 Troubleshooting Guide - Emails & Admin Panel

## Current Issues Reported
1. ❌ Emails not being received
2. ❌ Registration panel not working
3. ❌ Notice panel not working

---

## ✅ Quick Fixes

### Step 1: Restart the Server (MOST IMPORTANT!)
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Start the server fresh
cd c:\Users\sinha\OneDrive\Desktop\email
node server.js
```

### Step 2: Clear Browser Cache
- Press `Ctrl` + `Shift` + `Delete`
- Select "Cached images and files"
- Clear data
- OR press `Ctrl` + `Shift` + `R` (hard refresh)

### Step 3: Re-login
- Go to: http://localhost:3000/login.html
- Username: `admin`
- Password: `admin123`
- Login again

---

## 📧 Email Troubleshooting

### Check 1: Email is Enabled
Your `.env` file shows:
```
ENABLE_EMAIL=true
EMAIL_USER=agencyhack91@gmail.com
EMAIL_PASS=joyk tnax uhqg wbuy
```

✅ This looks correct!

### Check 2: Gmail App Password
Make sure the password is a **Gmail App Password**, not your regular Gmail password:

1. Go to: https://myaccount.google.com/apppasswords
2. Create a new app password
3. Copy the 16-character password (without spaces)
4. Update `.env`:
   ```
   EMAIL_PASS=your-16-char-app-password
   ```
5. **Restart the server!**

### Check 3: Console Logs
When the server runs, you should see:
```
✅ Email service is ready to send messages
```

If you see:
```
❌ Email transporter verification failed
```
Then your email credentials are wrong.

### Check 4: Test Email Manually
Check the server console after registering a student. You should see:
```
✅ Email sent to student@email.com
```

Or if it fails:
```
❌ Failed to send email to student@email.com: [error message]
```

---

## 🔧 Registration Panel Fix

### Issue: Registration form not submitting

**Possible causes:**
1. Not logged in (session expired)
2. Browser cache issues  
3. JavaScript error in console

**Solutions:**

#### Solution 1: Check if Logged In
1. Open browser console (F12)
2. You should see your username in the admin panel header
3. If you see "Login Required" error, re-login

#### Solution 2: Hard Refresh
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

#### Solution 3: Check Console for Errors
1. Press F12
2. Go to "Console" tab
3. Try registering a student
4. Look for red error messages
5. Share the error if you see any

---

## 📢 Notice Panel Fix

### Issue: Cannot post notices

**Same fixes as Registration Panel:**

1. **Re-login:** http://localhost:3000/login.html
2. **Hard refresh:** `Ctrl + Shift + R`
3. **Check console** for errors (F12)

---

## 🎯 Complete Reset Procedure

If nothing works, follow this:

### Step 1: Stop Server
```powershell
taskkill /F /IM node.exe
```

### Step 2: Clear Browser Data
- Close ALL browser windows
- Reopen browser
- Press `Ctrl + Shift + Delete`
- Clear "Cookies" and "Cached files"

### Step 3: Verify Dependencies
```powershell
cd c:\Users\sinha\OneDrive\Desktop\email
npm install
```

### Step 4: Start Server
```powershell
node server.js
```

Wait for:
```
========================================
🚀 Student Notice System Server Running
========================================
📍 Server: http://localhost:3000
⚙️  Admin Panel: http://localhost:3000/admin.html
✅ Email service is ready to send messages
========================================
```

### Step 5: New Login
1. Go to: http://localhost:3000/login.html
2. Login with: admin/admin123
3. Try registering a test student

---

## 🔍 Debugging Steps

### Test 1: Check Server is Running
```powershell
curl http://localhost:3000 -UseBasicParsing
```
Should return HTML content.

### Test 2: Check Login Works
1. Go to: http://localhost:3000/login.html
2. Open console (F12)
3. Login
4. Check for "Login successful" message

### Test 3: Check Registration
1. In admin panel, fill registration form
2. Open Network tab (F12 → Network)
3. Click "Register Student"
4. Check the `/api/register` request
5. Should return `200 OK` or `201 Created`

### Test 4: Check Email Logs
After trying to register a student or post a notice, check the server console for:
```
✅ Email sent to [email]
```
or
```
📧 [EMAIL LOG] ... (if emails disabled)
```

---

## ⚠️ Common Error Messages & Fixes

### Error: "401 Unauthorized"
**Fix:** You're not logged in. Login at `/login.html`

### Error: "Failed to fetch"
**Fix:** Server not running. Start with `node server.js`

### Error: "Network error"
**Fix:** 
1. Check server is running
2. Check you're using http://localhost:3000 (not just localhost)
3. Restart server

### Error: "Email already registered"
**Fix:** Use a different email address (that student already exists)

### Error: "Invalid email format"
**Fix:** Type a valid email like `test@example.com`

---

## 📊 What Should Happen (Expected Behavior)

### Registration Process:
1. Fill form with Name, Phone, Email
2. Click "Register Student"
3. Button shows "Registering..."
4. Success message appears: "✅ Student registered successfully! Welcome email sent."
5. Form clears
6. Student appears in "Registered Students" section below
7. Server console shows: `✅ Email sent to [email]`

### Notice Posting Process:
1. Fill form with Title and Content
2. Click "Post Notice & Send Emails"
3. Button shows "Posting & Sending Emails..."
4. Success message appears
5. Form clears
6. Notice appears in "Manage Notices" section
7. Emails sent to ALL students
8. Server console shows email sending to each student

---

## 🆘 Still Not Working?

Share these details:

1. **Browser console errors** (F12 → Console → screenshot)
2. **Server console output** (what you see in PowerShell)
3. **Network tab** (F12 → Network → screenshot of failed request)
4. **Exact error message** you see

---

## 📝 Quick Test Script

Run this to test registration manually:

```powershell
# Test if server is running and accepts registration
$body = @{
    name = "Test Student"
    phoneNumber = "1234567890"
    email = "test@example.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

This should return success if everything is working.

---

**Follow these steps in order and let me know which step fails!** 🔧
