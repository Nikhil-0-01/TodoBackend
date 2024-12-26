"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @ts-ignore 
exports.default = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ status: 401, message: "Fill the required fields" });
    }
    try {
        const findUser = await db_1.pgClient.query(`SELECT email, password, username, id FROM users WHERE email = $1`, [email]);
        if (findUser.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordCheck = await bcrypt_1.default.compare(password, findUser.rows[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // @ts-ignore 
        const token = jsonwebtoken_1.default.sign({ id: findUser.rows[0].id }, process.env.SECRET);
        res.json({
            token: token,
            username: findUser.rows[0].username,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
