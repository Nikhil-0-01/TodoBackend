import { pgClient } from '../db';
import bcrypt from 'bcrypt';
// @ts-ignore 
export default async (req, res) => {
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
};
