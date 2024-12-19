// /api/deleteTodo.ts

import { pgClient } from "../db"; // Database connection
import { Middleware } from "../middleware"; // Middleware for JWT
import express from "express";

const app = express();
app.use(express.json());

// Delete Todo
// @ts-ignore 
app.delete("/api/deleteTodo", Middleware, async (req, res) => {
  const { id, title } = req.body;

  if (!id && !title) {
    return res.status(400).json({ message: "Either id or title is required" });
  }

  try {
    // @ts-ignore
    const userId = req.userid;

    let query = `DELETE FROM TODO WHERE user_id = $1 AND `;
    let values = [userId];

    if (id) {
      query += `id = $2`;
      values.push(id);
    } else if (title) {
      query += `title = $2`;
      values.push(title);
    }

    const result = await pgClient.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found or unauthorized" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default app;
