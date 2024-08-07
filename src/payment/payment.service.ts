import { prisma } from "../utils/db.sever";
import { verifyToken } from "../utils/auth";
import { User, getUser } from "../users/users.service"
import { Request, Response } from "express";
import { promises } from "dns";

type Deposit = {
    id: number;
    amount: number;
    transactionId: string;
    plan: string
};

type DepositMade = {
    transactionId: string;
    amount: number;
    createdAt: Date;
    userId: number;
    plan: string
    isVerified?: boolean;
};

interface PlanConfig {
    returnRate: number;
    durationInMs: number;
}

const PlanConfigs: Record<string, PlanConfig> = {
    PRIME: {
        returnRate: 0.1,
        durationInMs: 48 * 60 * 60 * 1000, //48hours
    },
    STANDARD: {
        returnRate: 0.15,
        durationInMs: 48 * 60 * 60 * 1000, //48days 
    },

    GOLD: {
        returnRate: 0.38,
        durationInMs: 48 * 60 * 60 * 1000, //1 week
    },
    PLATINUM: {
        returnRate: 0.50,
        durationInMs: 48 * 60 * 60 * 1000, //48days
    },
    INSURANCE: {
        returnRate: 0.2,
        durationInMs: 7 * 24 * 60 * 60 * 1000, //1 week
    },
    RealEstate: {
        returnRate: 0.75,
        durationInMs: 14 * 24 * 60 * 60 * 1000, //1 week
    },
    MERGER: {
        returnRate: 0.9,
        durationInMs: 14 * 24 * 60 * 60 * 1000, //1 week
    },
    IMMIGRATION: {
        returnRate: 0.75,
        durationInMs: 14 * 24 * 60 * 60 * 1000, //1 week
    },
    ETF: {
        returnRate: 0.55,
        durationInMs: 14 * 24 * 60 * 60 * 1000, //1 week
    },
};


//to list all verified payments made by a user 
export const listDeposit = async (userId: number): Promise<DepositMade[] | null> => {

    return prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true
        },
        select: {
            transactionId: true,
            amount: true,
            createdAt: true,
            userId: true,
            plan: true
        },
    });
};

//to list all deposit done by all user 
export const listDeposits = async (): Promise<Deposit[]> => {
    return prisma.deposit.findMany({
        select: {
            id: true,
            transactionId: true,
            plan: true,
            amount: true,
        },
    });
};

export const getDeposit = async (id: number): Promise<Deposit | null> => {
    return prisma.deposit.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            transactionId: true,
            amount: true,
            plan: true
        },

    })
}

//to make payment 
export const makeDeposit = async (deposit: Omit<DepositMade, "createdAt">): Promise<Deposit> => {
    const { transactionId, amount, userId, plan } = deposit;
    // const parsedDate: Date = new Date(createdAt);

    return prisma.deposit.create({
        data: {
            transactionId,
            amount,
            userId,
            plan,
            isVerified: false
        }
    })
};

// to delete a particular payment 
export const deletePayment = async (id: number): Promise<void> => {
    await prisma.deposit.delete({
        where: {
            id,
        },
    });
};

//DELETE MANY transaction numbers
export const deleteAllPayments = async (): Promise<void> => {
    await prisma.deposit.deleteMany()
}




//list of deposit made by one user 
export const getAvailableBalance = async (userId: number): Promise<number> => {

    const deposits = await prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true
        },
    });
    const availableBalance = deposits.reduce((total, deposit) => total + deposit.amount, 0);
    return availableBalance
};

export const calROI = async (userId: number): Promise<number> => {
    const newDeposit = await prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true,
            plan: {
                in: Object.keys(PlanConfigs)
            },
        },
    });

    const currentDate = new Date();

    const calculateNewBalance = (deposit: any) => {
        const PlanConfig = PlanConfigs[deposit.plan];
        const depositDate = new Date(deposit.createdAt)
        let currentBalance = deposit.amount;
        let timeElapsed = currentDate.getTime() - depositDate.getTime();

        const returnDuration = PlanConfig.durationInMs;

        if (timeElapsed < returnDuration) {
            return currentBalance;
        }

        const numberOfPeriods = Math.floor(returnDuration / PlanConfig.durationInMs)
        const returnAmount = deposit.amount * PlanConfig.returnRate * numberOfPeriods;

        //Reset the deposit date to the current date 
        deposit.createdAt = currentDate.toISOString();

        return deposit.amount + returnAmount
    };

    const newBalance = newDeposit.reduce((total, deposit) => total + calculateNewBalance(deposit), 0);
    const roundedBalance = Math.round(newBalance * 10) / 10;

    return roundedBalance;
};


// calculate new balance with the collected rio and total balance withdrawn

export const totalWithdraws = async (userId: number): Promise<number> => {
    const withdraws = await prisma.withdrawal.findMany({
        where: {
            userId: userId,
            isVerified: true
        }
    });

    const totalWithdrawals = withdraws.reduce((total, withdrawal) => total + Number(withdrawal.amount), 0);
    return totalWithdrawals
}


//Function to get final balance
export const getFinalBalance = async (userId: number): Promise<number> => {
    const roiBalance = await calROI(userId);
    const totalWithdrawals = await totalWithdraws(userId);

    const finalBalance = roiBalance - totalWithdrawals;
    return Math.round(finalBalance * 10) / 10;
}

// Define a function to update deposit amount
export async function updateDepositAmount(username: string, email: string, transactionId: string, amount: number): Promise<any> {
    try {
        // Find the user by username or email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { userName: username },
                    { email: email }
                ]
            }
        });

        console.log(`User found: ${user ? user.id : "not found"}`);

        // If user not found, throw error
        if (!user) {
            throw new Error('User not found');
        }

        // Find the deposit by transactionId and associated user
        const deposit = await prisma.deposit.findFirst({
            where: {
                transactionId: transactionId,
                userId: user.id
            }
        });

        // If deposit not found, throw error
        if (!deposit) {
            throw new Error('Deposit not found');
        }

        // Update the deposit amount
        const updatedDeposit = await prisma.deposit.update({
            where: {
                id: deposit.id
            },
            data: {
                amount: amount
            }
        });

        // Return the updated deposit
        return updatedDeposit;
    } catch (error) {
        throw error;
    }
}


