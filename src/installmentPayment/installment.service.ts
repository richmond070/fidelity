import { getPlanConfig, validatePlanAmount, normalizePlanName, validateTargetAmount } from "../utils/payment.helpers";
import { prisma } from "../utils/db.sever"; // Ensure this points to your Prisma client instance

type InstallmentResult =
    | {
        status: 'completed';
        message: string;
    }
    | {
        status: 'completed' | 'in-progress';
        message: string;
        totalSaved: number;
        target: number;
        remainingAmount: number;
        progressPercentage: number;
        history: { amount: number; date: string; verified: boolean }[];
        installmentId: number;
    };


// Function to handle installment payments
export const makeInstallment = async ({
    userId,
    plan,
    amount,
    targetAmount, // New parameter for user-chosen target
    transactionId
}: {
    userId: number;
    plan: string;
    amount: number;
    targetAmount?: number; // Optional - will default to minimum if not provided
    transactionId: string
}): Promise<InstallmentResult> => {
    // Validate and normalize the plan
    const { config } = getPlanConfig(plan);
    const { min: planMinimum, max: planMaximum } = config.price;

    // Determine the target amount
    let finalTargetAmount: number;
    if (targetAmount !== undefined) {
        // User provided a target amount - validate it
        validateTargetAmount(plan, targetAmount);
        finalTargetAmount = targetAmount;
    } else {
        // No target provided - default to minimum
        finalTargetAmount = planMinimum;
    }

    // Validate the current payment amount
    validatePlanAmount(plan, amount);

    // Check if the user already has an installment in progress
    let installment = await prisma.installment.findFirst({
        where: { userId, plan: normalizePlanName(plan), status: 'in-progress' },
    });

    // If no installment found, check if the user has completed the plan
    if (!installment) {
        const completed = await prisma.installment.findFirst({
            where: { userId, plan: normalizePlanName(plan), status: 'completed' },
        });

        if (completed) {
            throw new Error(`You have already completed the "${plan}" plan.`);
        }

        // Create a new installment if none exists
        installment = await prisma.installment.create({
            data: {
                userId,
                plan: normalizePlanName(plan),
                amountPaid: 0,
                transactionId,
                targetAmount: finalTargetAmount, // Use the determined target amount
                status: 'in-progress',
                paymentHistory: [],
            },
        });
    } else {
        // If installment exists but user provides a different target amount
        if (targetAmount !== undefined && targetAmount !== installment.targetAmount) {
            throw new Error(
                `Cannot change target amount for existing installment. Current target: $${installment.targetAmount}, requested: $${targetAmount}`
            );
        }
        // Use the existing installment's target amount
        finalTargetAmount = installment.targetAmount;
    }

    // Validate the payment amount against the existing installment
    const history: { amount: number; date: string; verified: boolean }[] =
        (installment.paymentHistory as any[]) || [];

    // Calculate current totals
    const currentPaid = history.reduce((sum, p) => sum + p.amount, 0);
    const projectedTotal = currentPaid + amount;

    // Check if the payment exceeds the target amount
    if (projectedTotal > finalTargetAmount) {
        throw new Error(
            `Payment of $${amount} exceeds the target amount. Total so far: $${currentPaid}, target: $${finalTargetAmount}.`
        );
    }

    // Check for duplicate transaction
    const existingPayment = history.find(p =>
        p.amount === amount &&
        Math.abs(new Date(p.date).getTime() - Date.now()) < 60000 // Within 1 minute
    );

    if (existingPayment) {
        throw new Error(
            `Duplicate payment detected. A payment of $${amount} was already recorded recently.`
        );
    }

    // Add the new payment to the history
    history.push({
        amount,
        date: new Date().toISOString(),
        verified: false,
    });

    // Check if installment is complete
    const isComplete = projectedTotal === finalTargetAmount;

    // Update the installment with the new payment history
    const updatedInstallment = await prisma.installment.update({
        where: { id: installment.id },
        data: {
            amountPaid: projectedTotal,
            paymentHistory: history,
            transactionId,
            status: isComplete ? 'completed' : 'in-progress',
            ...(isComplete && { completedAt: new Date() }), // Add completion timestamp
        },
    });

    // Return the result
    return {
        status: isComplete ? 'completed' : 'in-progress',
        message: isComplete
            ? `🎉 Congratulations! You've completed your "${plan}" plan with a total of $${projectedTotal}!`
            : `💵 Payment of $${amount} received. Total saved: $${projectedTotal} / $${finalTargetAmount} for "${plan}".`,
        totalSaved: projectedTotal,
        target: finalTargetAmount,
        remainingAmount: finalTargetAmount - projectedTotal,
        progressPercentage: Math.round((projectedTotal / finalTargetAmount) * 100),
        history,
        installmentId: updatedInstallment.id,
    };
};

