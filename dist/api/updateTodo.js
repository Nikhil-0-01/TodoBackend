"use strict";
// /api/updateTodo.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db"); // Database connection
const middleware_1 = require("../middleware");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Update Todo
// @ts-ignore 
app.put("/api/updateTodo", middleware_1.Middleware, async (req, res) => {
    const { id, title, description } = req.body;
    if (!id || !title || !description === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        // @ts-ignore
        const userId = req.userid;
        const result = await db_1.pgClient.query(`UPDATE TODO 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description)
       WHERE id = $3 AND user_id = $4
       RETURNING *;`, [title, description, id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }
        res.status(200).json({ message: "Todo updated", todo: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = app;
