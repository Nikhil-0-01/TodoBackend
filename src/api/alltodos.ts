import express, { Request, Response } from 'express';
import { pgClient } from '../db';  // Adjust the path based on your file structure
import { Middleware } from "../middleware"
import cors from "cors";

const app = express();
app.use(express.json()); // To parse incoming JSON data
app.use(cors())

// GET /alltodos route
// @ts-ignore 
app.get('/api/alltodos', Middleware,  async (req: Request, res: Response) => {
  try {

    // @ts-ignore 
    const { userid } = req;  // Assuming `userid` is added in the middleware to `req.body`
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
});


