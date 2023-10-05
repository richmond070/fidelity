import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as TransactionService from "./transaction.service";

export const transactionRouter = express.Router();

transactionRouter.post("/", body("transactionNumber").isString(),
    body("depositId").isInt(), async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const transaction = req.body
            const newNumber = await TransactionService.makeTransaction(transaction)
            if (transaction > 1) {
                return res.status(400).json({ message: "Transaction number already exist for this payment" })
            }
            return res.status(201).json(newNumber)
        } catch (error: any) {
            console.log("error:", error)
            return res.status(500).json({ message: "Can't send transaction number please wait" })
        }
    });

transactionRouter.get("/", async (req: Request, res: Response) => {
    try {
        const transaction = await TransactionService.listTransactions()
        return res.status(200).json(transaction)
    } catch (error: any) {
        console.log("error:", error)
        return res.status(500).json({ message: "error retrieving transaction numbers" })
    }
});

transactionRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        await TransactionService.deleteTransactions(id)
        return res.status(204).json("Transaction number has been deleted successfully!!")
    } catch (error: any) {
        console.log("error:", error)
        return res.status(500).json({ message: "Error deleting transaction number" });
    }
})

transactionRouter.delete("/", async (req: Request, res: Response) => {
    try {
        await TransactionService.deleteAllTransactions()
        return res.status(204).json({ message: "No existing transactions left" });
    } catch (error: any) {
        console.log("error:", error)
        return res.status(500).json({ message: "Error deleting transaction numbers" });
    }
})