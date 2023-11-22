"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const UserService = __importStar(require("./users.service"));
exports.userRouter = express_1.default.Router();
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService.listUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        const user = yield UserService.getUser(id);
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(400).json("User could not be found!");
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
exports.userRouter.post("/signup", (0, express_validator_1.body)("fullName").isString(), (0, express_validator_1.body)("userName").isString(), (0, express_validator_1.body)("email").isString(), (0, express_validator_1.body)("password").isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = req.body;
        const newUser = yield UserService.createUser(user);
        res.status(201).json({
            success: true,
            user: newUser,
            redirect: '/verify',
            message: 'signup successful, please login'
        });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
exports.userRouter.put("/:id", (0, express_validator_1.body)("userName").isString(), (0, express_validator_1.body)("email").isString(), (0, express_validator_1.body)("password").isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id, 10);
    try {
        const user = req.body;
        const updatedUser = yield UserService.updateUser(user, id);
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
exports.userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        yield UserService.deleteUser(id);
        return res.status(204).json("User has been deleted successfully!!");
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
exports.userRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserService.deleteAllUsers();
        return res.status(204).json("Users deleted successfully");
    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ message: "Error deleting transaction numbers" });
    }
}));
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = yield UserService.logUser(email, password);
        if (token === "") {
            return res.status(400).json({
                status: "Bad Request!",
                message: "Wrong email or Password"
            });
        }
        res.cookie("jwt", token, { httpOnly: true });
        return res.status(200).json({
            status: "OK!",
            message: "Successfully login",
            result: token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
}));
//# sourceMappingURL=user.router.js.map