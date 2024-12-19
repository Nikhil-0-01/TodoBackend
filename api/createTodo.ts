// /api/createTodo.ts
// @ts-ignore /
import { NextApiRequest, NextApiResponse } from 'next';
import { pgClient } from '../src/db';
import { Middleware } from '../src/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, isdone } = req.body;
    try {
      const { userid } = req.body;  // Assuming the user ID is added in Middleware
      const result = await pgClient.query(
        `INSERT INTO TODO (title, description, isdone, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`, 
        [title, description, isdone, userid]
      );
      res.json({ todo: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
