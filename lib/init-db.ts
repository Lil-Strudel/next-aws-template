import { query } from './db';

export async function initializeDatabase() {
  try {
    console.log('Initializing database schema...');

    // Create cats table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS cats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ Database schema initialized successfully');
  } catch (error) {
    console.error('✗ Failed to initialize database:', error);
    // Don't throw - allow app to continue even if schema creation fails
    // (it might already exist, or we might retry on next request)
  }
}
