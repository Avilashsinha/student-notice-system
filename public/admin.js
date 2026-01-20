// API Base URL - works in both development and production
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

// Check authentication on page load
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/admin/check`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.authenticated) {
            // Redirect to login page
            window.location.href = '/login.html';
            return false;
        }

        // Update username display if available
        if (data.user && data.user.username) {
            const usernameEl = document.getElementById('adminUsername');
            if (usernameEl) {
                usernameEl.textContent = `👤 ${data.user.username}`;
            }
        }

        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login.html';
        return false;
    }
}

// Logout function
async function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
    }
}

// Make logout available globally
window.logout = logout;

// DOM Elements
const noticeForm = document.getElementById('noticeForm');
const alertContainer = document.getElementById('alertContainer');
const noticeContainer = document.getElementById('noticeContainer');
const studentsContainer = document.getElementById('studentsContainer');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const totalStudentsEl = document.getElementById('totalStudents');
const totalNoticesEl = document.getElementById('totalNotices');

// Student Registration Form Elements
const studentRegistrationForm = document.getElementById('studentRegistrationForm');
const regAlertContainer = document.getElementById('regAlertContainer');
const regSubmitBtn = document.getElementById('regSubmitBtn');
const regBtnText = document.getElementById('regBtnText');


// Show alert message
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'fadeInUp 0.5s ease reverse';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

// Show registration alert message
function showRegAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    regAlertContainer.innerHTML = '';
    regAlertContainer.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'fadeInUp 0.5s ease reverse';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}


// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load notices
async function loadNotices() {
    try {
        const response = await fetch(`${API_URL}/notices`, { credentials: 'include' });
        const data = await response.json();

        if (data.success) {
            totalNoticesEl.textContent = data.notices.length;

            if (data.notices.length > 0) {
                displayNotices(data.notices);
            } else {
                noticeContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No notices posted yet.</p>
          </div>
        `;
            }
        }
    } catch (error) {
        console.error('Error loading notices:', error);
        noticeContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Failed to load notices.</p>
      </div>
    `;
    }
}

// Display notices with delete button
function displayNotices(notices) {
    noticeContainer.innerHTML = notices.map(notice => `
    <div class="notice-item" data-notice-id="${notice.id}">
      <div class="notice-header">
        <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
        <span class="notice-date">${formatDate(notice.posted_at)}</span>
      </div>
      <div class="notice-content">${escapeHtml(notice.content)}</div>
      <div class="notice-actions">
        <button class="btn btn-danger" onclick="deleteNotice(${notice.id})">
          Delete Notice
        </button>
      </div>
    </div>
  `).join('');
}

// Delete notice
async function deleteNotice(noticeId) {
    if (!confirm('Are you sure you want to delete this notice?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/notices/${noticeId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Notice deleted successfully', 'success');
            loadNotices();
        } else {
            showAlert(result.message || 'Failed to delete notice', 'error');
        }
    } catch (error) {
        console.error('Error deleting notice:', error);
        showAlert('Network error. Please try again.', 'error');
    }
}

// Load students
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`, { credentials: 'include' });
        const data = await response.json();

        if (data.success) {
            totalStudentsEl.textContent = data.students.length;

            if (data.students.length > 0) {
                displayStudents(data.students);
            } else {
                studentsContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">👤</div>
            <p>No students registered yet.</p>
          </div>
        `;
            }
        }
    } catch (error) {
        console.error('Error loading students:', error);
        studentsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Failed to load students.</p>
      </div>
    `;
    }
}

// Display students
function displayStudents(students) {
    studentsContainer.innerHTML = students.map(student => `
    <div class="notice-item" data-student-id="${student.id}">
      <div class="notice-header">
        <h3 class="notice-title">${escapeHtml(student.name)}</h3>
        <span class="notice-date">${formatDate(student.registered_at)}</span>
      </div>
      <div class="notice-content">
        <strong>Email:</strong> ${escapeHtml(student.email)}<br>
        <strong>Phone:</strong> ${escapeHtml(student.phone_number)}
      </div>
      <div class="notice-actions">
        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">
          Delete Student
        </button>
      </div>
    </div>
  `).join('');
}

// Handle student registration form submission
studentRegistrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(studentRegistrationForm);
    const data = {
        name: formData.get('name').trim(),
        phoneNumber: formData.get('phoneNumber').trim(),
        email: formData.get('email').trim()
    };

    // Validate
    if (!data.name || !data.phoneNumber || !data.email) {
        showRegAlert('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showRegAlert('Please enter a valid email address', 'error');
        return;
    }

    // Disable button and show loading
    regSubmitBtn.disabled = true;
    regBtnText.innerHTML = '<span class="spinner"></span> Registering...';

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        const result = await response.json();

        if (result.success) {
            showRegAlert('✅ Student registered successfully! Welcome email sent.', 'success');
            studentRegistrationForm.reset();
            loadStudents(); // Refresh the students list
        } else {
            showRegAlert(result.message || 'Failed to register student', 'error');
        }
    } catch (error) {
        console.error('Error registering student:', error);
        showRegAlert('Network error. Please try again.', 'error');
    } finally {
        // Re-enable button
        regSubmitBtn.disabled = false;
        regBtnText.textContent = 'Register Student';
    }
});

