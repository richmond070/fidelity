import express from "express";
import type { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { verifyToken, authorization } from "../utils/auth";
// import { Server as WebSocketServer, WebSocket } from 'ws';
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
// import { getUnverifiedDeposits } from "../admin/admin.service";
// import { getSocketInstance } from "../utils/socket";
// import { Server } from "socket.io";




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

// paymentRouter.get("/:id", async (req: Request, res: Response) => {
//     const id: number = parseInt(req.params.id, 10);

//     try {
//         const deposit = await PaymentService.getDeposit(id)
//         if (deposit) {
//             return res.status(200).json({ data: deposit })
//         }
//     } catch (error: any) {
//         return res.status(500).json(error.message);
//     }
// });


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

            // Notify admin about the deposit
            // await getUnverifiedDeposits(req.app.get('io') as Server, req.user, req.body.amount, req.body.transactionId, req.body.plan, res);
            // const io = getSocketInstance();
            // io.emit('newDeposit', { message: 'New deposit received' })

            return res.status(201).json(newDeposit);
        } catch (error: any) {
            console.error("error:", error);
            return res.status(500).json(error.message);
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
        return res.status(500).json(error.message);
    };

})