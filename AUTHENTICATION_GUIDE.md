# Admin Panel Authentication Guide 🔐

## Overview

The admin panel is now protected with **username and password authentication**. Only authorized users can access the admin features including student registration, notice posting, and student/notice management.

---

## 🔑 **Default Login Credentials**

**Username:** `admin`  
**Password:** `admin123`

⚠️ **IMPORTANT**: Change these default credentials in your `.env` file before deploying to production!

---

## 🚀 **How to Access the Admin Panel**

### Step 1: Start the Server
Run the server using one of these methods:
- Double-click `start-server.bat`
- OR run `node server.js` in your terminal

### Step 2: Navigate to Login Page
Open your browser and go to:
```
http://localhost:3000/login.html
```

### Step 3: Enter Credentials
- Username: `admin`
- Password: `admin123`
- Click "🚀 Login to Admin Panel"

### Step 4: Access Admin Features
After successful login, you'll be automatically redirected to the admin panel where you can:
- Register students (manually or via CSV)
- Post notices
- View and manage registered students
- Delete students or notices

---

## 🔒 **Security Features**

✅ **Session-based Authentication**
- Secure session cookies (HttpOnly)
- 24-hour session duration
- Automatic redirect to login if not authenticated

✅ **Protected Routes**
- All admin API endpoints require authentication
- Unauthenticated requests return 401 Unauthorized
- Session validation on every request

✅ **Secure Logout**
- Logout button in admin panel header
- Session destroyed on logout
- Redirects to login page

---

## ⚙️ **Changing Admin Credentials**

### Method 1: Edit .env File (Recommended)
1. Open `.env` file in your project folder
2. Find these lines:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   SESSION_SECRET=your-secret-key-change-this-in-production
   ```
3. Change to your desired username and password:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   SESSION_SECRET=a-random-long-string-for-production
   ```
4. Save the file
5. Restart the server

### Method 2: Environment Variables
Set environment variables before starting the server:
```powershell
$env:ADMIN_USERNAME="your_username"
$env:ADMIN_PASSWORD="your_secure_password"
node server.js
```

---

## 🎯 **What Requires Authentication**

### ✅ Protected (Requires Login):
- `/admin.html` - Admin panel
- `/api/register` - Student registration
- `/api/students` - View students list
- `/api/notices` - Post new notices
- `/api/notices/:id` - Delete notices
- `/api/students/:id` - Delete students

### 🌐 Public (No Login Required):
- `/` - Public notice board
- `/login.html` - Login page
- `/api/notices` (GET) - View notices (publicly accessible)

---

## 🛠️ **Troubleshooting**

### Problem: Can't login / Invalid credentials
**Solution:**
1. Check your `.env` file for correct credentials
2. Make sure you're using the exact username and password
3. Restart the server after changing `.env`

### Problem: Redirected to login page immediately after logging in
**Solution:**
1. Clear your browser cookies
2. Make sure the server is running properly
3. Check if SESSION_SECRET is set in `.env`

### Problem: Session expires too quickly
**Solution:**
The session lasts for 24 hours by default. To change this, edit `server.js`:
```javascript
cookie: {
    maxAge: 24 * 60 * 60 * 1000 // Change this value (in milliseconds)
}
```

### Problem: Forgot admin password
**Solution:**
1. Open `.env` file
2. Set a new password for `ADMIN_PASSWORD`
3. Restart the server
4. Login with the new password

---

## 📝 **Login Page Features**

✨ **Modern, Secure UI**
- Glassmorphism design
- Floating particle animations
- Password visibility toggle (👁️ button)
- Real-time validation
- Error/success notifications

✨ **User Experience**
- Auto-focus on username field
- Enter key to submit form
- Redirect to admin panel on success
- Link back to public notice board

---

## 🔐 **Best Practices for Production**

1. **Change Default Credentials**
   - Use strong, unique username
   - Use complex password (min 12 characters)
   - Mix uppercase, lowercase, numbers, and symbols

2. **Secure Session Secret**
   - Generate a random, long string
   - Never commit SESSION_SECRET to version control
   - Use different secrets for different environments

3. **Use HTTPS in Production**
   - Set `secure: true` in cookie options
   - Ensures cookies only sent over HTTPS

4. **Environment Variables**
   - Never hardcode credentials
   - Use `.env` file (and add to `.gitignore`)
   - Use environment variables in production (Vercel, Heroku, etc.)

5. **Consider Additional Security**
   - Add rate limiting to prevent brute force
   - Implement password hashing (bcrypt)
   - Add two-factor authentication (2FA)
   - Add IP whitelisting for admin access

---

## 📊 **Session Management**

### Session Duration
- Default: 24 hours (1 day)
- Configured in `server.js`
- Session automatically expires after inactivity

### Session Storage
- Stored in memory (default)
- For production, consider using Redis or database-backed sessions

### Logout
- Click "🚪 Logout" button in admin panel header
- Session is destroyed server-side
- Redirects to login page

---

## 🆘 **Need Help?**

If you encounter any issues:
1. Check the console for error messages
2. Verify `.env` file has correct syntax
3. Restart the server
4. Clear browser cookies and cache
5. Check that `express-session` package is installed

---

## 📋 **Summary**

✅ Admin panel now requires username/password  
✅ Default credentials: admin/admin123  
✅ Session-based authentication (24-hour duration)  
✅ All admin routes protected  
✅ Secure logout functionality  
✅ Modern login page with beautiful UI  

**Login URL:** `http://localhost:3000/login.html`  
**Admin Panel:** `http://localhost:3000/admin.html` (requires login)

---

**Your admin panel is now secure!** 🎉  
Remember to change the default credentials before deploying to production!
