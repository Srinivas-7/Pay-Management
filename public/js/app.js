/**
 * Global Frontend Helper & Authentication Guard
 */

const API_BASE = '/api';

// Run on initial load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // 1. Check user session
  const session = await checkSession();
  
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('login.html');

  if (isLoginPage) {
    if (session.loggedIn) {
      window.location.href = 'index.html';
      return;
    }
  } else {
    if (!session.loggedIn) {
      window.location.href = 'login.html';
      return;
    }
  }

  // 2. Inject Header and Footer if placeholders exist
  renderHeader(session.loggedIn, session.user);
  renderFooter();
}

/**
 * Check if user is authenticated
 */
async function checkSession() {
  try {
    const response = await fetch(`${API_BASE}/auth/session`);
    if (!response.ok) return { loggedIn: false };
    return await response.json();
  } catch (error) {
    console.error('Session check error:', error);
    return { loggedIn: false };
  }
}

/**
 * Render Common Header
 */
function renderHeader(loggedIn, user) {
  const headerEl = document.getElementById('app-header');
  if (!headerEl) return;

  let navItems = '';
  if (loggedIn) {
    // Check if user has custom profile picture saved in browser localStorage
    const savedPic = localStorage.getItem(`profile_pic_${user.username}`);
    const profileIcon = savedPic 
      ? `<img src="${savedPic}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--accent-primary);" alt="Avatar">`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
         </svg>`;

    navItems = `
      <li>
        <a href="past_record.html" title="Past Records" style="display: flex; align-items: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </a>
      </li>
      <li>
        <a href="profile.html" title="Profile" style="display: flex; align-items: center;">
          ${profileIcon}
        </a>
      </li>
      <li>
        <a href="settings.html" title="Settings" style="display: flex; align-items: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </a>
      </li>
      <li>
        <a href="#" id="logout-btn" class="btn-logout" title="Logout" style="display: flex; align-items: center; padding: 0.4rem 0.6rem !important;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </a>
      </li>
    `;
  } else {
    navItems = `
      <li>
        <a href="login.html" title="Login" style="display: flex; align-items: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </a>
      </li>
    `;
  }

  headerEl.innerHTML = `
    <div class="navbar">
      <a href="index.html" class="brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        Payroll
      </a>
      <ul class="nav-links">
        ${navItems}
      </ul>
    </div>
  `;

  // Attach logout handler if button exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleLogout();
    });
  }
}

/**
 * Render Common Footer
 */
function renderFooter() {
  const footerEl = document.getElementById('app-footer');
  if (!footerEl) return;

  const currentYear = new Date().getFullYear();
  footerEl.innerHTML = `
    <div class="container">
      <p>&copy; ${currentYear} Payroll Management System. All Rights Reserved.</p>
    </div>
  `;
}

/**
 * Handle user logout
 */
async function handleLogout() {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      alert('Failed to log out.');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Utility helper to extract query parameters
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Utility helper to show notification/alert
 */
function showAlert(containerId, message, type = 'danger') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'success' 
          ? '<polyline points="20 6 9 17 4 12"></polyline>' 
          : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;
}
