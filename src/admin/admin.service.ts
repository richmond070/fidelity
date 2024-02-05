import { prisma } from "../utils/db.sever";
import { NextFunction, Request, Response } from "express"
import { User } from "@prisma/client";
import { Deposit } from "@prisma/client";
import { generateHash, compareHash } from "../utils/password";
import Authentication from "../utils/auth";
import { Roles } from "@prisma/client";
import { transporter } from "../handler/mail";
import ejs from "ejs";
import path from 'path';
// import { Server } from "socket.io";import WebSocket from "ws";


// //websocket sever instance
// let wss: WebSocket.Server;

// // setup websocket sever
// export function setupWebSocketSever(server: WebSocket.Server): void {
//     wss = server;
// }

// // Function to notify the admin about a new deposit
// export function notifyAdmin(deposit: Deposit): void {
//     if (wss) {
//         wss.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify({
//                     message: "New deposit pending approval",
//                     deposit,
//                 }))
//             }
//         })
//     }
// }

// USER

//create a user 
export const createUser = async (req: Request, res: Response) => {
    const { userName, fullName, email, password }: User = req.body
    const hashedPassword = await generateHash(password);
    try {
        const user = await prisma.user.create({
            data: {
                userName,
                fullName,
                email,
                password: hashedPassword,
                role: 'USER'
            }
        })
        res.status(201).json({
            message: "Created successfully",
            data: { userName, fullName, email, password }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Sever error",
            message: "Error creating user please wait"
        })
    }
};

//get a user with email and not ID

export const getUser = async (req: Request, res: Response) => {
    const { email, fullName } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                fullName: true
            }
        })
        res.status(200).json({
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Sever error",
            message: `${email} does not exist`
        })
    }
};

// get  all users that are registered 

export const getUsers = async (req: Request, res: Response) => {
    const { fullName, userName, email } = req.body
    try {
        const user = await prisma.user.findMany({
            where: {
                role: "USER"
            },
            // select: {
            //     fullName: true,
            //     userName: true,
            //     email: true
            // }
        })
     // res.status(200).json({
        //     data: user
        // })
        res.render('allUsers', { user: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Server error"
        })
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const email = req.body
    try {
        if (!email) {
            throw new Error("Email does not exist")
        }
        const deleteUser = await prisma.user.delete({
            where: {
                email
            }
        })
        res.status(204).json({
            message: "User deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Server error"
        })
    }
}


// TRANSACTION

//to get all transaction numbers 
// export const getTransaction = async (req: Request, res: Response) => {
//     try {
//         const transactionNumbers = await prisma.transaction.findMany()
//         res.status(200).json({
//             data: transactionNumbers
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             error: "Server error"
//         })
//     }
// }


//DEPOSIT
export const deposit = async (req: Request, res: Response) => {
    const { transactionId, amount, userId, plan }: Deposit = req.body;
    try {
        const payment = await prisma.deposit.create({
            data: {
                transactionId,
                amount,
                userId,
                plan,
                isVerified: true
            }
        });
        res.status(201).json(payment)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Sever error",
            message: "Error making payment please wait"
        })
    }
}

export const getAllDeposit = async (req: Request, res: Response) => {
    try {
        const deposit = await prisma.deposit.findMany({
            where: {
                isVerified: false
            },
            select: {
                amount: true,
                transactionId: true,
                plan: true,
                createdAt: true
            }
        });
        res.render('admin', { deposit: deposit })
    } catch (error: any) {
        console.error('Error fetching data from the database:', error.message);
        res.status(500).send('Internal Sever Error');
    }
}

export const getAllDeposits = async (req: Request, res: Response) => {
    try {
        const deposit = await prisma.deposit.findMany({
            where: {
                isVerified: true
            },
            select: {
                amount: true,
                transactionId: true,
                plan: true,
                createdAt: true
            }
        });
        // res.status(200).json({
        //     data: deposit
        // })
        res.render('trans', { deposit: deposit })
    } catch (error: any) {
        console.error('Error fetching data from the database:', error.message);
        res.status(500).send('Internal Sever Error');
    }
}

//ADMIN

// create an admin
export const createAdmin = async (req: Request, res: Response) => {
    const { userName, fullName, email, password }: User = req.body
    const hashedPassword = await generateHash(password);
    try {
        const user = await prisma.user.create({
            data: {
                userName,
                fullName,
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        })
        res.status(201).json({
            message: "Created successfully",
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Sever error",
            message: "Error creating user please wait"
        })
    }
};

//login an admin 
export const logAdmin = async (req: Request, res: Response) => {
    const { userName, password } = req.body;

    try {
        const admin = await prisma.user.findUnique({
            where: {
                userName
            },
        });

        if (!admin) {
            throw new Error("userName is not correct!");
        }

        if (admin.role !== 'ADMIN') {
            return res.status(403).json({ message: "User is not an admin!" });
        }

        const passwordMatch = await compareHash(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password is not correct!" });
        }
        const accessToken = Authentication.generateToken(
            admin.id,
            admin.role,
        );

        res.cookie("jwt", accessToken, { httpOnly: true });

        return res.status(200).json({
            accessToken
        })
        // else {
        //     throw new Error('Password is not correct!')
        // }
    } catch (error) {
        console.log(error)
        throw error
    }
};


// get a single admin
export const getAdmin = async (req: Request, res: Response) => {
    const { id } = req.params
    const { userName, email } = req.body

    try {
        const admin = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                userName: true,
                email: true
            }
        });
        res.status(200).json({
            message: "Admin found",
            data: admin
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Sever error",
            message: `Admin ${id} does not exist`
        })
    }
};

