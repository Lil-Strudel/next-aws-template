import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'cats_db',
});

let initialized = false;

async function initializeDatabase() {
  if (initialized) return;
  initialized = true;

  try {
    console.log('Initializing database schema...');

    // Create cats table if it doesn't exist
    await pool.query(`
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
  }
}

export async function query(
  text: string,
  params?: unknown[]
): Promise<QueryResult> {
  // Initialize database on first query
  if (!initialized) {
    await initializeDatabase();
  }

  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}

export default pool;
