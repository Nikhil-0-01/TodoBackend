import { Middleware } from '../middleware';
import { pgClient } from '../db';

// @ts-ignore 
export default async (req, res) => {
    try {
        const { userid } = req; // Assuming `userid` is added in the middleware to `req.body`
        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        const findTodos = await pgClient.query(
            `SELECT id ,title, description, isdone FROM TODO WHERE user_id = $1`, 
            [userid]
        );

        res.json({ todo: findTodos.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
