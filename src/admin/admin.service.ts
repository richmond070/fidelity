import { prisma } from "../utils/db.sever";
import { NextFunction, Request, Response } from "express"
import { User } from "@prisma/client";
import { Deposit } from "@prisma/client";
import { generateHash, compareHash } from "../utils/password";
import Authentication from "../utils/auth";
import { Roles } from "@prisma/client";

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
        res.status(200).json({
            data: user
        })
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
    const { transactionId, amount, userId }: Deposit = req.body;
    try {
        const payment = await prisma.deposit.create({
            data: {
                transactionId,
                amount,
                userId
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
    const { email, password } = req.body;

    try {
        const admin = await prisma.user.findUnique({
            where: {
                email
            },
        });

        if (!admin) {
            throw new Error("Email is not correct!");
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