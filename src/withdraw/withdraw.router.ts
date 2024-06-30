import { Router } from "express";
import { verifyToken, authorization } from "../utils/auth";
import {
    createWithdraw,
    listUnverifiedWithdrawal,
    verifyWithdrawal,
} from "./withdraw.service";


export const withdrawRouter = Router();

withdrawRouter.post("/withdraw", verifyToken, createWithdraw);
withdrawRouter.get("/listWithdrawal", listUnverifiedWithdrawal);
withdrawRouter.post("/verifyWithdrawal", verifyWithdrawal);
