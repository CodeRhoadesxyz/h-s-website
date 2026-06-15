// ============================================================================
// ADMIN PANEL JAVASCRIPT
// ============================================================================

// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// State Management
let currentBirdId = null;
let currentEventId = null;
let birds = [];
let events = [];
let messages = [];

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
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

  // Add bird button
  document.getElementById('addBirdBtn').addEventListener('click', () => {
    currentBirdId = null;
    resetBirdForm();
    document.getElementById('birdForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add New Bird';
  });

  // Bird form submission
  document.getElementById('birdFormElement').addEventListener('submit', handleBirdSubmit);

  // Add event button
  document.getElementById('addEventBtn').addEventListener('click', () => {
    currentEventId = null;
    resetEventForm();
    document.getElementById('eventForm').style.display = 'block';
    document.getElementById('eventFormTitle').textContent = 'Create New Event';
  });

  // Event form submission
  document.getElementById('eventFormElement').addEventListener('submit', handleEventSubmit);

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
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
    events: 'Manage Events',
    messages: 'Contact Messages'
  };
  document.getElementById('page-title').textContent = titles[tabName] || 'Admin';

  // Refresh data when switching tabs
  if (tabName === 'birds') loadBirds();
  if (tabName === 'events') loadEvents();
  if (tabName === 'messages') loadMessages();
}

// ============================================================================
// DASHBOARD
// ============================================================================

async function loadDashboardData() {
  try {
    // Check API status
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      document.getElementById('api-status').textContent = '✅ Online';
    }

    // Load counts
    const birdsResponse = await fetch(`${API_BASE_URL}/birds`);
    const birdsData = await birdsResponse.json();
    document.getElementById('bird-count').textContent = birdsData.length;

    const eventsResponse = await fetch(`${API_BASE_URL}/events`);
    const eventsData = await eventsResponse.json();
    document.getElementById('event-count').textContent = eventsData.length;

    const messagesResponse = await fetch(`${API_BASE_URL}/contact-messages`);
    const messagesData = await messagesResponse.json();
    document.getElementById('message-count').textContent = messagesData.length;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    document.getElementById('api-status').textContent = '❌ Offline';
  }
}

// ============================================================================
// BIRDS MANAGEMENT
// ============================================================================

async function loadBirds() {
  try {
    const response = await fetch(`${API_BASE_URL}/birds`);
    birds = await response.json();
    renderBirds();
  } catch (error) {
    console.error('Error loading birds:', error);
    document.getElementById('birdsList').innerHTML = '<p class="error">Failed to load birds</p>';
  }
}

function renderBirds() {
  const birdsList = document.getElementById('birdsList');

  if (birds.length === 0) {
    birdsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🦜</div>
        <p>No birds yet. Add your first adoptable bird!</p>
      </div>
    `;
    return;
  }

  birdsList.innerHTML = birds.map(bird => `
    <div class="item-card">
      <div class="item-header">
        <div>
          <h4 class="item-title">${bird.name}</h4>
          <span class="item-status status-${bird.status}">${bird.status}</span>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary btn-small" onclick="editBird(${bird.id})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteBird(${bird.id})">Delete</button>
        </div>
      </div>
      <div class="item-meta">
        <span>🦜 ${bird.species}</span>
        ${bird.age ? `<span>📅 ${bird.age}</span>` : ''}
      </div>
      ${bird.description ? `<div class="item-description">${bird.description}</div>` : ''}
      ${bird.image_url ? `<img src="${bird.image_url}" alt="${bird.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 1rem;">` : ''}
    </div>
  `).join('');
}

function editBird(id) {
  const bird = birds.find(b => b.id === id);
  if (!bird) return;

  currentBirdId = id;
  document.getElementById('birdName').value = bird.name;
  document.getElementById('birdSpecies').value = bird.species;
  document.getElementById('birdAge').value = bird.age || '';
  document.getElementById('birdDescription').value = bird.description || '';
  document.getElementById('birdImageUrl').value = bird.image_url || '';
  document.getElementById('birdStatus').value = bird.status;

  document.getElementById('formTitle').textContent = 'Edit Bird';
  document.getElementById('birdForm').style.display = 'block';
  document.getElementById('birdForm').scrollIntoView({ behavior: 'smooth' });
}

async function handleBirdSubmit(e) {
  e.preventDefault();

  const birdData = {
    name: document.getElementById('birdName').value,
    species: document.getElementById('birdSpecies').value,
    age: document.getElementById('birdAge').value,
    description: document.getElementById('birdDescription').value,
    image_url: document.getElementById('birdImageUrl').value,
    status: document.getElementById('birdStatus').value
  };

  try {
    const method = currentBirdId ? 'PUT' : 'POST';
    const url = currentBirdId ? `${API_BASE_URL}/birds/${currentBirdId}` : `${API_BASE_URL}/birds`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birdData)
    });

    if (response.ok) {
      alert(currentBirdId ? 'Bird updated successfully!' : 'Bird added successfully!');
      cancelBirdForm();
      loadBirds();
      loadDashboardData();
    } else {
      alert('Error saving bird');
    }
  } catch (error) {
    console.error('Error saving bird:', error);
    alert('Error saving bird');
  }
}

async function deleteBird(id) {
  if (!confirm('Are you sure you want to delete this bird?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/birds/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Bird deleted successfully!');
      loadBirds();
      loadDashboardData();
    }
  } catch (error) {
    console.error('Error deleting bird:', error);
    alert('Error deleting bird');
  }
}

function resetBirdForm() {
  document.getElementById('birdFormElement').reset();
  currentBirdId = null;
}

function cancelBirdForm() {
  document.getElementById('birdForm').style.display = 'none';
  resetBirdForm();
}

// ============================================================================
// EVENTS MANAGEMENT
// ============================================================================

async function loadEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    events = await response.json();
    renderEvents();
  } catch (error) {
    console.error('Error loading events:', error);
    document.getElementById('eventsList').innerHTML = '<p class="error">Failed to load events</p>';
  }
}

function renderEvents() {
  const eventsList = document.getElementById('eventsList');

  if (events.length === 0) {
    eventsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <p>No events yet. Create your first event!</p>
      </div>
    `;
    return;
  }

  eventsList.innerHTML = events.map(event => `
    <div class="item-card">
      <div class="item-header">
        <h4 class="item-title">${event.title}</h4>
        <div class="item-actions">
          <button class="btn btn-primary btn-small" onclick="editEvent(${event.id})">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteEvent(${event.id})">Delete</button>
        </div>
      </div>
      <div class="item-meta">
        <span>📅 ${new Date(event.event_date).toLocaleString()}</span>
        ${event.location ? `<span>📍 ${event.location}</span>` : ''}
      </div>
      ${event.description ? `<div class="item-description">${event.description}</div>` : ''}
    </div>
  `).join('');
}

function editEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;

  currentEventId = id;
  document.getElementById('eventTitle').value = event.title;
  document.getElementById('eventDescription').value = event.description || '';
  document.getElementById('eventLocation').value = event.location || '';
  
  // Format date for datetime-local input
  const date = new Date(event.event_date);
  const dateString = date.toISOString().slice(0, 16);
  document.getElementById('eventDate').value = dateString;

  document.getElementById('eventFormTitle').textContent = 'Edit Event';
  document.getElementById('eventForm').style.display = 'block';
  document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth' });
}

async function handleEventSubmit(e) {
  e.preventDefault();

  const eventData = {
    title: document.getElementById('eventTitle').value,
    description: document.getElementById('eventDescription').value,
    event_date: new Date(document.getElementById('eventDate').value).toISOString(),
    location: document.getElementById('eventLocation').value
  };

  try {
    const method = currentEventId ? 'PUT' : 'POST';
    const url = currentEventId ? `${API_BASE_URL}/events/${currentEventId}` : `${API_BASE_URL}/events`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (response.ok) {
      alert(currentEventId ? 'Event updated successfully!' : 'Event created successfully!');
      cancelEventForm();
      loadEvents();
      loadDashboardData();
    } else {
      alert('Error saving event');
    }
  } catch (error) {
    console.error('Error saving event:', error);
    alert('Error saving event');
  }
}

async function deleteEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Event deleted successfully!');
      loadEvents();
      loadDashboardData();
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Error deleting event');
  }
}

function resetEventForm() {
  document.getElementById('eventFormElement').reset();
  currentEventId = null;
}

function cancelEventForm() {
  document.getElementById('eventForm').style.display = 'none';
  resetEventForm();
}

// ============================================================================
// MESSAGES MANAGEMENT
// ============================================================================

async function loadMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/contact-messages`);
    messages = await response.json();
    renderMessages();
  } catch (error) {
    console.error('Error loading messages:', error);
    document.getElementById('messagesList').innerHTML = '<p class="error">Failed to load messages</p>';
  }
}

function renderMessages() {
  const messagesList = document.getElementById('messagesList');

  if (messages.length === 0) {
    messagesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💬</div>
        <p>No messages yet</p>
      </div>
    `;
    return;
  }

  messagesList.innerHTML = messages.map(msg => `
    <div class="item-card">
      <div class="item-header">
        <div>
          <h4 class="item-title">${msg.name}</h4>
          <p style="font-size: 0.875rem; color: var(--foreground); opacity: 0.7;">${msg.subject}</p>
        </div>
      </div>
      <div class="item-meta">
        <span>📧 ${msg.email}</span>
        ${msg.phone ? `<span>📞 ${msg.phone}</span>` : ''}
        <span>📅 ${new Date(msg.created_at).toLocaleString()}</span>
      </div>
      <div class="item-actions">
        <button class="btn btn-primary btn-small" onclick="viewMessage(${msg.id})">View Full</button>
      </div>
    </div>
  `).join('');
}

function viewMessage(id) {
  const message = messages.find(m => m.id === id);
  if (!message) return;

  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div>
      <p><strong>From:</strong> ${message.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${message.email}">${message.email}</a></p>
      ${message.phone ? `<p><strong>Phone:</strong> <a href="tel:${message.phone}">${message.phone}</a></p>` : ''}
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Date:</strong> ${new Date(message.created_at).toLocaleString()}</p>
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);">
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; line-height: 1.8;">${message.message}</p>
    </div>
  `;

  document.getElementById('messageModal').style.display = 'flex';
}

function closeMessageModal() {
  document.getElementById('messageModal').style.display = 'none';
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function checkTheme() {
  const savedTheme = localStorage.getItem('adminTheme') || 'dark';
  applyTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeToggle').textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('themeToggle').textContent = '🌙';
  }
  localStorage.setItem('adminTheme', theme);
}

// ============================================================================
// UTILITIES
// ============================================================================

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('messageModal');
  if (e.target === modal) {
    closeMessageModal();
  }
});

console.log('🦜 Admin Panel Ready!');
