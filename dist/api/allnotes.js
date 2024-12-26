"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// @ts-ignore 
exports.default = async (req, res) => {
    try {
        // @ts-ignore 
        const { userid } = req; // Assuming `userid` is added in the middleware to `req.body`
        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        const findNotes = await db_1.pgClient.query(`SELECT id ,title FROM Notes WHERE user_id = $1`, [userid]);
        res.json({ note: findNotes.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
