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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransaction = exports.deleteUser = exports.getUsers = exports.getUser = exports.createUser = void 0;
const db_sever_1 = require("../utils/db.sever");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, fullName, email, password } = req.body;
    try {
        const user = yield db_sever_1.prisma.user.create({
            data: {
                userName,
                fullName,
                email,
                password,
                role: 'USER'
            }
        });
        res.status(201).json({
            message: "Created successfully",
            data: { userName, fullName, email, password }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Sever error",
            message: "Error creating user please wait"
        });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName } = req.body;
    try {
        const user = yield db_sever_1.prisma.user.findUnique({
            where: {
                email
            },
            select: {
                fullName
            }
        });
        res.status(200).json({
            data: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Sever error",
            message: "User not found!"
        });
    }
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_sever_1.prisma.user.findMany();
        res.status(200).json({
            data: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body;
    try {
        if (!email) {
            throw new Error("Email does not exist");
        }
        const deleteUser = yield db_sever_1.prisma.user.delete({
            where: {
                email
            }
        });
        res.status(204).json({
            message: "User deleted successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});
exports.deleteUser = deleteUser;
const getTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionNumbers = yield db_sever_1.prisma.transaction.findMany();
        res.status(200).json({
            data: transactionNumbers
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});
exports.getTransaction = getTransaction;
//# sourceMappingURL=admin.service.js.map