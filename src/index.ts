import express from "express";
import bcrypt from "bcrypt";
import { pgClient } from "./db";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import { Middleware } from "./middleware";

// Load environment variables from .env file
dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);  // Add this to check if it's loaded


// Initialize app
const app = express();





// Middleware
app.use(express.json());
app.use(cors());


// Secret key from environment variables
const SECRET = process.env.SECRET || "defaultsecret"; // Default secret in case the .env is not loaded correctly

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, 6);
    await pgClient.query(
      `INSERT into users(firstname, lastname, username, email, password) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [firstname, lastname, username, email, hashpassword]
    );

    res.status(200).json({ user: "Done" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Signin Route
    // @ts-ignore 

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ status: 401, message: "Fill the required fields" });
  }

  try {
    const findUser = await pgClient.query(
      `SELECT email, password, username, id FROM users WHERE email = $1`,
      [email]
    );

    if (findUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordCheck = await bcrypt.compare(password, findUser.rows[0].password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: findUser.rows[0].id }, SECRET, { expiresIn: "1h" });

    res.json({
      token: token,
      username: findUser.rows[0].username,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all Todos Route
  // @ts-ignore 

app.get("/api/alltodos", Middleware, async (req, res) => {
  try {
        // @ts-ignore 

    const userId = req.userid;
    if (!userId) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const findTodos = await pgClient.query(
      `SELECT title, description, isdone FROM TODO WHERE user_id = $1`,
      [userId]
    );

    res.json({ todo: findTodos.rows });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create Todo Route
app.post("/api/alltodos/create", Middleware, async (req, res) => {
  const { title, description, isdone } = req.body;

  try {
    // @ts-ignore 
    const userId = req.userid;
    const newTodo = await pgClient.query(
      `INSERT INTO TODO (title, description, isdone, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [title, description, isdone, userId]
    );

    res.json({ todo: newTodo.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Todo Route
// @ts-ignore 
app.put("/api/alltodos/update", Middleware, async (req, res) => {
  const { id, title, description, isdone } = req.body;

  try {
        // @ts-ignore 
    const userId = req.userid;
    const updatedTodo = await pgClient.query(
      `UPDATE TODO
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           isdone = COALESCE($3, isdone)
       WHERE id = $4 AND user_id = $5 
       RETURNING *;`,
      [title, description, isdone, id, userId]
    );

    if (updatedTodo.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found or you don't have permission to edit" });
    }

    res.json({ message: "Todo Updated", todo: updatedTodo.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Todo Route
    // @ts-ignore 

app.delete("/api/alltodos/delete", Middleware, async (req, res) => {
  const { id } = req.body;

  try {
        // @ts-ignore 

    const userId = req.userid;
    const deletedTodo = await pgClient.query(
      `DELETE FROM TODO WHERE id = $1 AND user_id = $2 RETURNING *;`,
      [id, userId]
    );

    if (deletedTodo.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found or you don't have permission to delete" });
    }

    res.json({ message: "Todo Deleted", todo: deletedTodo.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Listen to port (Vercel handles dynamic port assignment)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
