"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db"); // Adjust the path based on your file structure
const middleware_1 = require("../middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // To parse incoming JSON data
app.use((0, cors_1.default)());
// GET /alltodos route
// @ts-ignore 
app.get('/api/alltodos', middleware_1.Middleware, async (req, res) => {
    try {
        // @ts-ignore 
        const { userid } = req; // Assuming `userid` is added in the middleware to `req.body`
        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        const findTodos = await db_1.pgClient.query(`SELECT id ,title, description, isdone FROM TODO WHERE user_id = $1`, [userid]);
        res.json({ todo: findTodos.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
