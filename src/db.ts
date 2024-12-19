import { Client } from 'pg';

let pgClient: Client | null = null;

// Initialize the client only if the DATABASE_URL is present
if (process.env.DATABASE_URL) {
  pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Enable SSL for cloud-hosted databases
    },
  });
}

// Ensures that the database connection is established
async function dbConnect() {
  // @ts-ignore
  if (pgClient && !pgClient._connected) {
    try {
      await pgClient.connect();
      console.log('Database connected successfully');
    } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1); // Exit the process if the connection fails
    }
  }
}

// This function will ensure the schema is set up only once
export async function initializeSchema() {
  try {
    // Check if pgClient is initialized before querying
    if (!pgClient) {
      throw new Error('PostgreSQL client is not initialized.');
    }

    // Create tables only if they don't already exist (idempotent operation)
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS TODO (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        isdone BOOLEAN NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Tables created successfully or already exist');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

// Ensure DB is connected and schema is set up
async function setupDatabase() {
  await dbConnect(); // Ensure the DB connection is established
  await initializeSchema(); // Initialize the schema (create tables)
}

// Set up database connection and schema during initialization
setupDatabase().catch((err) => {
  console.error('Error initializing database:', err);
});

export { pgClient }; // Export pgClient for use in other modules
