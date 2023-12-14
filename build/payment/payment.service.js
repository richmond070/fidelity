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
exports.calROI = exports.getAvailableBalance = exports.deleteAllPayments = exports.deletePayment = exports.makeDeposit = exports.getDeposit = exports.listDeposits = exports.listDeposit = void 0;
const db_sever_1 = require("../utils/db.sever");
const PlanConfigs = {
    PRIME: {
        returnRate: 0.1,
        durationInMs: 48 * 60 * 60 * 1000,
    },
    STANDARD: {
        returnRate: 0.15,
        durationInMs: 48 * 60 * 60 * 1000,
    },
    GOLD: {
        returnRate: 0.38,
        durationInMs: 48 * 60 * 60 * 1000,
    },
    PLATINUM: {
        returnRate: 0.50,
        durationInMs: 48 * 60 * 60 * 1000,
    },
    INSURANCE: {
        returnRate: 0.2,
        durationInMs: 7 * 24 * 60 * 60 * 1000,
    },
    RealEstate: {
        returnRate: 0.75,
        durationInMs: 14 * 24 * 60 * 60 * 1000,
    },
    MERGER: {
        returnRate: 0.9,
        durationInMs: 14 * 24 * 60 * 60 * 1000,
    },
    IMMIGRATION: {
        returnRate: 0.75,
        durationInMs: 14 * 24 * 60 * 60 * 1000,
    },
    ETF: {
        returnRate: 0.55,
        durationInMs: 14 * 24 * 60 * 60 * 1000,
    },
};
const listDeposit = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true
        },
        select: {
            transactionId: true,
            amount: true,
            createdAt: true,
            userId: true,
            plan: true
        },
    });
});
exports.listDeposit = listDeposit;
const listDeposits = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.deposit.findMany({
        select: {
            id: true,
            transactionId: true,
            plan: true,
            amount: true,
        },
    });
});
exports.listDeposits = listDeposits;
const getDeposit = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.deposit.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            transactionId: true,
            amount: true,
            plan: true
        },
    });
});
exports.getDeposit = getDeposit;
const makeDeposit = (deposit) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, amount, userId, plan } = deposit;
    return db_sever_1.prisma.deposit.create({
        data: {
            transactionId,
            amount,
            userId,
            plan,
            isVerified: false
        }
    });
});
exports.makeDeposit = makeDeposit;
const deletePayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_sever_1.prisma.deposit.delete({
        where: {
            id,
        },
    });
});
exports.deletePayment = deletePayment;
const deleteAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_sever_1.prisma.deposit.deleteMany();
});
exports.deleteAllPayments = deleteAllPayments;
const getAvailableBalance = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const deposits = yield db_sever_1.prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true
        },
    });
    const availableBalance = deposits.reduce((total, deposit) => total + deposit.amount, 0);
    return availableBalance;
});
exports.getAvailableBalance = getAvailableBalance;
const calROI = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newDeposit = yield db_sever_1.prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true,
            plan: {
                in: Object.keys(PlanConfigs)
            },
        },
    });
    const currentDate = new Date();
    const calculateNewBalance = (deposit) => {
        const PlanConfig = PlanConfigs[deposit.plan];
        const depositDate = new Date(deposit.createdAt);
        const timeElapsed = currentDate.getTime() - depositDate.getTime();
        if (timeElapsed <= PlanConfig.durationInMs) {
            const dailyReturnRate = Math.pow(1 + PlanConfig.returnRate, timeElapsed / PlanConfig.durationInMs) - 1;
            return deposit.amount * (1 + dailyReturnRate);
        }
        return deposit.amount;
    };
    const newBalance = newDeposit.reduce((total, deposit) => total + calculateNewBalance(deposit), 0);
    const roundedBalance = Math.round(newBalance * 10) / 10;
    return roundedBalance;
});
exports.calROI = calROI;
//# sourceMappingURL=payment.service.js.map