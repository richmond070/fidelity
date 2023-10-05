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
exports.logUser = exports.deleteAllUsers = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.listUsers = void 0;
const auth_1 = __importDefault(require("../utils/auth"));
const db_sever_1 = require("../utils/db.sever");
const password_1 = require("../utils/password");
const listUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const defaultRole = 'USER';
    return db_sever_1.prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true,
        },
    });
});
exports.listUsers = listUsers;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
});
exports.getUser = getUser;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, userName, email, password } = user;
    const hashedPassword = yield (0, password_1.generateHash)(password);
    const defaultRole = 'USER';
    return db_sever_1.prisma.user.create({
        data: {
            fullName,
            userName,
            email,
            password: hashedPassword,
            role: defaultRole
        },
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true
        },
    });
});
exports.createUser = createUser;
const updateUser = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = user;
    return db_sever_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            userName,
            email,
            password,
        },
        select: {
            id: true,
            fullName: true,
            userName: true,
            email: true,
            password: true,
            role: true
        },
    });
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_sever_1.prisma.user.delete({
        where: {
            id,
        },
    });
});
exports.deleteUser = deleteUser;
const deleteAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_sever_1.prisma.user.deleteMany();
});
exports.deleteAllUsers = deleteAllUsers;
function logUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db_sever_1.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw new Error("Email is not correct!");
            }
            const passwordMatch = yield (0, password_1.compareHash)(password, user.password);
            if (passwordMatch) {
                return auth_1.default.generateToken(user.id, user.userName);
            }
            else {
                throw new Error('Password is not correct!');
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.logUser = logUser;
//# sourceMappingURL=users.service.js.map