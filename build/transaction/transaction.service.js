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
exports.deleteAllTransactions = exports.deleteTransactions = exports.listTransactions = exports.makeTransaction = void 0;
const db_sever_1 = require("../utils/db.sever");
const makeTransaction = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionNumber, depositId } = transaction;
    return db_sever_1.prisma.transaction.create({
        data: {
            transactionNumber,
            depositId,
        }
    });
});
exports.makeTransaction = makeTransaction;
const listTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_sever_1.prisma.transaction.findMany({
        select: {
            id: true,
            transactionNumber: true,
            depositId: true
        },
    });
});
exports.listTransactions = listTransactions;
const deleteTransactions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_sever_1.prisma.transaction.delete({
        where: {
            id
        }
    });
});
exports.deleteTransactions = deleteTransactions;
const deleteAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_sever_1.prisma.transaction.deleteMany();
});
exports.deleteAllTransactions = deleteAllTransactions;
//# sourceMappingURL=transaction.service.js.map