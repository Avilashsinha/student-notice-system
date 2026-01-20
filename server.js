const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
require('dotenv').config();

const { sendNoticeToAllStudents, sendWelcomeEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3000;


// File-based storage (simple JSON files)
const STUDENTS_FILE = path.join(__dirname, 'students.json');
const NOTICES_FILE = path.join(__dirname, 'notices.json');

// Load data from files
function loadStudents() {
    try {
        if (fs.existsSync(STUDENTS_FILE)) {
            return JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error loading students:', err);
    }
    return [];
}

function loadNotices() {
    try {
        if (fs.existsSync(NOTICES_FILE)) {
            return JSON.parse(fs.readFileSync(NOTICES_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error loading notices:', err);
    }
    return [];
}

function saveStudents(students) {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
}

function saveNotices(notices) {
    fs.writeFileSync(NOTICES_FILE, JSON.stringify(notices, null, 2));
}

let students = loadStudents();
let notices = loadNotices();

// Middleware
// CORS Configuration - works in development and production
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || true // Set FRONTEND_URL in production env vars
        : 'http://localhost:3000',
    credentials: true // Important for session cookies
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Important for cross-site cookies in production
    }
}));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login.'
    });
}

// API Routes

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true;
        req.session.username = username;

        res.json({
            success: true,
            message: 'Login successful',
            user: { username }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// Check authentication status
app.get('/api/admin/check', (req, res) => {
    if (req.session && req.session.isAdmin) {
        res.json({
            success: true,
            authenticated: true,
            user: { username: req.session.username }
        });
    } else {
        res.json({
            success: true,
            authenticated: false
        });
    }
});


// Register a new student (ADMIN ONLY)
app.post('/api/register', requireAuth, async (req, res) => {
    try {
        const { name, phoneNumber, email } = req.body;

        // Validation
        if (!name || !phoneNumber || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if email already exists
        const existingStudent = students.find(s => s.email === email);
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Register student
        const student = {
            id: students.length + 1,
            name,
            phone_number: phoneNumber,
            email,
            registered_at: new Date().toISOString()
        };

        students.push(student);
        saveStudents(students);

        // Send welcome email asynchronously
        sendWelcomeEmail(name, email).catch(err => {
            console.error('Welcome email failed:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            student: {
                id: student.id,
                name: student.name,
                email: student.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Get all students (ADMIN ONLY)
app.get('/api/students', requireAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            students: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students'
        });
    }
});

// Create a new notice and send emails
app.post('/api/notices', requireAuth, async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validation
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        // Create notice
        const notice = {
            id: notices.length + 1,
            title,
            content,
            posted_at: new Date().toISOString()
        };

        notices.push(notice);
        saveNotices(notices);

        // Send emails asynchronously
        sendNoticeToAllStudents(students, title, content)
            .then(emailResults => {
                console.log('Email results:', emailResults);
            })
            .catch(err => {
                console.error('Email sending failed:', err);
            });

        // Respond immediately
        res.status(201).json({
            success: true,
            message: 'Notice posted successfully! Emails are being sent in the background.',
            notice,
            emailResults: {
                totalStudents: students.length,
                status: 'sending'
            }
        });
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create notice'
        });
    }
});

// Get all notices
app.get('/api/notices', async (req, res) => {
    try {
        res.json({
            success: true,
            notices: notices.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at))
        });
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notices'
        });
    }
});

// Delete a notice
app.delete('/api/notices/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const index = notices.findIndex(n => n.id == id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
        }

        notices.splice(index, 1);
        saveNotices(notices);

        res.json({
            success: true,
            message: 'Notice deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notice'
        });
    }
});

// Delete a student
app.delete('/api/students/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const index = students.findIndex(s => s.id == id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        students.splice(index, 1);
        saveStudents(students);

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 Student Notice System Server Running');
    console.log('========================================');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`⚙️  Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`📊 Total Students: ${students.length}`);
    console.log(`📋 Total Notices: ${notices.length}`);
    console.log('========================================\n');
});
