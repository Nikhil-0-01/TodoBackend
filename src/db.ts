import { Client } from 'pg';

let pgClient: Client;

if (process.env.DATABASE_URL) {
  pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Ensure SSL is enabled for cloud databases
    },
  });
}

// Asynchronous database connection handler
async function dbConnect() {
  if (!pgClient._connected) {
    try {
      await pgClient.connect();
      console.log('Database connected successfully');
    } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1); // Exit the process if the connection fails
    }
  }
}

// Avoid creating tables on each invocation
export async function initializeSchema() {
  try {
    // Create tables only if they don't exist (this should only happen once or in migrations)
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
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

// Initialize DB connection and schema at startup (in a non-serverless environment, this would be called once)
dbConnect();

// Run schema setup once
initializeSchema().catch((err) => {
  console.error('Error initializing schema:', err);
});

export { pgClient }; // Export the client for use in other parts of the application
