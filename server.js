const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { dbOperations } = require('./database');
const { sendNoticeToAllStudents, sendWelcomeEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Register a new student
app.post('/api/register', async (req, res) => {
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
        const existingStudent = await dbOperations.getStudentByEmail(email);
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Register student
        const student = await dbOperations.registerStudent(name, phoneNumber, email);

        // Send welcome email asynchronously (don't wait for it)
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

// Get all students (for admin)
app.get('/api/students', async (req, res) => {
    try {
        const students = await dbOperations.getAllStudents();
        res.json({
            success: true,
            students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students'
        });
    }
});

// Create a new notice
app.post('/api/notices', async (req, res) => {
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
        const notice = await dbOperations.createNotice(title, content);

        // Get all students
        const students = await dbOperations.getAllStudents();

        // Send emails asynchronously (don't wait for them)
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
        const notices = await dbOperations.getAllNotices();
        res.json({
            success: true,
            notices
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
app.delete('/api/notices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbOperations.deleteNotice(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
        }

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
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbOperations.deleteStudent(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

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
    console.log(`👥 Student Portal: http://localhost:${PORT}`);
    console.log(`⚙️  Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log('========================================\n');
});
