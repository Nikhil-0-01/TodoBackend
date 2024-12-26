"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// @ts-ignore 
exports.default = async (req, res) => {
    const { title } = req.body;
    try {
        const { userid } = req; // Middleware adds the `userid` to the `req` object
        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        const result = await db_1.pgClient.query(`INSERT INTO Notes (title, user_id) VALUES ($1, $2) RETURNING *;`, [title, userid]);
        res.json({ note: result.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
