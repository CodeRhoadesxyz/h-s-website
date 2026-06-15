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

  -- Surrender Applications table
  CREATE TABLE IF NOT EXISTS surrender_applications (
    id SERIAL PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_phone VARCHAR(20),
    bird_name VARCHAR(255) NOT NULL,
    bird_species VARCHAR(255) NOT NULL,
    bird_age VARCHAR(100),
    bird_description TEXT,
    reason_for_surrender TEXT NOT NULL,
    bird_health_status TEXT,
    behavioral_notes TEXT,
    dietary_preferences TEXT,
    medical_history TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Adoption Applications table
  CREATE TABLE IF NOT EXISTS adoption_applications (
    id SERIAL PRIMARY KEY,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20),
    applicant_address TEXT,
    applicant_city VARCHAR(100),
    applicant_state VARCHAR(50),
    applicant_zip VARCHAR(20),
    bird_id INTEGER REFERENCES birds(id),
    bird_name VARCHAR(255),
    household_members INTEGER,
    other_pets TEXT,
    experience_level VARCHAR(100),
    living_situation VARCHAR(100),
    why_adopt TEXT,
    commitment_level TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Admin Users table
  CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Create indexes for better query performance
  CREATE INDEX IF NOT EXISTS idx_birds_status ON birds(status);
  CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
  CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_surrender_status ON surrender_applications(status);
  CREATE INDEX IF NOT EXISTS idx_adoption_status ON adoption_applications(status);
  CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);
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
    
    // Insert default admin user (username: dalton, password: 262321)
    const bcrypt = require('bcryptjs');
    const defaultPassword = '262321';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    
    await pool.query(`
      INSERT INTO admin_users (username, password_hash, email)
      VALUES ('dalton', $1, 'admin@heartandsoulparrotrescue.com')
      ON CONFLICT (username) DO NOTHING;
    `, [passwordHash]);
    
    console.log('✅ Sample data and default admin user inserted!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
