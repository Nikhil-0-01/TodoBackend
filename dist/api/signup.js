"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
// @ts-ignore 
exports.default = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    try {
        const hashpassword = await bcrypt_1.default.hash(password, 6);
        await db_1.pgClient.query(`INSERT into users(firstname, lastname, username, email, password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [firstname, lastname, username, email, hashpassword]);
        res.status(200).json({ user: "Done" });
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
