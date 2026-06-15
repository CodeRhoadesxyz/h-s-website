// ADMIN PANEL JAVASCRIPT - ENHANCED
// ============================================================================

// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// State Management
let currentBirdId = null;
let currentEventId = null;
let birds = [];
let events = [];
let messages = [];
let surrenderApplications = [];
let adoptionApplications = [];
let adminUsers = [];
let currentUser = null;

// ============================================================================
// AUTHENTICATION
// ============================================================================

function checkAuthentication() {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    window.location.href = '/admin-login.html';
    return false;
  }
  
  try {
    currentUser = JSON.parse(adminToken);
    document.getElementById('currentUser').textContent = `${currentUser.username}`;
    return true;
  } catch (e) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
    return false;
  }
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin-login.html';
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuthentication()) return;
  
  initializeAdmin();
  setupEventListeners();
  loadDashboardData();
  checkTheme();
});

function initializeAdmin() {
  console.log('🦜 Admin Panel Initialized');
  
  // Load initial data
  loadBirds();
  loadEvents();
  loadMessages();
  loadSurrenderApplications();
  loadAdoptionApplications();
  loadAdminUsers();
}

function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.dataset.tab) {
        e.preventDefault();
        switchTab(link.dataset.tab);
      }
    });
  });

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Add bird button
  const addBirdBtn = document.getElementById('addBirdBtn');
  if (addBirdBtn) {
    addBirdBtn.addEventListener('click', () => {
      currentBirdId = null;
      resetBirdForm();
      document.getElementById('birdForm').style.display = 'block';
      document.getElementById('formTitle').textContent = 'Add New Bird';
    });
  }

  // Bird form submission
  const birdFormElement = document.getElementById('birdFormElement');
  if (birdFormElement) {
    birdFormElement.addEventListener('submit', handleBirdSubmit);
  }

  // Add event button
  const addEventBtn = document.getElementById('addEventBtn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      currentEventId = null;
      resetEventForm();
      document.getElementById('eventForm').style.display = 'block';
      document.getElementById('eventFormTitle').textContent = 'Create New Event';
    });
  }

  // Event form submission
  const eventFormElement = document.getElementById('eventFormElement');
  if (eventFormElement) {
    eventFormElement.addEventListener('submit', handleEventSubmit);
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// ============================================================================
// TAB SWITCHING
// ============================================================================

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Mark nav link as active
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    birds: 'Manage Adoptable Birds',
    surrender: 'Surrender Applications',
    adoptions: 'Adoption Applications',
    events: 'Manage Events',
    messages: 'Contact Messages',
    users: 'Admin Users'
  };

  document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
}

// ============================================================================
// SURRENDER APPLICATIONS
// ============================================================================

