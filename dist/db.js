"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgClient = void 0;
exports.schemaSetting = schemaSetting;
const pg_1 = require("pg");
// Initialize PostgreSQL client with connection string
exports.pgClient = new pg_1.Client("postgresql://neondb_owner:uT0ghJbdAQ2r@ep-rapid-river-a51r9v9j.us-east-2.aws.neon.tech/neondb?sslmode=require");
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.pgClient.connect();
            console.log('Database connected successfully');
        }
        catch (err) {
            console.error('Error connecting to the database:', err);
            process.exit(1); // Exit the process if the connection fails
        }
    });
}
dbConnect();
// userSchema
function schemaSetting() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create users table if it doesn't exist
            yield exports.pgClient.query(`
            CREATE TABLE IF NOT EXISTS users (
             id SERIAL PRIMARY KEY,
             firstname VARCHAR(100) NOT NULL,
             lastname VARCHAR(100) NOT NULL,
             email VARCHAR(255) UNIQUE NOT NULL,   
             username VARCHAR(100) UNIQUE NOT NULL,
             password VARCHAR(100) NOT NULL
);

        `);
            // Create TODO table if it doesn't exist
            yield exports.pgClient.query(`
            CREATE TABLE IF NOT EXISTS TODO (
                 id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                isdone BOOLEAN NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        }
        catch (err) {
            console.error('Error creating tables:', err);
        }
    });
}
schemaSetting();
