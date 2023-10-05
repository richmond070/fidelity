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
exports.transactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const TransactionService = __importStar(require("./transaction.service"));
exports.transactionRouter = express_1.default.Router();
exports.transactionRouter.post("/", (0, express_validator_1.body)("transactionNumber").isString(), (0, express_validator_1.body)("depositId").isInt(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const transaction = req.body;
        const newNumber = yield TransactionService.makeTransaction(transaction);
        if (transaction > 1) {
            return res.status(400).json({ message: "Transaction number already exist for this payment" });
        }
        return res.status(201).json(newNumber);
    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ message: "Can't send transaction number please wait" });
    }
}));
exports.transactionRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield TransactionService.listTransactions();
        return res.status(200).json(transaction);
    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ message: "error retrieving transaction numbers" });
    }
}));
exports.transactionRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        yield TransactionService.deleteTransactions(id);
        return res.status(204).json("Transaction number has been deleted successfully!!");
    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ message: "Error deleting transaction number" });
    }
}));
exports.transactionRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield TransactionService.deleteAllTransactions();
        return res.status(204).json({ message: "No existing transactions left" });
    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ message: "Error deleting transaction numbers" });
    }
}));
//# sourceMappingURL=transaction.router.js.map