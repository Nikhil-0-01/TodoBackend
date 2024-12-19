"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("./index");
function Middleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.json({ msg: "Invalid Credentials" });
    }
    const tokenVerify = jsonwebtoken_1.default.verify(authHeader, index_1.SECRET);
    // @ts-ignore 
    req.userid = tokenVerify.id;
    next();
}
