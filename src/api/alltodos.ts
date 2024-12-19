import express, { Request, Response } from 'express';
import { pgClient } from '../db';  // Adjust the path based on your file structure
import { Middleware } from '../middleware';  // Adjust the path based on your file structure

const app = express();
app.use(express.json()); // To parse incoming JSON data
app.use(Middleware);     // Add your authentication middleware

// GET /alltodos route
// @ts-ignore 
app.get('/api/alltodos', async (req: Request, res: Response) => {
  try {
    const { userid } = req.body;  // Assuming `userid` is added in the middleware to `req.body`
    if (!userid) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    const findTodos = await pgClient.query(
      `SELECT title, description, isdone FROM TODO WHERE user_id = $1`, 
      [userid]
    );

    res.json({ todo: findTodos.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


