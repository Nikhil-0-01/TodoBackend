"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db"); // Adjust path based on your file structure
const middleware_1 = require("../middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // To parse incoming JSON data
app.use((0, cors_1.default)());
// POST /api/createTodo route
// @ts-ignore 


app.post('/api/createNote', middleware_1.Middleware, async (req, res) => {
    const { title } = req.body;
    try {
        // @ts-ignore
        const { userid } = req;
        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' }); // Token validation failure
        }
        // Insert the new todo item into the database
        const result = await db_1.pgClient.query(`INSERT INTO Notes (title, user_id) VALUES ($1, $2) RETURNING *;`, [title, userid]);
        res.json({ note: result.rows[0] }); // Send back the inserted todo
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); // Handle any errors
    }
});
