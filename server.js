const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// ADOPTABLE BIRDS ENDPOINTS
// ============================================================================

// Get all adoptable birds
app.get('/api/birds', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM birds ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch birds' });
  }
});

// Get single bird by ID
app.get('/api/birds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM birds WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bird not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bird' });
  }
});

// Create new bird (admin only)
app.post('/api/birds', async (req, res) => {
  try {
    const { name, species, age, description, image_url, status } = req.body;
    
    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required' });
    }

    const result = await pool.query(
      'INSERT INTO birds (name, species, age, description, image_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, species, age || null, description || '', image_url || '', status || 'available']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create bird' });
  }
});

// Update bird (admin only)
app.put('/api/birds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, species, age, description, image_url, status } = req.body;

    const result = await pool.query(
      'UPDATE birds SET name = $1, species = $2, age = $3, description = $4, image_url = $5, status = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, species, age, description, image_url, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bird not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update bird' });
  }
});

// Delete bird (admin only)
app.delete('/api/birds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM birds WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bird not found' });
    }

    res.json({ message: 'Bird deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete bird' });
  }
});

// ============================================================================
// CONTACT FORM ENDPOINT
// ============================================================================

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone || '', subject || 'General Inquiry', message]
    );

    res.status(201).json({ message: 'Message received! We will get back to you soon.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get contact messages (admin only)
app.get('/api/contact-messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ============================================================================
// EVENTS ENDPOINT
// ============================================================================

app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE event_date >= NOW() ORDER BY event_date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, event_date, location } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const result = await pool.query(
      'INSERT INTO events (title, description, event_date, location) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || '', event_date, location || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// ============================================================================
// SURRENDER APPLICATIONS ENDPOINTS
// ============================================================================

// Get all surrender applications (admin only)
app.get('/api/surrender-applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surrender_applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch surrender applications' });
  }
});

// Get single surrender application by ID
app.get('/api/surrender-applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM surrender_applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Create new surrender application
app.post('/api/surrender-applications', async (req, res) => {
  try {
    const { owner_name, owner_email, owner_phone, bird_name, bird_species, bird_age, bird_description, reason_for_surrender, bird_health_status, behavioral_notes, dietary_preferences, medical_history } = req.body;
    
    if (!owner_name || !owner_email || !bird_name || !bird_species || !reason_for_surrender) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(
      'INSERT INTO surrender_applications (owner_name, owner_email, owner_phone, bird_name, bird_species, bird_age, bird_description, reason_for_surrender, bird_health_status, behavioral_notes, dietary_preferences, medical_history) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [owner_name, owner_email, owner_phone || '', bird_name, bird_species, bird_age || '', bird_description || '', reason_for_surrender, bird_health_status || '', behavioral_notes || '', dietary_preferences || '', medical_history || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create surrender application' });
  }
});

// Update surrender application status (admin only)
app.put('/api/surrender-applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE surrender_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// ============================================================================
// ADOPTION APPLICATIONS ENDPOINTS
// ============================================================================

// Get all adoption applications (admin only)
app.get('/api/adoption-applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM adoption_applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch adoption applications' });
  }
});

// Get single adoption application by ID
app.get('/api/adoption-applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM adoption_applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Create new adoption application
app.post('/api/adoption-applications', async (req, res) => {
  try {
    const { applicant_name, applicant_email, applicant_phone, applicant_address, applicant_city, applicant_state, applicant_zip, bird_id, bird_name, household_members, other_pets, experience_level, living_situation, why_adopt, commitment_level } = req.body;
    
    if (!applicant_name || !applicant_email || !bird_name || !experience_level) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(
      'INSERT INTO adoption_applications (applicant_name, applicant_email, applicant_phone, applicant_address, applicant_city, applicant_state, applicant_zip, bird_id, bird_name, household_members, other_pets, experience_level, living_situation, why_adopt, commitment_level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [applicant_name, applicant_email, applicant_phone || '', applicant_address || '', applicant_city || '', applicant_state || '', applicant_zip || '', bird_id || null, bird_name, household_members || 0, other_pets || '', experience_level, living_situation || '', why_adopt || '', commitment_level || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create adoption application' });
  }
});

// Update adoption application status (admin only)
app.put('/api/adoption-applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE adoption_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// ============================================================================
// PETFINDER API INTEGRATION
// ============================================================================

const axios = require('axios');

const PETFINDER_API_KEY = process.env.PETFINDER_API_KEY;
const PETFINDER_API_SECRET = process.env.PETFINDER_API_SECRET;
let petfinderAccessToken = null;
let petfinderTokenExpiry = null;

// Get Petfinder Access Token
async function getPetfinderAccessToken() {
  if (petfinderAccessToken && petfinderTokenExpiry && new Date() < petfinderTokenExpiry) {
    return petfinderAccessToken;
  }

  try {
    const response = await axios.post('https://api.petfinder.com/v2/oauth2/token', {
      grant_type: 'client_credentials',
      client_id: PETFINDER_API_KEY,
      client_secret: PETFINDER_API_SECRET
    });

    petfinderAccessToken = response.data.access_token;
    petfinderTokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    return petfinderAccessToken;
  } catch (err) {
    console.error('Failed to get Petfinder access token:', err);
    throw err;
  }
}

// Search birds from Petfinder
app.get('/api/petfinder/search', async (req, res) => {
  try {
    const { type = 'bird', limit = 20 } = req.query;
    const token = await getPetfinderAccessToken();

    const response = await axios.get('https://api.petfinder.com/v2/animals', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        type,
        limit,
        sort: '-recent'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error searching Petfinder:', err);
    res.status(500).json({ error: 'Failed to search Petfinder' });
  }
});

// Get specific animal from Petfinder
app.get('/api/petfinder/animal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getPetfinderAccessToken();

    const response = await axios.get(`https://api.petfinder.com/v2/animals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error fetching animal from Petfinder:', err);
    res.status(500).json({ error: 'Failed to fetch animal' });
  }
});

// Import bird from Petfinder to local database
app.post('/api/birds/import-petfinder', async (req, res) => {
  try {
    const { name, species, age, description, image_url } = req.body;

    const result = await pool.query(
      'INSERT INTO birds (name, species, age, description, image_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, species, age || null, description || '', image_url || '', 'available']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error importing bird:', err);
    res.status(500).json({ error: 'Failed to import bird' });
  }
});

// ============================================================================
// ADMIN AUTHENTICATION ENDPOINTS
// ============================================================================

const bcrypt = require('bcryptjs');

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all admin users (admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, created_at FROM admin_users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

// Create new admin user (admin only)
app.post('/api/admin/users', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admin_users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, passwordHash, email || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create admin user' });
    }
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Heart & Soul Parrot Rescue API is running' });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🦜 Heart & Soul Parrot Rescue API running on port ${PORT}`);
});

module.exports = app;

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;

    const result = await pool.query(
      'UPDATE events SET title = $1, description = $2, event_date = $3, location = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [title, description, event_date, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});
