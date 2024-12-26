"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
// @ts-ignore 
exports.default = async (req, res) => {
    try {
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
};
