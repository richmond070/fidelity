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
exports.verifyDeposit = exports.getUnverifiedDeposits = exports.deleteAdmin = exports.getAdmins = exports.getAdmin = exports.logAdmin = exports.createAdmin = exports.getAllDeposit = exports.deposit = exports.deleteUser = exports.getUsers = exports.getUser = exports.createUser = void 0;
const db_sever_1 = require("../utils/db.sever");
const password_1 = require("../utils/password");
const auth_1 = __importDefault(require("../utils/auth"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, fullName, email, password } = req.body;
    const hashedPassword = yield (0, password_1.generateHash)(password);
    try {
        const user = yield db_sever_1.prisma.user.create({
            data: {
                userName,
                fullName,
                email,
                password: hashedPassword,
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
                fullName: true
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
            message: `${email} does not exist`
        });
    }
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, userName, email } = req.body;
    try {
        const user = yield db_sever_1.prisma.user.findMany({
            where: {
                role: "USER"
            },
        });
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
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, amount, userId, plan } = req.body;
    try {
        const payment = yield db_sever_1.prisma.deposit.create({
            data: {
                transactionId,
                amount,
                userId,
                plan,
                isVerified: true
            }
        });
        res.status(201).json(payment);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Sever error",
            message: "Error making payment please wait"
        });
    }
});
exports.deposit = deposit;
const getAllDeposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deposit = yield db_sever_1.prisma.deposit.findMany({
            where: {
                isVerified: false
            },
            select: {
                amount: true,
                transactionId: true,
                plan: true,
                createdAt: true
            }
        });
        res.render('admin', { deposit: deposit });
    }
    catch (error) {
        console.error('Error fetching data from the database:', error.message);
        res.status(500).send('Internal Sever Error');
    }
});
exports.getAllDeposit = getAllDeposit;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, fullName, email, password } = req.body;
    const hashedPassword = yield (0, password_1.generateHash)(password);
    try {
        const user = yield db_sever_1.prisma.user.create({
            data: {
                userName,
                fullName,
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        res.status(201).json({
            message: "Created successfully",
            data: user
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
exports.createAdmin = createAdmin;
const logAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    try {
        const admin = yield db_sever_1.prisma.user.findUnique({
            where: {
                userName
            },
        });
        if (!admin) {
            throw new Error("userName is not correct!");
        }
        if (admin.role !== 'ADMIN') {
            return res.status(403).json({ message: "User is not an admin!" });
        }
        const passwordMatch = yield (0, password_1.compareHash)(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password is not correct!" });
        }
        const accessToken = auth_1.default.generateToken(admin.id, admin.role);
        res.cookie("jwt", accessToken, { httpOnly: true });
        return res.status(200).json({
            accessToken
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.logAdmin = logAdmin;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userName, email } = req.body;
    try {
        const admin = yield db_sever_1.prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                userName: true,
                email: true
            }
        });
        res.status(200).json({
            message: "Admin found",
            data: admin
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Sever error",
            message: `Admin ${id} does not exist`
        });
    }
});
exports.getAdmin = getAdmin;
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email } = req.body;
    try {
        const admin = yield db_sever_1.prisma.user.findMany({
            where: {
                role: "ADMIN"
            },
            select: {
                userName: true,
                email: true
            }
        });
        res.status(200).json({
            data: admin
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});
exports.getAdmins = getAdmins;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        if (!id) {
            throw new Error('id does not exist');
        }
        const deleteAdmin = yield db_sever_1.prisma.user.delete({
            where: {
                id: id
            },
        });
        return res.status(200).json({
            message: `${deleteAdmin} deleted successfully`
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
exports.deleteAdmin = deleteAdmin;
function getUnverifiedDeposits(res, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unverifiedDeposits = yield db_sever_1.prisma.deposit.findMany({
                where: {
                    isVerified: false,
                }, select: {
                    amount: true,
                    transactionId: true,
                    plan: true
                }
            });
            res.render('admin', { unverifiedDeposits });
        }
        catch (error) {
            console.error('Error notifying admin:', error);
            throw new Error('Failed to notify admin');
        }
    });
}
exports.getUnverifiedDeposits = getUnverifiedDeposits;
function verifyDeposit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const depositDetails = yield db_sever_1.prisma.deposit.findFirst({
                where: {
                    isVerified: false
                }
            });
            if (!depositDetails) {
                res.status(404).json({ error: 'No unverified deposit found for the user' });
                return;
            }
            yield db_sever_1.prisma.deposit.update({
                where: {
                    id: depositDetails.id,
                },
                data: {
                    isVerified: true,
                },
            });
            res.status(200).json({ message: 'Deposit verified successfully' });
        }
        catch (error) {
            console.error('Error in verifyDeposit:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.verifyDeposit = verifyDeposit;
//# sourceMappingURL=admin.service.js.map