//get all admins
export const getAdmins = async (req: Request, res: Response) => {
    const { userName, email } = req.body
    try {
        const admin = await prisma.user.findMany({
            where: {
                role: "ADMIN"
            },
            select: {
                userName: true,
                email: true
            }
        })
        res.status(200).json({
            data: admin
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Server error"
        })
    }
};

//delete an Admin
export const deleteAdmin = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
        if (!id) {
            throw new Error('id does not exist')
        }
        const deleteAdmin = await prisma.user.delete({
            where: {
                id: id
            },
        })
        return res.status(200).json({
            message: `${deleteAdmin} deleted successfully`
        })
    }
    catch (err: any) {
        res.status(500).json({
            error: err.message,
        })
    }
}

// Function to get unverified deposits
export async function getUnverifiedDeposits(res: Response, req: Request): Promise<void> {
    try {
        const unverifiedDeposits = await prisma.deposit.findMany({
            where: {
                isVerified: false,
            }, select: {
                amount: true,
                transactionId: true,
                plan: true
            }
        });

        // // Emit a WebSocket event to notify admin
        // if (io) {
        //     io.emit('newDeposit', {
        //         amount,
        //         transactionId,
        //         plan,
        //     });
        // // }

        // // Log information about the new deposit
        // const depositInfo = {
        //     amount,
        //     transactionId,
        //     plan,
        // };
        // console.log(`A client just deposited $${amount} with a transaction ID: ${transactionId}`);

        // Return the deposit information
        // return depositInfo;
        res.render('admin', { unverifiedDeposits })
        // res.status(200).json({ unverifiedDeposits });
    } catch (error) {
        // console.error('Error in getUnverifiedDeposits:', error);
        // // res.status(500).json({ error: 'Internal Server Error' });

        console.error('Error notifying admin:', error);
        throw new Error('Failed to notify admin');
    }
}

// export const notifyAdminAboutDeposit = async (
//     io: Server,
//     userId: number,
//     amount: number,
//     transactionId: string,
//     plan: string
// ): Promise<void> => {
//     try {
//         //Perform admin notification logic here 
//         const unverifiedDeposits = await prisma.deposit.findMany({
//             where: {
//                 isVerified: false,
//             },
//             select: {
//                 amount: true,
//                 transactionId: true,
//                 plan: true,
//             },
//         });

//         //Emit a webSocket event to notify admin
//         io.emit('newDeposit', {
//             userId,
//             amount,
//             transactionId,
//             plan,
//         });

//         console.log(`Admin notified about user payment Amount: $${amount}, TransactionId: $${transactionId}`)
//     } catch (error: any) {
//         console.error('Error notifying admin:', error);
//         throw new Error('Failed to notify admin')
//     }
// }

// Function to verify a deposit



//to verify a deposit 
export async function verifyDeposit(req: Request, res: Response): Promise<void> {
    try {
        //get the user deposit details 
        const depositDetails = await prisma.deposit.findFirst({
            where: {
                isVerified: false
            }
        })

        if (!depositDetails) {
            res.status(404).json({ error: 'No unverified deposit found for the user' })
            return;
        }

        // Verify the deposit
        await prisma.deposit.update({
            where: {
                id: depositDetails.id,
            },
            data: {
                isVerified: true,
            },
        });

         // Send email to the user
         await sendDepositConfirmationEmail(depositDetails);

        res.status(200).json({ message: 'Deposit verified successfully' });
    } catch (error) {
        console.error('Error in verifyDeposit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Email for deposit to the client 
async function sendDepositConfirmationEmail(depositDetails: any): Promise<void> {
    try {
        // Render the EJS template
        const templatePath = path.join(__dirname, '../../views/emailDeposit.ejs');
        const emailContent = await ejs.renderFile(templatePath, {
            amount: depositDetails.amount,
            plan: depositDetails.plan,
            name: depositDetails.user.fullName,
        });

        // Compose the email
        const mailOptions = {
            from: "Eternal Trading <support@eternaltrading.org>",
            to: depositDetails.user.email,
            subject: 'Deposit Confirmation',
            html: emailContent,
        };

        // Send the email using the imported transporter
        await transporter.sendMail(mailOptions);
        console.log('Email sent: Deposit confirmation');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}