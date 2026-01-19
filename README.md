# 📚 Student Notice System

A modern, full-stack web application that allows students to register and receive official notices via email. Features a beautiful glassmorphism UI with real-time updates.

## ✨ Features

- **Student Registration**: Students can register with their name, phone number, and email
- **Email Notifications**: Automatic email notifications sent to all registered students when a new notice is posted
- **Notice Board**: Real-time display of all official notices
- **Admin Panel**: Post new notices, view registered students, and manage existing notices
- **Premium UI**: Modern dark theme with glassmorphism effects, gradients, and smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd c:\Users\sinha\OneDrive\Desktop\email
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure email settings** (optional):
   - Copy `.env.example` to `.env` if needed
   - Edit `.env` file:
     - Set `EMAIL_USER` to your Gmail address
     - Set `EMAIL_PASS` to your Gmail App Password
     - Set `ENABLE_EMAIL=true` to enable actual email sending
   
   **Note**: By default, emails are logged to console only (`ENABLE_EMAIL=false`)

### Running the Application

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Access the application**:
   - Student Portal: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin.html

## 📧 Email Configuration (Optional)

To enable actual email sending:

1. **Create a Gmail App Password**:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

2. **Update `.env` file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ENABLE_EMAIL=true
   ```

3. **Restart the server** for changes to take effect

## 🎯 Usage

### For Students

1. Open http://localhost:3000
2. Fill in the registration form with your details
3. Submit to register
4. View all official notices on the notice board
5. Receive email notifications for new notices (if email is enabled)

### For Administrators

1. Open http://localhost:3000/admin.html
2. View statistics (total students and notices)
3. Post new notices using the form
4. View all registered students
5. Delete notices if needed

## 🏗️ Project Structure

```
email/
├── public/                 # Frontend files
│   ├── index.html         # Student portal
│   ├── admin.html         # Admin panel
│   ├── styles.css         # Premium CSS design system
│   ├── app.js             # Student portal JavaScript
│   └── admin.js           # Admin panel JavaScript
├── server.js              # Express server & API routes
├── database.js            # SQLite database operations
├── emailService.js        # Email sending functionality
├── package.json           # Project dependencies
├── .env                   # Environment variables
└── student_notices.db     # SQLite database (auto-created)
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Email**: Nodemailer (Gmail SMTP)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Glassmorphism, CSS Gradients, Animations

## 📱 API Endpoints

### Student Endpoints
- `POST /api/register` - Register a new student
- `GET /api/notices` - Get all notices

### Admin Endpoints
- `GET /api/students` - Get all registered students
- `POST /api/notices` - Create a new notice
- `DELETE /api/notices/:id` - Delete a notice

## 🎨 Design Features

- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations and transitions
- Responsive layout
- Auto-refreshing notice board
- Form validation
- Loading states
- Success/error alerts

## 🔒 Security Features

- Input validation
- XSS prevention (HTML escaping)
- Email format validation
- Duplicate email prevention
- CORS enabled
- Environment variables for sensitive data

## 📝 Notes

- The database file (`student_notices.db`) is automatically created on first run
- Notices auto-refresh every 30 seconds
- Email sending is disabled by default for testing purposes
- All timestamps are stored in UTC and displayed in local time

## 🐛 Troubleshooting

**Server won't start**:
- Make sure port 3000 is not in use
- Check that all dependencies are installed (`npm install`)

**Emails not sending**:
- Verify `ENABLE_EMAIL=true` in `.env`
- Check Gmail credentials are correct
- Ensure App Password is used (not regular password)
- Check console for error messages

**Database errors**:
- Delete `student_notices.db` and restart server to recreate

## 🚀 Deployment

### Deploy to Vercel

This application is ready to deploy to Vercel with zero configuration:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables** on Vercel Dashboard:
   - Go to your project settings on Vercel
   - Add the following environment variables:
     - `EMAIL_USER` - Your Gmail address
     - `EMAIL_PASS` - Your Gmail App Password
     - `ENABLE_EMAIL` - Set to `true` to enable email sending

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Important Notes for Deployment

- The SQLite database will be created automatically on first run
- Make sure to set up environment variables in Vercel dashboard
- For production, consider using a cloud database (PostgreSQL, MongoDB, etc.)
- Email functionality requires valid Gmail credentials

## 👨‍💻 Developer

**Made with ❤️ by Avilash Sinha Roy**

## 📄 License

MIT License - feel free to use this project for any purpose!
