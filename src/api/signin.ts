import { pgClient } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// @ts-ignore 
export default async (req, res) => {
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
// @ts-ignore 
        const token = jwt.sign({ id: findUser.rows[0].id }, process.env.SECRET);
        res.json({
            token: token,
            username: findUser.rows[0].username,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
