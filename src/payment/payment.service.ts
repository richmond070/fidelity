import { prisma } from "../utils/db.sever";
import { User, getUser } from "../users/users.service"

type Deposit = {
    id: number;
    paymentPlan: string;
    amount: number;
};

type DepositMade = {
    paymentPlan: string;
    amount: number;
    createdAt: Date;
    userId: number;
};

export const listDeposit = async (userId: number): Promise<DepositMade[] | null> => {

    return prisma.deposit.findMany({
        where: {
            userId: userId
        },
        select: {
            paymentPlan: true,
            amount: true,
            createdAt: true,
            userId: true
        },
    });
};

// export const userDeposit = async(): Promise<Deposit[] | null> => {
//     const id = getUser 
//     return prisma.deposit.findMany({
//         where: {
//             depositor: id
//         }, 
//         select: {
//             id: true,
//             paymentPlan: true,
//             amount: true
//         }
//     })
// }

export const getDeposit = async (id: number): Promise<Deposit | null> => {
    return prisma.deposit.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            paymentPlan: true,
            amount: true,
        },

    })
}

export const makeDeposit = async (deposit: DepositMade): Promise<Deposit> => {
    const { paymentPlan, amount, createdAt, userId } = deposit;
    const parsedDate: Date = new Date(createdAt);

    return prisma.deposit.create({
        data: {
            paymentPlan,
            amount,
            createdAt: parsedDate,
            userId
        }
    })
};


export const deletePayment = async (id: number): Promise<void> => {
    await prisma.user.delete({
        where: {
            id,
        },
    });
};