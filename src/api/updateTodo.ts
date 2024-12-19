// /api/updateTodo.ts

import { pgClient } from "../db"; // Database connection
import { Middleware } from "../middleware"; // Middleware for JWT
import express from "express";

const app = express();
app.use(express.json());

// Update Todo
// @ts-ignore 
app.put("/api/updateTodo", Middleware, async (req, res) => {
  const { id, title, description, isdone } = req.body;

  if (!id || !title || !description || isdone === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // @ts-ignore
    const userId = req.userid;

    const result = await pgClient.query(
      `UPDATE TODO 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           isdone = COALESCE($3, isdone)
       WHERE id = $4 AND user_id = $5
       RETURNING *;`,
      [title, description, isdone, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found or unauthorized" });
    }

    res.status(200).json({ message: "Todo updated", todo: result.rows[0] });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default app;
