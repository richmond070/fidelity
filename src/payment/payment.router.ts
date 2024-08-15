import express from "express";
import type { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { verifyToken, authorization } from "../utils/auth";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

import * as PaymentService from "./payment.service";
import { createSecretKey } from "crypto";

export const paymentRouter = express.Router();

const user = function userId() {
    return (req: Request, res: Response) => {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
    }
}

//GET: List for the payment
paymentRouter.get("/user", verifyToken, async (req: Request, res: Response) => {

    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const user = req.user
        const id: number = parseInt(user, 10);
        const deposits = await PaymentService.listDeposit(id)
        // Render the EJS template and pass the data
        res.render('deposits', { deposits });
        return res.status(200).json({ data: deposits })
    } catch (error: any) {
        return res.status(500).json(error.message);
    };
});

paymentRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const deposit = await PaymentService.getDeposit(id)
        if (deposit) {
            return res.status(200).json({ data: deposit })
        }
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
});


// to make payment 
paymentRouter.post("/payment", body("transactionId").isString(), body("amount").isInt(),
    verifyToken, authorization("USER"),
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Type guard to narrow down the type
            if (typeof req.user !== 'number') {
                return res.status(403).json({ message: 'Invalid user ID' });
            }

            // Use userId when creating the deposit
            const deposit = {
                transactionId: req.body.transactionId,
                amount: req.body.amount,
                userId: req.user,
                plan: req.body.plan
            };

            // Call the makeDeposit function to create the deposit
            const newDeposit = await PaymentService.makeDeposit(deposit);

            return res.status(201).json({
                newDeposit,
                message: "Congratulations. Your deposit has been successfully submitted. It will become active when the admin confirms it."
            });
        } catch (error: any) {
            console.error('Error in update  route:', error);
            let statusCode = 500;
            let errorMessage = 'Internal server error';

            if (error.message.includes('transactionId')) {
                statusCode = 400;
                errorMessage = 'Please use a valid ID';
            }

            return res.status(statusCode).json({ message: errorMessage });
        }
    });



paymentRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        await PaymentService.deletePayment(id)
        return res.status(204).json("User has been deleted successfully!!")
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})



paymentRouter.delete("/", async (req: Request, res: Response) => {
    try {
        await PaymentService.deleteAllPayments()
        return res.status(204).json("No existing payment left");
    } catch (error: any) {
        console.log("error:", error)
        return res.status(500).json({ message: "Error deleting transaction numbers" });
    }
})



paymentRouter.get("/", async (req: Request, res: Response) => {
    try {
        const deposit = await PaymentService.listDeposits()
        return res.status(200).json(deposit);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

//GET: List for the payment
paymentRouter.get("/balance", verifyToken, async (req: Request, res: Response) => {

    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const user = req.user
        const id: number = parseInt(user, 10);
        const listDeposit = await PaymentService.getAvailableBalance(id)
        // Render the EJS template and pass the data
        return res.status(200).json({ data: listDeposit })
    } catch (error: any) {
        console.error(error)
        return res.status(500).json(error.message);
    };
})

paymentRouter.get("/roi", verifyToken, async (req: Request, res: Response) => {
    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const user = req.user
        const id: number = parseInt(user, 10);
        const listDeposit = await PaymentService.calROI(id)
        // Render the EJS template and pass the data
        return res.status(200).json({ data: listDeposit })
    } catch (error: any) {
        console.error(error)
        return res.status(500).json(error.message);
    };

})

// Route for updating a user's deposit
paymentRouter.put('/update-deposit', async (req: Request, res: Response) => {
    try {
        // Retrieve username, email, transactionId, and amount from request body
        const { username, email, transactionId, amount } = req.body;

        // Call service function to update deposit amount
        const updatedDeposit = await PaymentService.updateDepositAmount(username, email, transactionId, amount);

        // Return success response with updated deposit details
        res.status(200).json({ message: 'Deposit updated successfully', deposit: updatedDeposit });
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});