"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function Middleware(req, res, next) {
    // Ensure you're accessing the authorization header with the correct case
    const authHeader = req.headers['authorization']; // 'authorization' is all lowercase
    if (!authHeader) {
        return res.status(401).json({ msg: 'Authorization header is missing' });
    }
    try {
        // @ts-ignore 
        const tokenVerify = jsonwebtoken_1.default.verify(authHeader, process.env.SECRET);
        // @ts-ignore 
        req.userid = tokenVerify.id;
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
}
