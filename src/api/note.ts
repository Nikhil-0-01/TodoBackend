import { Middleware } from '../middleware';
import { pgClient } from '../db';

// @ts-ignore 
export default async (req, res) => {
    const { title } = req.body;

    try {
        const { userid } = req;  // Middleware adds the `userid` to the `req` object

        if (!userid) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        const result = await pgClient.query(
            `INSERT INTO Notes (title, user_id) VALUES ($1, $2) RETURNING *;`,
            [title, userid]
        );

        res.json({ note: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
