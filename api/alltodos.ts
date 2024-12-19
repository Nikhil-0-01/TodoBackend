// /api/alltodos.ts
// @ts-ignore 

import { NextApiRequest, NextApiResponse } from 'next';
import { pgClient } from '../src/db';
import { Middleware } from '../src/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userid } = req.body; // Assuming you add this to req.body in Middleware
      if (!userid) {
        return res.status(401).json({ message: 'Invalid Token' });
      }
      const findTodos = await pgClient.query(
        `SELECT title, description, isdone FROM TODO WHERE user_id = $1`, 
        [userid]
      );
      res.json({ todo: findTodos.rows });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
