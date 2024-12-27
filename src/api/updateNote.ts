import { Middleware } from '../middleware';
import { pgClient } from '../db';


// @ts-ignore 
export default async (req, res) => {
    const { id, title} = req.body;

    if (!id || !title) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const userId = req.userid;  // Middleware adds `userid` to `req`

        const result = await pgClient.query(
            `UPDATE Notes 
             SET title = COALESCE($1, title)
             WHERE id = $2 AND user_id = $3
             RETURNING *;`,
            [title, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.status(200).json({ message: "Note updated", note: result.rows[0] });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
