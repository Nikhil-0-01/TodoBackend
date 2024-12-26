"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgClient = void 0;
exports.schemaSetting = schemaSetting;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
let pgClient;
if (process.env.DATABASE_URL) {
    exports.pgClient = pgClient = new pg_1.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false, // Allow self-signed certificates if needed
        },
    });
}
else {
    console.error("DATABASE_URL is not defined in environment variables.");
    process.exit(1); // Exit if the environment variable is not available
}
async function dbConnect() {
    try {
        // @ts-ignore 
        if (!pgClient._connected) { // Check if already connected
            await pgClient.connect();
            console.log('Database connected successfully');
        }
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if connection fails
    }
}
// Calling dbConnect to establish the connection
dbConnect();
// Setup the schema
async function schemaSetting() {
    try {
        if (pgClient) {
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
            await pgClient.query(`
        CREATE TABLE IF NOT EXISTS Notes (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
        }
    }
    catch (err) {
        console.error('Error creating tables:', err);
    }
}
schemaSetting();
