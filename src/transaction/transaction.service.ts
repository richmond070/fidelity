import { prisma } from "../utils/db.sever";

type Transaction = {
    id: number;
    transactionNumber: string;
    depositId: number;
}

//POST a transaction number
export const makeTransaction = async (transaction: Omit<Transaction, "id">): Promise<Transaction> => {
    const { transactionNumber, depositId } = transaction

    return prisma.transaction.create({
        data: {
            transactionNumber,
            depositId,
        }
    });
};

//GET all transaction number
export const listTransactions = async (): Promise<Transaction[]> => {
    return prisma.transaction.findMany({
        select: {
            id: true,
            transactionNumber: true,
            depositId: true
        },
    });
};

//DELETE transaction numbers 
export const deleteTransactions = async (id: number): Promise<void> => {
    await prisma.transaction.delete({
        where: {
            id
        }
    });
};

//DELETE MANY transaction numbers
export const deleteAllTransactions = async (): Promise<void> => {
    await prisma.transaction.deleteMany()
}