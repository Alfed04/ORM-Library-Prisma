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
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'Alfed@123';
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//@ts-ignore
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const requiredBody = z.object({
    //     username:z.string().min(3).max(100),
    //     email:z.string().min(3).max(30).email(),
    //     password:z.string().min(3).max(100)
    // })
    // const parsedBody = requiredBody.safeParse(req.body)
    // console.log(parsedBody)
    // if(!parsedBody.success){
    //     return res.json({
    //         message: "Incorrect Format"
    //     })
    // }
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let errorThrown = false;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        yield client.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
    }
    catch (e) {
        res.json({
            message: "User already exists"
        });
        errorThrown = true;
    }
    if (!errorThrown) {
        return res.json({
            message: "You are signed up"
        });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield client.user.findFirst({
        where: {
            email: email
        }
    });
    console.log(user);
    if (!user) {
        res.status(403).json({
            message: "User do not exist in our database"
        });
    }
    //@ts-ignore
    const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
    console.log(isPasswordMatch);
    if (isPasswordMatch) {
        const token = jsonwebtoken_1.default.sign({
            id: user === null || user === void 0 ? void 0 : user.id
        }, JWT_SECRET);
        res.json({
            token: token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect Credentials"
        });
    }
}));
//@ts-ignore
const auth = (req, res, next) => {
    const token = req.headers.token;
    const decodeData = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    console.log(decodeData);
    if (decodeData) {
        //@ts-ignore
        req.userId = decodeData.id;
        next();
    }
    else {
        res.json({
            message: "Incorrect Credentials"
        });
    }
};
app.post('/todo', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    const done = req.body.done;
    yield client.todo.create({
        data: {
            title,
            description,
            done,
            userId: userId
        }
    });
    res.json({
        message: "Todo created"
    });
}));
app.get('/todos', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const todos = yield client.todo.findMany({
        where: {
            userId: userId
        }
    });
    res.json({
        todos
    });
}));
app.listen(3000, () => {
    console.log("App is listening to the requests coming at port number 3000");
});
