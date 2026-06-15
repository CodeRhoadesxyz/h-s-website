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
