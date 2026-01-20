// API Base URL
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginAlertContainer = document.getElementById('loginAlertContainer');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');

// Show alert message
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    loginAlertContainer.innerHTML = '';
    loginAlertContainer.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'fadeInUp 0.5s ease reverse';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Make togglePassword available globally
window.togglePassword = togglePassword;

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(loginForm);
    const credentials = {
        username: formData.get('username').trim(),
        password: formData.get('password')
    };

    // Validate
    if (!credentials.username || !credentials.password) {
        showAlert('Please enter both username and password', 'error');
        return;
    }

    // Disable button and show loading
    loginBtn.disabled = true;
    loginBtnText.innerHTML = '<span class="spinner"></span> Logging in...';

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
            credentials: 'include' // Important for cookies/sessions
        });

        const result = await response.json();

        if (result.success) {
            showAlert('✅ Login successful! Redirecting...', 'success');

            // Redirect to admin panel after short delay
            setTimeout(() => {
                window.location.href = '/admin.html';
            }, 1000);
        } else {
            showAlert(result.message || 'Invalid username or password', 'error');
            loginBtn.disabled = false;
            loginBtnText.textContent = '🚀 Login to Admin Panel';
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please try again.', 'error');
        loginBtn.disabled = false;
        loginBtnText.textContent = '🚀 Login to Admin Panel';
    }
});

// Create particle animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
});
