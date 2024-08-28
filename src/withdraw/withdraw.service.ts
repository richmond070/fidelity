import { prisma } from "../utils/db.sever";
import { NextFunction, Request, Response } from "express"
import { calROI } from "../payment/payment.service";
import { processingWithdrawal } from "../template/emailTemplate";




// creating a withdrawal 
export async function createWithdraw(req: Request, res: Response) {
    const { walletAddress } = req.body

    try {
        // Type guard to narrow down the type
        if (typeof req.user !== 'number') {
            return res.status(403).json({ message: 'Invalid user ID' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: {
                id: req.user,
            },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const withdraw = await prisma.withdrawal.create({
            data: {
                walletAddress,
                isVerified: false,
                userId: req.user
            }

        })
        res.status(201).json({
            message: "Created successfully",
            data: { withdraw }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Sever error",
            message: "Error creating transaction please wait"
        })
    }
}

//list withdrawal that are not verified to notify the admin 
export async function listUnverifiedWithdrawal(req: Request, res: Response) {
    try {
        const withdraw = await prisma.withdrawal.findMany({
            where: {
                isVerified: false
            },
            select: {
                id: true,
                walletAddress: true,
                userId: true,
                user: { // Include user details
                    select: {
                        userName: true // Select only the required user fields
                    }
                }
            }

        })
        res.status(200).json({ withdraw })

        // res.render('admin', { withdraw: withdraw })
    } catch (error) {
        console.error('Error notifying admin:', error);
        throw new Error('Failed to notify admin');
    }
}



//verify all unverified payments 
export async function verifyWithdrawal(req: Request, res: Response): Promise<void> {
    try {
        // get the id 
        const { id } = req.body

        if (!id) {
            console.error('Deposit ID is missing in request')
            res.status(400).json({ error: 'Deposit ID is required' })
            return
        }

        //get the user withdrawal details 
        const unverifiedWithdrawDetails = await prisma.withdrawal.findUnique({
            where: {
                id: id,
                isVerified: false
            },
            include: {
                user: true,
            }
        })

        if (!unverifiedWithdrawDetails) {
            res.status(404).json({ error: 'No unverified deposit found' })
            return;
        }


        // Verify the deposit
        const updatedWithdrawal = await prisma.withdrawal.update({
            where: {
                id: id,
            },
            data: {
                isVerified: true,
            },
        });

        // If the updatedWithdrawal is null, it means the record was not found
        if (!updatedWithdrawal) {
            throw new Error('Withdrawal record not found');
        }

        // // Send email to the user
        await processingWithdrawal(unverifiedWithdrawDetails);


        res.status(200).json({ message: 'Withdrawal verified successfully' });
    } catch (error) {
        console.error('Error in verifyDeposit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

