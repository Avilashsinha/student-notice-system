# ⚡ QUICK REFERENCE - Admin Panel

## 🔥 START SERVER
```powershell
cd c:\Users\sinha\OneDrive\Desktop\email
node server.js
```
**Keep PowerShell open!**

## 🔐 LOGIN
**URL:** http://localhost:3000/login.html
- Username: `admin`
- Password: `admin123`

## 👨‍🎓 REGISTER STUDENT
1. Fill form with name, phone, email
2. Click "Register Student"
3. ✅ Success → Welcome email sent!

## 📄 BULK UPLOAD (CSV)
1. Create CSV: `name,phoneNumber,email`
2. Choose file
3. Click "Upload CSV"
4. ✅ All registered → Welcome emails sent!

## 📢 POST NOTICE
1. Fill title and content
2. Click "Post Notice & Send Emails"
3. ✅ Notice posted → Emails sent to ALL students!

## 🌐 VIEW PUBLIC PAGE
**URL:** http://localhost:3000

## 📧 EMAILS
- **Welcome Email:** Sent when student registered
- **Notice Email:** Sent when notice posted
- **Check:** agencyhack91@gmail.com

## ⚠️ IMPORTANT
- Database is NOW EMPTY (sample students removed)
- Register REAL students now
- Each student gets welcome email first
- Then notice emails when you post

## 🔄 RESTART SERVER
```powershell
taskkill /F /IM node.exe
node server.js
```

## 🆘 HELP
**Not working?** Hard refresh: `Ctrl + Shift + R`

**Read:** `START_HERE.md` for complete guide

---
**Everything is ready! Start using it now!** 🚀
