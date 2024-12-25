// /api/deleteTodo.ts

import { pgClient } from "../db"; // Database connection
import { Middleware } from "../middleware"; // Middleware for JWT
import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors())

// Delete Todo
// @ts-ignore 
app.delete("/api/deleteTodo", Middleware, async (req, res) => {
  const { id } = req.body;

  try {
        // @ts-ignore 

    const userId = req.userid;
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
});

export default app;
