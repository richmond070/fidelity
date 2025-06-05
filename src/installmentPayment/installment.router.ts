// routes/installment.router.ts
import express from 'express';
import {
    makeInstallment,
    getUserInstallmentStatus,
    getInstallmentHistoryForPlan,
    getInstallmentAnalytics,
    verifyInstallmentPayment,
    getInstallmentPaymentsForPlan,
    getTransactionDetailsForPlan

} from './installment.service';
import { verifyToken, authorization } from '../utils/auth';
import { body, validationResult } from "express-validator";

export const installmentRouter = express.Router();

// 
installmentRouter.post('/installment', verifyToken, authorization("USER"), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }

        const userId = req.user;
        const { plan, amount, targetAmount, transactionId } = req.body;

        const result = await makeInstallment({ userId, plan, amount, targetAmount, transactionId });
        res.status(200).json(result);
    } catch (error: any) {
        console.error('[INSTALLMENT_ROUTE_ERROR]', error);
        res.status(400).json({ error: error.message || 'Failed to process installment' });
    }
});


// ✅ Updated: Get user progress (userId from JWT token)
installmentRouter.get('/installment/status/me', verifyToken, authorization("USER"), async (req, res) => {
    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user;
        const status = await getUserInstallmentStatus(userId);
        res.status(200).json(status);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Updated: Get payment history for a specific plan (userId from JWT token)
installmentRouter.get('/installment/history/me/:plan', verifyToken, authorization("USER"), async (req, res) => {
    try {
        const { plan } = req.params;
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user;
        const history = await getInstallmentHistoryForPlan(userId, plan);
        res.status(200).json(history);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Keep the original routes as well if other parts of your app use them
installmentRouter.get('/installment/status/:userId', verifyToken, authorization("USER"), async (req, res) => {
    try {
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user;
        const status = await getUserInstallmentStatus(userId);
        res.status(200).json(status);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

installmentRouter.get('/installment/history/:userId/:plan', verifyToken, authorization("USER"), async (req, res) => {
    try {
        const { plan } = req.params;
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }
        const userId = req.user;
        const history = await getInstallmentHistoryForPlan(userId, plan);
        res.status(200).json(history);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
// ✅ New: Admin analytics (protect this route in production)
installmentRouter.get('/installment/analytics', async (req, res) => {
    try {
        const analytics = await getInstallmentAnalytics();
        res.status(200).json(analytics);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

installmentRouter.put('/installments/:id/verify', async (req, res) => {
    const transactionId = req.params.id;
    const { verifyAll } = req.body;

    if (!transactionId) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    try {
        const result = await verifyInstallmentPayment(transactionId, verifyAll === true);
        return res.status(200).json(result);
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message || 'Something went wrong' });
    }
});

// ✅ New: Get installment summary for a specific plan
installmentRouter.get('/installments/summary/:plan', async (req, res) => {
    const { plan } = req.params;

    if (!plan) {
        return res.status(400).json({ error: 'Plan is required in the URL' });
    }

    try {
        const summary = await getInstallmentPaymentsForPlan(plan);
        res.status(200).json({ plan, summary });
    } catch (error: any) {
        console.error('Error fetching installment summary:', error);
        res.status(500).json({ error: 'Failed to fetch installment summary' });
    }
});

// ✅ New: Get installment transactions for a specific plan
installmentRouter.get('/installments/views/:plan', async (req, res) => {
    const { plan } = req.params;

    if (!plan) {
        return res.status(400).json({ error: 'Plan is required in the URL' });
    }

    try {
        const views = await getTransactionDetailsForPlan(plan);
        res.status(200).json({ plan, views });
    } catch (error: any) {
        console.error('Error fetching installment summary:', error);
        res.status(500).json({ error: 'Failed to fetch installment summary' });
    }
});