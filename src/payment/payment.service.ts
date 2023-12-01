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

export const listDeposit = async (userId: number): Promise<DepositMade[] | null> => {

    return prisma.deposit.findMany({
        where: {
            userId: userId
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


