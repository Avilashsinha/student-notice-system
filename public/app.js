// API Base URL - works in both development and production
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const alertContainer = document.getElementById('alertContainer');
const noticeContainer = document.getElementById('noticeContainer');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const noticeBadge = document.getElementById('noticeBadge');
const totalStudentsEl = document.getElementById('totalStudents');
const totalNoticesEl = document.getElementById('totalNotices');

// Particle System
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        particlesContainer.appendChild(particle);
    }
}

// Animate counter
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Load stats
async function loadStats() {
    try {
        const [studentsRes, noticesRes] = await Promise.all([
            fetch(`${API_URL}/students`),
            fetch(`${API_URL}/notices`)
        ]);

        const studentsData = await studentsRes.json();
        const noticesData = await noticesRes.json();

        if (studentsData.success && totalStudentsEl) {
            animateCounter(totalStudentsEl, studentsData.students.length);
        }

        if (noticesData.success && totalNoticesEl) {
            animateCounter(totalNoticesEl, noticesData.notices.length);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

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

// Load notices
async function loadNotices() {
    try {
        const response = await fetch(`${API_URL}/notices`);
        const data = await response.json();

        if (data.success && data.notices.length > 0) {
            displayNotices(data.notices);

            // Update notice badge
            if (noticeBadge) {
                noticeBadge.textContent = `${data.notices.length} Notice${data.notices.length !== 1 ? 's' : ''}`;
            }
        } else {
            noticeContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No notices posted yet. Check back later!</p>
        </div>
      `;

            if (noticeBadge) {
                noticeBadge.textContent = '0 Notices';
            }
        }
    } catch (error) {
        console.error('Error loading notices:', error);
        noticeContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Failed to load notices. Please refresh the page.</p>
      </div>
    `;
    }
}

// Display notices
function displayNotices(notices) {
    noticeContainer.innerHTML = notices.map(notice => `
    <div class="notice-item">
      <div class="notice-header">
        <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
        <span class="notice-date">${formatDate(notice.posted_at)}</span>
      </div>
      <div class="notice-content">${escapeHtml(notice.content)}</div>
    </div>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle form submission
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(registrationForm);
    const data = {
        name: formData.get('name').trim(),
        phoneNumber: formData.get('phoneNumber').trim(),
        email: formData.get('email').trim()
    };

    // Validate
    if (!data.name || !data.phoneNumber || !data.email) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.innerHTML = '<span class="spinner"></span> Registering...';

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('✅ Registration successful! You will now receive notices via email.', 'success');
            registrationForm.reset();

            // Reload stats
            loadStats();

            // Scroll to notices
            setTimeout(() => {
                document.querySelector('.notice-board').scrollIntoView({
                    behavior: 'smooth'
                });
            }, 1000);
        } else {
            showAlert(result.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        btnText.textContent = 'Register Now';
    }
});

// Auto-refresh notices every 30 seconds
function startNoticeRefresh() {
    setInterval(() => {
        loadNotices();
        loadStats();
    }, 30000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadNotices();
    loadStats();
    startNoticeRefresh();
});

