"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db"); // Adjust the path if necessary
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // To parse incoming JSON data
app.use((0, cors_1.default)());
// POST /api/signin route
// @ts-ignore 
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ status: 401, message: "Fill the required fields" });
    }
    try {
        // Check if the user exists in the database
        const findUser = await db_1.pgClient.query(`SELECT email, password, username, id FROM users WHERE email = $1`, [email]);
        // If user is not found, return error
        if (findUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare password hash with the database
        const passwordCheck = await bcrypt_1.default.compare(password, findUser.rows[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token if authentication is successful
        // @ts-ignore 
        const token = jsonwebtoken_1.default.sign({ id: findUser.rows[0].id }, process.env.SECRET);
        // Send response with the token and username
        res.json({ token, username: findUser.rows[0].username });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
