// Particle animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Fetch and display notices
async function loadNotices() {
    const noticeContainer = document.getElementById('noticeContainer');
    const noticeBadge = document.getElementById('noticeBadge');

    try {
        const response = await fetch('/api/notices');
        const data = await response.json();

        if (data.success && data.notices.length > 0) {
            noticeBadge.textContent = `${data.notices.length} Notice${data.notices.length !== 1 ? 's' : ''}`;

            noticeContainer.innerHTML = data.notices.map(notice => `
        <div class="notice-item">
          <div class="notice-header">
            <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
            <span class="notice-date">${formatDate(notice.posted_at)}</span>
          </div>
          <p class="notice-content">${escapeHtml(notice.content)}</p>
        </div>
      `).join('');
        } else {
            noticeContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No notices available yet</p>
          <p class="empty-state-subtitle">Check back later for updates</p>
        </div>
      `;
            noticeBadge.textContent = '0 Notices';
        }
    } catch (error) {
        console.error('Error loading notices:', error);
        noticeContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Failed to load notices</p>
        <p class="empty-state-subtitle">Please try again later</p>
      </div>
    `;
    }
}

// Fetch and display stats
async function loadStats() {
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalNoticesEl = document.getElementById('totalNotices');

    try {
        const [studentsRes, noticesRes] = await Promise.all([
            fetch('/api/students'),
            fetch('/api/notices')
        ]);

        const studentsData = await studentsRes.json();
        const noticesData = await noticesRes.json();

        if (totalStudentsEl && studentsData.success) {
            animateNumber(totalStudentsEl, studentsData.students.length);
        }

        if (totalNoticesEl && noticesData.success) {
            animateNumber(totalNoticesEl, noticesData.notices.length);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Animate number counting
function animateNumber(element, target) {
    const duration = 1000;
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
        }
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadNotices();
    loadStats();

    // Refresh notices every 30 seconds
    setInterval(loadNotices, 30000);
    setInterval(loadStats, 30000);
});
