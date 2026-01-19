const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration
const EMAIL_ENABLED = process.env.ENABLE_EMAIL === 'true';

// Create transporter
let transporter = null;

if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email service is ready to send messages');
    }
  });
} else {
  console.log('Email service is DISABLED. Emails will be logged to console only.');
}

// Email templates
function createNoticeEmailHTML(studentName, noticeTitle, noticeContent) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          line-height: 1.6;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 50px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .icon-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin-bottom: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }
        .header h1 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-top: 10px;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 40px;
          background: #ffffff;
        }
        .greeting {
          font-size: 18px;
          color: #2d3748;
          margin-bottom: 20px;
        }
        .greeting strong {
          color: #667eea;
          font-weight: 600;
        }
        .intro-text {
          color: #4a5568;
          font-size: 16px;
          margin-bottom: 30px;
        }
        .notice-card {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 16px;
          padding: 30px;
          margin: 30px 0;
          border: 2px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }
        .notice-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }
        .notice-label {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 15px;
        }
        .notice-title {
          color: #1a202c;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        .notice-content {
          color: #4a5568;
          font-size: 16px;
          line-height: 1.8;
          white-space: pre-wrap;
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
          margin: 30px 0;
        }
        .cta-section {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s;
        }
        .signature {
          margin-top: 30px;
          color: #4a5568;
          font-size: 15px;
        }
        .signature-name {
          color: #2d3748;
          font-weight: 600;
          margin-top: 5px;
        }
        .footer {
          background: #f7fafc;
          padding: 30px 40px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #718096;
          font-size: 13px;
          line-height: 1.6;
        }
        .footer-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .social-links {
          margin-top: 20px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 8px;
          color: #a0aec0;
          text-decoration: none;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="icon-badge">📢</div>
          <h1>New Notice Posted</h1>
          <p>Important Update for Students</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello <strong>${studentName}</strong>! 👋
          </div>
          
          <p class="intro-text">
            A new official notice has been posted to the student portal. Please review the details below:
          </p>
          
          <div class="notice-card">
            <div class="notice-label">📋 Official Notice</div>
            <div class="notice-title">${noticeTitle}</div>
            <div class="notice-content">${noticeContent}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="cta-section">
            <a href="http://localhost:3000" class="cta-button">
              View Notice Board →
            </a>
          </div>
          
          <div class="signature">
            <p>Best regards,</p>
            <p class="signature-name">Student Notice System Team</p>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-icon">🎓</div>
          <p class="footer-text">
            This is an automated notification from the Student Notice System.<br>
            Please do not reply to this email.
          </p>
          <div class="social-links">
            <a href="#">Help Center</a> • 
            <a href="#">Contact Support</a> • 
            <a href="#">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send notice to all students
async function sendNoticeToAllStudents(students, noticeTitle, noticeContent) {
  const results = {
    sent: [],
    failed: [],
    logged: []
  };

  for (const student of students) {
    try {
      if (EMAIL_ENABLED && transporter) {
        // Send actual email
        const mailOptions = {
          from: `"Student Notice System" <${process.env.EMAIL_USER}>`,
          to: student.email,
          subject: `New Notice: ${noticeTitle}`,
          html: createNoticeEmailHTML(student.name, noticeTitle, noticeContent)
        };

        await transporter.sendMail(mailOptions);
        results.sent.push(student.email);
        console.log(`✅ Email sent to ${student.email}`);
      } else {
        // Log to console instead
        console.log('\n📧 [EMAIL LOG] ========================');
        console.log(`To: ${student.email}`);
        console.log(`Name: ${student.name}`);
        console.log(`Subject: New Notice: ${noticeTitle}`);
        console.log(`Content: ${noticeContent}`);
        console.log('========================================\n');
        results.logged.push(student.email);
      }
    } catch (error) {
      console.error(`❌ Failed to send email to ${student.email}:`, error.message);
      results.failed.push({ email: student.email, error: error.message });
    }
  }

  return results;
}

// Send welcome email to new student
async function sendWelcomeEmail(studentName, studentEmail) {
  const welcomeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          line-height: 1.6;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 50px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .icon-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          margin-bottom: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }
        .header h1 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-top: 10px;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 40px;
          background: #ffffff;
        }
        .greeting {
          font-size: 18px;
          color: #2d3748;
          margin-bottom: 20px;
        }
        .greeting strong {
          color: #667eea;
          font-weight: 600;
        }
        .success-card {
          background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
          border-radius: 16px;
          padding: 40px;
          margin: 30px 0;
          text-align: center;
          border: 2px solid #9ae6b4;
          position: relative;
          overflow: hidden;
        }
        .success-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #48bb78 0%, #38a169 100%);
        }
        .success-icon {
          font-size: 60px;
          margin-bottom: 20px;
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .success-title {
          color: #22543d;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .success-text {
          color: #2f855a;
          font-size: 16px;
        }
        .features-section {
          margin: 30px 0;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          margin: 20px 0;
          padding: 15px;
          background: #f7fafc;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }
        .feature-icon {
          font-size: 24px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .feature-text {
          flex: 1;
        }
        .feature-title {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .feature-description {
          color: #718096;
          font-size: 14px;
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
          margin: 30px 0;
        }
        .cta-section {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .signature {
          margin-top: 30px;
          color: #4a5568;
          font-size: 15px;
        }
        .signature-name {
          color: #2d3748;
          font-weight: 600;
          margin-top: 5px;
        }
        .footer {
          background: #f7fafc;
          padding: 30px 40px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #718096;
          font-size: 13px;
          line-height: 1.6;
        }
        .footer-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="icon-badge">🎉</div>
          <h1>Welcome Aboard!</h1>
          <p>You're now part of the Student Notice System</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello <strong>${studentName}</strong>! 👋
          </div>
          
          <div class="success-card">
            <div class="success-icon">✅</div>
            <div class="success-title">Registration Successful!</div>
            <div class="success-text">Your account has been created and activated</div>
          </div>
          
          <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
            Thank you for registering with the Student Notice System. You're all set to receive important updates and announcements!
          </p>
          
          <div class="features-section">
            <div class="feature-item">
              <div class="feature-icon">📧</div>
              <div class="feature-text">
                <div class="feature-title">Email Notifications</div>
                <div class="feature-description">Get instant email alerts for all new notices</div>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📋</div>
              <div class="feature-text">
                <div class="feature-title">Notice Board Access</div>
                <div class="feature-description">View all notices anytime on the student portal</div>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🔔</div>
              <div class="feature-text">
                <div class="feature-title">Real-time Updates</div>
                <div class="feature-description">Never miss important announcements</div>
              </div>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="cta-section">
            <a href="http://localhost:3000" class="cta-button">
              Visit Notice Board →
            </a>
          </div>
          
          <div class="signature">
            <p>Welcome to the community!</p>
            <p class="signature-name">Student Notice System Team</p>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-icon">🎓</div>
          <p class="footer-text">
            This is an automated welcome message from the Student Notice System.<br>
            If you have any questions, please contact support.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    if (EMAIL_ENABLED && transporter) {
      const mailOptions = {
        from: `"Student Notice System" <${process.env.EMAIL_USER}>`,
        to: studentEmail,
        subject: 'Welcome to Student Notice System',
        html: welcomeHTML
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${studentEmail}`);
      return { success: true };
    } else {
      console.log('\n📧 [WELCOME EMAIL LOG] ================');
      console.log(`To: ${studentEmail}`);
      console.log(`Name: ${studentName}`);
      console.log(`Subject: Welcome to Student Notice System`);
      console.log('========================================\n');
      return { success: true, logged: true };
    }
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${studentEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendNoticeToAllStudents,
  sendWelcomeEmail
};
