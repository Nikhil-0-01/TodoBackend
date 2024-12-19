// /api/signin.ts
// @ts-ignore 
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pgClient } from '../src/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const findUser = await pgClient.query(
        `SELECT email, password, username, id FROM users WHERE email = $1`, 
        [email]
      );

      if (findUser.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordCheck = await bcrypt.compare(password, findUser.rows[0].password);
      if (!passwordCheck) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }


     const token = jwt.sign({ id: findUser.rows[0].id }, 
        // @ts-ignore 
        process.env.SECRET, { expiresIn: '1h' });
      res.json({ token, username: findUser.rows[0].username });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
