// /api/updateTodo.ts

import { pgClient } from "../db"; // Database connection
import { Middleware } from "../middleware"; // Middleware for JWT
import express from "express";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

// Update Todo
// @ts-ignore 
app.put("/api/updateTodo", Middleware, async (req, res) => {
  const { id, title, description } = req.body;

  if (!id || !title || !description  === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // @ts-ignore
    const userId = req.userid;

    const result = await pgClient.query(
      `UPDATE TODO 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description)
       WHERE id = $3 AND user_id = $4
       RETURNING *;`,
      [title, description, id, userId]
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