// Function to get all installment payments for a user
export const getUserInstallmentStatus = async (userId: number) => {
    // Fetch all installments for the user
    const installments = await prisma.installment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    // If no installments found, return an empty array
    if (installments.length === 0) {
        return [];
    }
    // Map the installments to a more readable format
    return installments.map(inst => ({
        plan: inst.plan,
        status: inst.status,
        amountPaid: inst.amountPaid,
        targetAmount: inst.targetAmount,
        transactionId: inst.transactionId,
        remaining: inst.targetAmount - inst.amountPaid,
        progress: `${((inst.amountPaid / inst.targetAmount) * 100).toFixed(2)}%`,
        lastUpdated: inst.updatedAt,
    }));
};

// Function to get the installment history for a specific plan
export const getInstallmentHistoryForPlan = async (userId: number, plan: string) => {
    // Validate the plan
    const installment = await prisma.installment.findFirst({
        where: {
            userId,
            plan,
            status: 'in-progress',
        },
    });

    // If no installment found, throw an error
    if (!installment) {
        throw new Error(`No installment found for plan "${plan}"`);
    }
    // Parse the payment history
    return {
        plan: installment.plan,
        paymentHistory: installment.paymentHistory,
        amountPaid: installment.amountPaid,
        transactionId: installment.transactionId,
        targetAmount: installment.targetAmount,
        status: installment.status,
    };
};

// Function for the admin to get all installment analytics
export const getInstallmentAnalytics = async () => {
    // Fetch all installments
    const installments = await prisma.installment.findMany();

    // If no installments found, return an empty object
    if (installments.length === 0) {
        return {};
    }
    // Group by plan and calculate totals
    const groupedByPlan = installments.reduce((acc, inst) => {
        // Check if the plan exists in the accumulator
        const planKey = inst.plan;
        // If it doesn't exist, initialize it
        if (!acc[planKey]) {
            // Initialize the plan with default values
            acc[planKey] = { totalUsers: 0, totalPaid: 0, completed: 0 };
        }
        // Update the totals
        acc[planKey].totalUsers += 1;
        // Update the total paid amount
        acc[planKey].totalPaid += inst.amountPaid;
        // Check if the installment is completed
        if (inst.status === 'completed') {
            acc[planKey].completed += 1;
        }
        // Return the accumulator for the next iteration
        return acc;
        // Return the final grouped result
    }, {} as Record<string, { totalUsers: number; totalPaid: number; completed: number }>);
    // Convert the result to an array of objects
    return groupedByPlan;
};


// Admin function to verify one or more payments
export const verifyInstallmentPayment = async (transactionId: string, verifyAll: boolean = false) => {
    const installment = await prisma.installment.findUnique({
        where: { transactionId },
    });

    if (!installment) {
        throw new Error("Installment not found.");
    }

    const history = (installment.paymentHistory as any[]) || [];

    let verifiedCount = 0;

    for (let i = 0; i < history.length; i++) {
        if (!history[i].verified) {
            history[i].verified = true;
            verifiedCount++;

            if (!verifyAll) break; // Only verify one if not in batch mode
        }
    }

    if (verifiedCount === 0) {
        throw new Error("All payments are already verified.");
    }

    const totalVerified = history
        .filter((p) => p.verified)
        .reduce((sum, p) => sum + p.amount, 0);

    const isComplete = totalVerified === installment.targetAmount;

    // const verifiedPayments = history.filter(p => p.verified);

    // if (!verifiedPayments.length) {
    //     throw new Error("No verified payments found.");
    // }

    // const transactionId = verifiedPayments[0].transactionId; // Pick the first one


    const updatedInstallment = await prisma.installment.update({
        where: { transactionId },
        data: {
            paymentHistory: history,
            amountPaid: totalVerified,
            status: isComplete ? 'completed' : 'in-progress',
        },
    });

    if (isComplete) {
        const { name: normalizedPlan, config } = getPlanConfig(installment.plan);
        const now = new Date();
        const endDate = new Date(now.getTime() + config.durationInMs);

        await prisma.userPlan.create({
            data: {
                userId: installment.userId,
                plan: normalizedPlan,
                startDate: now,
                endDate,
                status: "active",
            },
        });

        await prisma.deposit.create({
            data: {
                transactionId,
                amount: totalVerified,
                plan: installment.plan,
                userId: installment.userId,
                isVerified: false,
            },
        });
    }

    return {
        message: `✅ Verified ${verifiedCount} payment(s) for userId ${installment.userId}`,
        status: updatedInstallment.status,
        totalPaid: totalVerified,
        completed: isComplete,
    };
}

