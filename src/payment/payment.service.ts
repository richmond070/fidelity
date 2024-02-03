import { prisma } from "../utils/db.sever";
import { verifyToken } from "../utils/auth";
import { User, getUser } from "../users/users.service"
import { Request, Response } from "express";

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

//get a new balance with a ROI
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
        const depositDate = new Date(deposit.createdAt);
        const timeElapsed = currentDate.getTime() - depositDate.getTime();

        // if (timeElapsed <= PlanConfig.durationInMs) {
        //     const dailyReturnRate = Math.pow(1 + PlanConfig.returnRate, timeElapsed / PlanConfig.durationInMs) - 1;
        //     return deposit.amount * (1 + dailyReturnRate)
        // }
        // return deposit.amount;

        const compoundingPeriods = timeElapsed / returnDuration;
        const continuousReturnRate = Math.pow(1 + PlanConfig.returnRate, compoundingPeriods);

        currentBalance *= continuousReturnRate

        return currentBalance

    };

    const newBalance = newDeposit.reduce((total, deposit) => total + calculateNewBalance(deposit), 0);
    const roundedBalance = Math.round(newBalance * 10) / 10;

    return roundedBalance;

};