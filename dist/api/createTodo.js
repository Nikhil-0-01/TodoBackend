"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// @ts-ignore 
exports.default = async (req, res) => {
    const { title, description, isdone } = req.body;
    try {
        const userId = req.userid; // Middleware will add `userid` to `req`
        const newTodo = await db_1.pgClient.query(`INSERT INTO TODO (title, description, isdone, user_id) 
             VALUES ($1, $2, $3, $4) RETURNING *;`, [title, description, isdone, userId]);
        res.json({ todo: newTodo.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