async function loadSurrenderApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/surrender-applications`);
    if (!response.ok) throw new Error('Failed to load surrender applications');
    
    surrenderApplications = await response.json();
    renderSurrenderApplications();
  } catch (error) {
    console.error('Error loading surrender applications:', error);
  }
}

function renderSurrenderApplications() {
  const container = document.getElementById('surrenderList');
  if (!container) return;

  if (surrenderApplications.length === 0) {
    container.innerHTML = '<p class="loading">No surrender applications yet</p>';
    return;
  }

  container.innerHTML = surrenderApplications.map(app => `
    <div class="item-card">
      <div class="item-header">
        <h4>${app.bird_name} - ${app.bird_species}</h4>
        <span class="status-badge status-${app.status}">${app.status}</span>
      </div>
      <div class="item-details">
        <p><strong>Owner:</strong> ${app.owner_name}</p>
        <p><strong>Email:</strong> ${app.owner_email}</p>
        <p><strong>Phone:</strong> ${app.owner_phone || 'N/A'}</p>
        <p><strong>Reason:</strong> ${app.reason_for_surrender}</p>
        <p><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleDateString()}</p>
      </div>
      <div class="item-actions">
        <button class="btn btn-small btn-primary" onclick="viewSurrenderDetail(${app.id})">View Details</button>
        <button class="btn btn-small btn-secondary" onclick="updateSurrenderStatus(${app.id}, 'approved')">Approve</button>
        <button class="btn btn-small btn-secondary" onclick="updateSurrenderStatus(${app.id}, 'rejected')">Reject</button>
      </div>
    </div>
  `).join('');
}

function viewSurrenderDetail(id) {
  const app = surrenderApplications.find(a => a.id === id);
  if (!app) return;

  const details = `
    <div class="detail-view">
      <h3>${app.bird_name} - ${app.bird_species}</h3>
      <div class="detail-grid">
        <div><strong>Owner Name:</strong> ${app.owner_name}</div>
        <div><strong>Owner Email:</strong> ${app.owner_email}</div>
        <div><strong>Owner Phone:</strong> ${app.owner_phone || 'N/A'}</div>
        <div><strong>Bird Age:</strong> ${app.bird_age || 'N/A'}</div>
        <div><strong>Bird Description:</strong> ${app.bird_description || 'N/A'}</div>
        <div><strong>Reason for Surrender:</strong> ${app.reason_for_surrender}</div>
        <div><strong>Health Status:</strong> ${app.bird_health_status || 'N/A'}</div>
        <div><strong>Behavioral Notes:</strong> ${app.behavioral_notes || 'N/A'}</div>
        <div><strong>Dietary Preferences:</strong> ${app.dietary_preferences || 'N/A'}</div>
        <div><strong>Medical History:</strong> ${app.medical_history || 'N/A'}</div>
        <div><strong>Status:</strong> ${app.status}</div>
        <div><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleString()}</div>
      </div>
    </div>
  `;

  showModal('Surrender Application Details', details);
}

async function updateSurrenderStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/surrender-applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update status');
    
    loadSurrenderApplications();
    alert(`Application ${status}!`);
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update application status');
  }
}

// ============================================================================
// ADOPTION APPLICATIONS
// ============================================================================

async function loadAdoptionApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/adoption-applications`);
    if (!response.ok) throw new Error('Failed to load adoption applications');
    
    adoptionApplications = await response.json();
    renderAdoptionApplications();
  } catch (error) {
    console.error('Error loading adoption applications:', error);
  }
}

function renderAdoptionApplications() {
  const container = document.getElementById('adoptionsList');
  if (!container) return;

  if (adoptionApplications.length === 0) {
    container.innerHTML = '<p class="loading">No adoption applications yet</p>';
    return;
  }

  container.innerHTML = adoptionApplications.map(app => `
    <div class="item-card">
      <div class="item-header">
        <h4>${app.applicant_name} - ${app.bird_name}</h4>
        <span class="status-badge status-${app.status}">${app.status}</span>
      </div>
      <div class="item-details">
        <p><strong>Email:</strong> ${app.applicant_email}</p>
        <p><strong>Phone:</strong> ${app.applicant_phone || 'N/A'}</p>
        <p><strong>Location:</strong> ${app.applicant_city}, ${app.applicant_state}</p>
        <p><strong>Experience:</strong> ${app.experience_level}</p>
        <p><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleDateString()}</p>
      </div>
      <div class="item-actions">
        <button class="btn btn-small btn-primary" onclick="viewAdoptionDetail(${app.id})">View Details</button>
        <button class="btn btn-small btn-secondary" onclick="updateAdoptionStatus(${app.id}, 'approved')">Approve</button>
        <button class="btn btn-small btn-secondary" onclick="updateAdoptionStatus(${app.id}, 'rejected')">Reject</button>
      </div>
    </div>
  `).join('');
}

