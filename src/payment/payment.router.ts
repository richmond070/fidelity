import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { auth, verifyToken } from "../utils/auth";
import jwt from "jsonwebtoken";

import * as PaymentService from "./payment.service";
import { createSecretKey } from "crypto";

export const paymentRouter = express.Router();

//GET: List for the payment
paymentRouter.get("/:userId", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.userId, 10)
    try {
        const payment = await PaymentService.listDeposit(id)
        return res.status(200).json({ data: payment })
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

paymentRouter.post("/payment", body("paymentPlan").isString(), body("amount").isInt(),
    body("userId").isInt(), body("createdAt").isDate().toDate(), verifyToken,
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token } = req.cookies;

        if (!token) {
            res.send('No token given')
        }

        const decoded = Credential



        try {
            const deposit = req.body
            const newDeposit = await PaymentService.makeDeposit(deposit)
            return res.status(201).json(newDeposit)
        } catch (error: any) {
            console.error("error:", error)
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



paymentRouter.get('/payment-form', (req: Request, res: Response) => {
    // Your authentication token
    const authToken = auth;
    res.send(`
    <html>
    <body>
      <h2>Deposit</h2>
      <!-- Include the authentication token in a JavaScript variable -->
      <script>
        const authToken = "${authToken}";
      </script>
      <!-- Rest of your HTML form -->
      <form>
        <!-- ... -->
      </form>
    </body>
    </html>
  `);
});
