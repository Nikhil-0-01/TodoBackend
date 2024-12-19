import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pgClient } from '../db';  // Adjust the path if necessary

const app = express();
app.use(express.json());  // To parse incoming JSON data

// POST /api/signup route
app.post('/api/signup', async (req: Request, res: Response) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    // Hash the password
    const hashPassword = await bcrypt.hash(password, 6);

    // Insert user into the database
    await pgClient.query(
      `INSERT INTO users (firstname, lastname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [firstname, lastname, username, email, hashPassword]
    );

    // Respond with success
    res.status(200).json({ user: 'Done' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


