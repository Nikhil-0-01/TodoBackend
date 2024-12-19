"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db"); // Adjust path based on your file structure
const middleware_1 = require("../middleware"); // Adjust path based on your file structure
const app = (0, express_1.default)();
app.use(express_1.default.json()); // To parse incoming JSON data
app.use(middleware_1.Middleware); // Add your authentication middleware
// POST /api/createTodo route
// @ts-ignore 
app.post('/api/createTodo', async (req, res) => {
    const { title, description, isdone } = req.body;
    try {
        const { userid } = req.body; // Assuming the `userid` is added to `req.body` by Middleware
        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' }); // Token validation failure
        }
        // Insert the new todo item into the database
        const result = await db_1.pgClient.query(`INSERT INTO TODO (title, description, isdone, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`, [title, description, isdone, userid]);
        res.json({ todo: result.rows[0] }); // Send back the inserted todo
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); // Handle any errors
    }
});
