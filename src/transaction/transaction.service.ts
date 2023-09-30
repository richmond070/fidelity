import { prisma } from "../utils/db.sever";

export const getTransaction = async (transactionId: number) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        });
        return transaction;
    } catch (error) {
        throw new Error('no transaction number');
    }
}