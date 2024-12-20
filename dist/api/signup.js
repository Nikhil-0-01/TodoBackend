"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db"); // Adjust the path if necessary
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // To parse incoming JSON data
app.use((0, cors_1.default)());
// POST /api/signup route
app.post('/api/signup', async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    try {
        // Hash the password
        const hashPassword = await bcrypt_1.default.hash(password, 6);
        // Insert user into the database
        await db_1.pgClient.query(`INSERT INTO users (firstname, lastname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [firstname, lastname, username, email, hashPassword]);
        // Respond with success
        res.status(200).json({ user: 'Done' });
    }
    catch (error) {
        console.error(error);
        // @ts-ignore 
        res.status(400).json({ error: error.message });
    }
});
