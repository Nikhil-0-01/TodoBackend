"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function Middleware(req, res, next) {
    const authHeader = req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).json({ msg: 'Authorization header is missing' });
    }
    // Split the token from 'Bearer <token>'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Token is missing in the Authorization header' });
    }
    try {
        // Verify token
        // @ts-ignore 
        const tokenVerify = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.userid = tokenVerify.id; // Store the user ID from the decoded token
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
}
