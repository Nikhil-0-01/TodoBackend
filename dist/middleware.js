"use strict";
// /src/middleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function Middleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ msg: 'Invalid Credentials' });
    }
    try {
        const tokenVerify = jsonwebtoken_1.default.verify(authHeader.split(' ')[1], 
        // @ts-ignore 
        process.env.SECRET); // Split the token from 'Bearer <token>'
        // @ts-ignore
        req.userid = tokenVerify.id;
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
}
