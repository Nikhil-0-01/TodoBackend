import { Middleware } from '../middleware';
import { pgClient } from '../db';
// @ts-ignore
export default async (req, res) => {
    const { id } = req.body;

    try {
        const userId = req.userid;  // Middleware adds `userid` to `req`

        const deletedTodo = await pgClient.query(
            `DELETE FROM TODO WHERE id = $1 AND user_id = $2 RETURNING *;`,
            [id, userId]
        );

        if (deletedTodo.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found or you don't have permission to delete" });
        }

        res.json({ message: "Todo Deleted", todo: deletedTodo.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
