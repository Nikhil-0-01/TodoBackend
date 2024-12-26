"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// @ts-ignore 
exports.default = async (req, res) => {
    const { id, title, description } = req.body;
    if (!id || !title || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const userId = req.userid; // Middleware adds `userid` to `req`
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
};