// Function to get the installment details and payment history for a specific plan
export const getInstallmentPaymentsForPlan = async (plan: string) => {
    const installments = await prisma.installment.findMany({
        where: {
            plan: normalizePlanName(plan),
        },
        select: {
            paymentHistory: true,
            user: {
                select: {
                    id: true,
                    userName: true,
                },
            },
        },
    });

    // If no installments found, throw an error
    if (!installments.length) {
        throw new Error(`No installments found for plan "${plan}"`);
    }

    // get the payment history for each user
    const userSummaries: Record<string, {
        userName: string;
        totalPaid: number;
        verifiedPayments: number;
        unverifiedPayments: number;
        payments: {
            amount: number;
            verified: boolean;
            date: Date;
        }[];
    }> = {};

    // Iterate through each installment and summarize the payment history
    for (const inst of installments) {
        const { id: userId, userName } = inst.user;

        if (!userSummaries[userId]) {
            userSummaries[userId] = {
                userName,
                totalPaid: 0,
                verifiedPayments: 0,
                unverifiedPayments: 0,
                payments: [],
            };
        }

        // Ensure paymentHistory is an array
        const history = inst.paymentHistory as any[] | null;
        if (!Array.isArray(history)) continue;

        // Iterate through the payment history and summarize
        for (const payment of history) {
            const amount = payment.amount ?? 0;
            const verified = payment.verified ?? false;
            const date = new Date(payment.date ?? new Date());

            userSummaries[userId].payments.push({ amount, verified, date });
            userSummaries[userId].totalPaid += amount;
            // Count verified and unverified payments
            if (verified) {
                userSummaries[userId].verifiedPayments += 1;
            } else {
                userSummaries[userId].unverifiedPayments += 1;
            }
        }
    }

    return Object.values(userSummaries);
};


// Function to get transaction details for a specific plan
export const getTransactionDetailsForPlan = async (plan: string) => {
    const installments = await prisma.installment.findMany({
        where: {
            plan: normalizePlanName(plan),
        },
        select: {
            id: true,
            targetAmount: true,
            paymentHistory: true,
            transactionId: true,
            user: {
                select: {
                    id: true,
                    userName: true,
                },
            },
        },
    });

    // If no installments found, throw an error
    if (!installments.length) {
        throw new Error(`No installments found for plan "${plan}"`);
    }

    const transactionDetails: {
        transactionId: string;
        status: 'in-progress' | 'completed';
        username: string;
        amountPaid: number;
        targetAmount: number;
        date: Date;
        verified: 'pending' | 'confirmed';
    }[] = [];

    // Iterate through each installment
    for (const inst of installments) {
        const { id: userId, userName } = inst.user;
        const targetAmount = inst.targetAmount ?? 0;
        const transactionId = inst.transactionId;

        // Ensure paymentHistory is an array
        const history = inst.paymentHistory as any[] | null;
        if (!Array.isArray(history)) continue;

        // Calculate total amount paid for this installment
        const totalAmountPaid = history.reduce((sum, payment) => {
            return sum + (payment.amount ?? 0);
        }, 0);

        // Determine status based on whether target amount is reached
        const status: 'in-progress' | 'completed' = totalAmountPaid >= targetAmount ? 'completed' : 'in-progress';


        // If there's no transactionId at the installment level, you might want to skip or log
        if (!transactionId) continue;

        // Process each payment in the history
        for (const payment of history) {
            const amount = payment.amount ?? 0;
            const verified = payment.verified ?? false;
            const date = new Date(payment.date ?? new Date());

            transactionDetails.push({
                transactionId,
                status,
                username: userName,
                amountPaid: amount,
                targetAmount,
                date,
                verified: verified ? 'confirmed' : 'pending',
            });
        }
    }

    return transactionDetails;
};