function viewAdoptionDetail(id) {
  const app = adoptionApplications.find(a => a.id === id);
  if (!app) return;

  const details = `
    <div class="detail-view">
      <h3>${app.applicant_name} - ${app.bird_name}</h3>
      <div class="detail-grid">
        <div><strong>Applicant Name:</strong> ${app.applicant_name}</div>
        <div><strong>Email:</strong> ${app.applicant_email}</div>
        <div><strong>Phone:</strong> ${app.applicant_phone || 'N/A'}</div>
        <div><strong>Address:</strong> ${app.applicant_address || 'N/A'}</div>
        <div><strong>City:</strong> ${app.applicant_city || 'N/A'}</div>
        <div><strong>State:</strong> ${app.applicant_state || 'N/A'}</div>
        <div><strong>ZIP:</strong> ${app.applicant_zip || 'N/A'}</div>
        <div><strong>Household Members:</strong> ${app.household_members || 'N/A'}</div>
        <div><strong>Other Pets:</strong> ${app.other_pets || 'None'}</div>
        <div><strong>Experience Level:</strong> ${app.experience_level}</div>
        <div><strong>Living Situation:</strong> ${app.living_situation || 'N/A'}</div>
        <div><strong>Why Adopt:</strong> ${app.why_adopt}</div>
        <div><strong>Commitment Level:</strong> ${app.commitment_level || 'N/A'}</div>
        <div><strong>Status:</strong> ${app.status}</div>
        <div><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleString()}</div>
      </div>
    </div>
  `;

  showModal('Adoption Application Details', details);
}

async function updateAdoptionStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/adoption-applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update status');
    
    loadAdoptionApplications();
    alert(`Application ${status}!`);
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update application status');
  }
}

// ============================================================================
// ADMIN USERS MANAGEMENT
// ============================================================================

async function loadAdminUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    if (!response.ok) throw new Error('Failed to load admin users');
    
    adminUsers = await response.json();
    renderAdminUsers();
  } catch (error) {
    console.error('Error loading admin users:', error);
  }
}

function renderAdminUsers() {
  const container = document.getElementById('usersList');
  if (!container) return;

  if (adminUsers.length === 0) {
    container.innerHTML = '<p class="loading">No admin users</p>';
    return;
  }

  container.innerHTML = `
    <div class="section-header">
      <h3>Admin Users</h3>
      <button class="btn btn-primary" onclick="showCreateUserForm()">+ Create User</button>
    </div>
    <div class="items-list">
      ${adminUsers.map(user => `
        <div class="item-card">
          <div class="item-header">
            <h4>${user.username}</h4>
          </div>
          <div class="item-details">
            <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
            <p><strong>Created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function showCreateUserForm() {
  const form = `
    <div class="form-container">
      <h4>Create New Admin User</h4>
      <form id="createUserForm">
        <div class="form-group">
          <label for="newUsername">Username *</label>
          <input type="text" id="newUsername" required>
        </div>
        <div class="form-group">
          <label for="newPassword">Password *</label>
          <input type="password" id="newPassword" required>
        </div>
        <div class="form-group">
          <label for="newEmail">Email</label>
          <input type="email" id="newEmail">
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create User</button>
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  showModal('Create Admin User', form);

  document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);
}

async function handleCreateUser(e) {
  e.preventDefault();

  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const email = document.getElementById('newEmail').value;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email: email || null })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    alert('User created successfully!');
    closeModal();
    loadAdminUsers();
  } catch (error) {
    console.error('Error creating user:', error);
    alert(`Failed to create user: ${error.message}`);
  }
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function showModal(title, content) {
  const modal = document.getElementById('messageModal') || createModal();
  const modalHeader = modal.querySelector('.modal-header h3');
  const modalBody = modal.querySelector('.modal-body');
  
  modalHeader.textContent = title;
  modalBody.innerHTML = content;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('messageModal');
  if (modal) modal.style.display = 'none';
}

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'messageModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3></h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// ============================================================================
// THEME TOGGLE
// ============================================================================

function toggleTheme() {
  const html = document.documentElement;
  const isDark = !html.hasAttribute('data-theme');
  
  if (isDark) {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('adminTheme', 'light');
  } else {
    html.removeAttribute('data-theme');
    localStorage.setItem('adminTheme', 'dark');
  }
}

function checkTheme() {
  const savedTheme = localStorage.getItem('adminTheme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// Export functions for inline onclick handlers
window.viewSurrenderDetail = viewSurrenderDetail;
window.updateSurrenderStatus = updateSurrenderStatus;
window.viewAdoptionDetail = viewAdoptionDetail;
window.updateAdoptionStatus = updateAdoptionStatus;
window.showCreateUserForm = showCreateUserForm;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.logout = logout;