// Handle notice form submission

noticeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(noticeForm);
    const data = {
        title: formData.get('title').trim(),
        content: formData.get('content').trim()
    };

    // Validate
    if (!data.title || !data.content) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.innerHTML = '<span class="spinner"></span> Posting & Sending Emails...';

    try {
        const response = await fetch(`${API_URL}/notices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        const result = await response.json();

        if (result.success) {
            const emailInfo = result.emailResults;
            let message = `✅ Notice posted successfully!`;

            if (emailInfo.sent > 0) {
                message += ` Emails sent to ${emailInfo.sent} student(s).`;
            } else if (emailInfo.logged > 0) {
                message += ` Email notifications logged (${emailInfo.logged} student(s)).`;
            }

            if (emailInfo.failed > 0) {
                message += ` ${emailInfo.failed} email(s) failed.`;
            }

            showAlert(message, 'success');
            noticeForm.reset();
            loadNotices();
        } else {
            showAlert(result.message || 'Failed to post notice', 'error');
        }
    } catch (error) {
        console.error('Error posting notice:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        btnText.textContent = 'Post Notice & Send Emails';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first
    const isAuthenticated = await checkAuth();

    if (isAuthenticated) {
        loadNotices();
        loadStudents();

        // Auto-refresh every 30 seconds
        setInterval(() => {
            loadNotices();
            loadStudents();
        }, 30000);
    }
});


// Delete student
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Student deleted successfully', 'success');
            loadStudents();
        } else {
            showAlert(result.message || 'Failed to delete student', 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showAlert('Network error. Please try again.', 'error');
    }
}

// CSV Upload Functionality

const uploadAlertContainer = document.getElementById('uploadAlertContainer');

function showUploadAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    uploadAlertContainer.innerHTML = '';
    uploadAlertContainer.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'fadeInUp 0.5s ease reverse';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

// Parse CSV file
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const students = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim());
        const student = {};

        headers.forEach((header, index) => {
            student[header] = values[index];
        });

        students.push(student);
    }

    return students;
}

// Upload CSV
async function uploadCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const uploadBtn = document.getElementById('uploadCsvBtn');
    const uploadBtnText = document.getElementById('uploadBtnText');

    if (!fileInput.files || fileInput.files.length === 0) {
        showUploadAlert('Please select a CSV file', 'error');
        return;
    }

    const file = fileInput.files[0];

    if (!file.name.endsWith('.csv')) {
        showUploadAlert('Please upload a CSV file', 'error');
        return;
    }

    uploadBtn.disabled = true;
    uploadBtnText.innerHTML = '<span class="spinner"></span> Processing...';

    try {
        const text = await file.text();
        const students = parseCSV(text);

        if (students.length === 0) {
            showUploadAlert('No valid student records found in CSV', 'error');
            uploadBtn.disabled = false;
            uploadBtnText.textContent = '📤 Upload CSV';
            return;
        }

        // Validate CSV headers
        const requiredFields = ['name', 'phoneNumber', 'email'];
        const firstStudent = students[0];
        const missingFields = requiredFields.filter(field => !firstStudent.hasOwnProperty(field));

        if (missingFields.length > 0) {
            showUploadAlert(`CSV is missing required columns: ${missingFields.join(', ')}`, 'error');
            uploadBtn.disabled = false;
            uploadBtnText.textContent = '📤 Upload CSV';
            return;
        }

        // Register each student
        let successCount = 0;
        let failedCount = 0;
        const errors = [];

        for (const student of students) {
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(student),
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.success) {
                    successCount++;
                } else {
                    failedCount++;
                    errors.push(`${student.name}: ${result.message}`);
                }
            } catch (error) {
                failedCount++;
                errors.push(`${student.name}: Network error`);
            }
        }

        // Show results
        let message = `✅ Successfully registered ${successCount} student(s).`;
        if (failedCount > 0) {
            message += ` ${failedCount} failed.`;
            if (errors.length > 0 && errors.length <= 3) {
                message += ` Errors: ${errors.join(', ')}`;
            }
        }

        showUploadAlert(message, failedCount === 0 ? 'success' : 'warning');

        // Clear file input
        fileInput.value = '';

        // Refresh students list
        loadStudents();

    } catch (error) {
        console.error('Error uploading CSV:', error);
        showUploadAlert('Failed to process CSV file', 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtnText.textContent = '📤 Upload CSV';
    }
}

// Make all functions available globally
window.deleteNotice = deleteNotice;
window.deleteStudent = deleteStudent;
window.uploadCSV = uploadCSV;
