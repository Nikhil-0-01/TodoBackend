import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pgClient } from '../db';  // Adjust the path if necessary
import cors from "cors";

const app = express();
app.use(express.json());  // To parse incoming JSON data
app.use(cors())

// POST /api/signin route
// @ts-ignore 
app.post('/api/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const findUser = await pgClient.query(
      `SELECT email, password FROM users WHERE email = $1`,
      [email]
    );

    // If user is not found, return error
    if (findUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password hash with the database
    const passwordCheck = await bcrypt.compare(password, findUser.rows[0].password);
    if (!passwordCheck) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token if authentication is successful
    const token = jwt.sign({ id: findUser.rows[0].id }, process.env.SECRET || 'defaultSecret', { expiresIn: '1h' });

    // Send response with the token and username
    res.json({ token, username: findUser.rows[0].username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


