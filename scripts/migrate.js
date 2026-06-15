const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const createTablesSQL = `
  -- Birds table
  CREATE TABLE IF NOT EXISTS birds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    age VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Contact messages table
  CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Events table
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Create indexes for better query performance
  CREATE INDEX IF NOT EXISTS idx_birds_status ON birds(status);
  CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
  CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at);
`;

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    await pool.query(createTablesSQL);
    console.log('✅ Database migrations completed successfully!');
    
    // Insert sample data
    await pool.query(`
      INSERT INTO birds (name, species, age, description, status)
      VALUES 
        ('Polly', 'Blue and Gold Macaw', '5 years', 'Friendly and talkative parrot', 'available'),
        ('Scarlet', 'Scarlet Macaw', '3 years', 'Beautiful red macaw, loves to play', 'available'),
        ('Kiwi', 'Green-winged Macaw', '7 years', 'Gentle and affectionate', 'available')
      ON CONFLICT DO NOTHING;
    `);
    
    console.log('✅ Sample data inserted!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
