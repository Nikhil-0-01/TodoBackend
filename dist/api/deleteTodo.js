"use strict";
// /api/deleteTodo.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db"); // Database connection
const middleware_1 = require("../middleware"); // Middleware for JWT
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Delete Todo
// @ts-ignore 
app.delete("/api/deleteTodo", middleware_1.Middleware, async (req, res) => {
    const { id, title } = req.body;
    if (!id && !title) {
        return res.status(400).json({ message: "Either id or title is required" });
    }
    try {
        // @ts-ignore
        const userId = req.userid;
        let query = `DELETE FROM TODO WHERE user_id = $1 AND `;
        let values = [userId];
        if (id) {
            query += `id = $2`;
            values.push(id);
        }
        else if (title) {
            query += `title = $2`;
            values.push(title);
        }
        const result = await db_1.pgClient.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = app;
