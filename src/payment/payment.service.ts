import { prisma } from "../utils/db.sever";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

// prisma unique constraint for error handling 
interface PrismaUniqueConstraintErrorMeta {
    target: string[];
}
interface PlanConfig {
    returnRate: number;
    durationInMs: number;
}

const PlanConfigs: Record<string, PlanConfig> = {
    PRIME: {
        returnRate: 0.2,
        durationInMs: 48 * 60 * 60 * 1000, //48hours
    },
    STANDARD: {
        returnRate: 0.25,
        durationInMs: 48 * 60 * 60 * 1000, //48days 
    },

    GOLD: {
        returnRate: 0.4,
        durationInMs: 48 * 60 * 60 * 1000, //1 week
    },
    PLATINUM: {
        returnRate: 0.52,
        durationInMs: 48 * 60 * 60 * 1000, //48days
    },
    INSURANCE: {
        returnRate: 0.25,
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

    try {
        return prisma.deposit.create({
            data: {
                transactionId,
                amount,
                userId,
                plan,
                isVerified: false
            }
        })
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const meta = error.meta as unknown as PrismaUniqueConstraintErrorMeta; // Type assertion
                const targetField = meta.target[0];
                throw new Error(`${targetField} is already in use`);
            }
        }
        throw error; // Re-throw the error if it's not handled
    }

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


// Function for active investment
// check if the user has bought any plan 
// check if the roi of that plan has been added to the balance
// if the time for the plan has been met then the active investment should return to 0 
// if not the amount should remain the same till the roi has been added  

export const activeInvestment = async (userId: number): Promise<number> => {
    const deposits = await prisma.deposit.findMany({
        where: {
            userId: userId,
            isVerified: true,
            plan: {
                in: Object.keys(PlanConfigs)
            }
        },
        include: {
            user: true
        }
    });

    const currentDate = new Date();

    const calculateActiveInvestment = (deposit: any) => {
        const planConfig = PlanConfigs[deposit.plan];
        const depositDate = new Date(deposit.createdAt);
        const timeElapsed = currentDate.getTime() - depositDate.getTime();
        const totalDuration = planConfig.durationInMs;
        const totalReturnRate = planConfig.returnRate;

        // If investment period is complete
        if (timeElapsed >= totalDuration) {
            return 0;
        }

        // Calculate hourly ROI accumulation
        const hoursElapsed = Math.floor(timeElapsed / (60 * 60 * 1000));
        const hourlyReturnRate = totalReturnRate / (totalDuration / (60 * 60 * 1000));
        const accumulatedROI = deposit.amount * (hoursElapsed * hourlyReturnRate);

        // Return deposit amount plus accumulated ROI
        return deposit.amount + accumulatedROI;
    };

    // Calculate total active investment with gradual ROI
    const totalActiveInvestment = deposits.reduce((total, deposit) => {
        return total + calculateActiveInvestment(deposit);
    }, 0);

    return Math.round(totalActiveInvestment * 10) / 10;
};