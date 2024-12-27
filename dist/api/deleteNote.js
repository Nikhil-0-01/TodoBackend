"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// @ts-ignore
exports.default = async (req, res) => {
    const { id } = req.body;
    try {
        const userId = req.userid; // Middleware adds `userid` to `req`
        const deletedNote = await db_1.pgClient.query(`DELETE FROM Notes WHERE id = $1 AND user_id = $2 RETURNING *;`, [id, userId]);
        if (deletedNote.rows.length === 0) {
            return res.status(404).json({ message: "Note not found or you don't have permission to delete" });
        }
        res.json({ note: deletedNote.rows[0] });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
