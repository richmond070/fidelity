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
exports.deleteAllPayments = exports.deletePayment = exports.makeDeposit = exports.getDeposit = exports.listDeposits = exports.listDeposit = void 0;
const db_sever_1 = require("../utils/db.sever");
const listDeposit = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.deposit.findMany({
        where: {
            userId: userId
        },
        select: {
            transactionId: true,
            amount: true,
            createdAt: true,
            userId: true
        },
    });
});
exports.listDeposit = listDeposit;
const listDeposits = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.deposit.findMany({
        select: {
            id: true,
            transactionId: true,
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
        },
    });
});
exports.getDeposit = getDeposit;
const makeDeposit = (deposit) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, amount, userId } = deposit;
    return db_sever_1.prisma.deposit.create({
        data: {
            transactionId,
            amount,
            userId
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
//# sourceMappingURL=payment.service.js.map