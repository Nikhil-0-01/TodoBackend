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
    const { id } = req.body;
    try {
        // @ts-ignore 
        const userId = req.userid;
        const deletedTodo = await db_1.pgClient.query(`DELETE FROM TODO WHERE id = $1 AND user_id = $2 RETURNING *;`, [id, userId]);
        if (deletedTodo.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found or you don't have permission to delete" });
        }
        res.json({ message: "Todo Deleted", todo: deletedTodo.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = app;
