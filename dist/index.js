"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
exports.SECRET = "WRUEIKJASFJSALFASN";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, username, email, password } = req.body;
    try {
        const hashpassword = yield bcrypt_1.default.hash(password, 6);
        yield db_1.pgClient.query(` 
            INSERT into users(firstname,lastname,username,email,password) VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`, [firstname, lastname, username, email, hashpassword]);
        res.status(200).json({
            user: "Done"
        });
    }
    catch (error) {
        res.status(400).json({
            error: error
        });
    }
}));
// @ts-ignore
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Ensure both fields are provided
    if (!email || !password) {
        return res.status(401).json({
            status: 401,
            message: "Fill the required fields"
        });
    }
    try {
        const findUser = yield db_1.pgClient.query(`
            SELECT email, password, username, id FROM users 
            WHERE email = $1
        `, [email]);
        // Check if the user exists
        if (findUser.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the password is correct
        const passwordCheck = yield bcrypt_1.default.compare(password, findUser.rows[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: findUser.rows[0].id }, exports.SECRET, { expiresIn: '1h' });
        // Return the token and username
        res.json({
            token: token,
            username: findUser.rows[0].username
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
//Read
app.get("/alltodos", middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore 
        const id = req.userid;
        if (id === undefined || null) {
            res.status(401).json({ message: "Invalid Token" });
        }
        const findtodos = yield db_1.pgClient.query(`
    SELECT title, description, isdone FROM TODO 
    where user_id = $1`, [id]);
        // if (findtodos.rows.length===0) {
        //     res.status(404).send({
        //         message: "Not Found"
        //     })
        // }
        res.json({
            todo: findtodos.rows
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
//Create
app.post("/alltodos/create", middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, isdone } = req.body;
    try {
        //  @ts-ignore 
        const id = req.userid;
        const Todos = yield db_1.pgClient.query(`
    INSERT into TODO (title, description, isdone, user_id) VALUES ($1, $2, $3, $4)
    RETURNING *;`, [title, description, isdone, id]);
        res.json({
            // @ts-ignore 
            todo: Todos.rows[0]
        });
    }
    catch (error) {
        console.log(error);
    }
    // @ts-ignore 
}));
//Update
app.put("/alltodos/update", middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, id, } = req.body;
    // @ts-ignore 
    const userid = req.userid;
    const updatedTodo = yield db_1.pgClient.query(`
        UPDATE TODO 
        SET title = COALESCE($1, title), 
            description = COALESCE($2, description)
        WHERE id = $3 AND user_id = $4
        RETURNING *;
    `, [title, description, id, userid]);
    res.json({
        message: "Todo Updated"
    });
}));
//Delete
app.delete("/alltodos/delete", middleware_1.Middleware, (req, res) => {
    const { title } = req.body;
    //  @ts-ignore 
    const userId = req.userid;
    const findTodo = db_1.pgClient.query(`
     DELETE FROM TODO WHERE 
       title = $1 AND user_id = $2`, [title, userId]);
    res.json({
        message: "Todo Deleted"
    });
});
app.listen(3000);
