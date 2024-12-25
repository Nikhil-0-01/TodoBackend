import express, { Request, Response } from 'express';
import { pgClient } from '../db';  // Adjust path based on your file structure
import { Middleware } from '../middleware';  // Adjust path based on your file structure
import cors from "cors"
const app = express();
app.use(express.json());  // To parse incoming JSON data
app.use(cors())

// POST /api/createTodo route
// @ts-ignore 
app.post('/api/createNote', Middleware, async (req: Request, res: Response) => {
  const { title } = req.body;

  try {
    // const { userid } = req.body; 
      const userid = req.userid;

    if (!userid) {
      return res.status(401).json({ message: 'Invalid Token' });  // Token validation failure
    }

    // Insert the new todo item into the database
    const result = await pgClient.query(
      `INSERT INTO Notes (title, user_id) VALUES ($1, $2) RETURNING *;`,
      [title, userid]
    );

    res.json({ note : result.rows[0] });  // Send back the inserted todo
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });  // Handle any errors
  }
});
